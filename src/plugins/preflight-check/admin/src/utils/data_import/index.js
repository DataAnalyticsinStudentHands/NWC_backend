const _ = require("lodash");
const { cleanSheetObject, cleanSheetArray } = require("./utils/sheetData.js");
import * as config from "./config.json";
import qs from "qs";
import axios from "axios";

import { fetchDataWithRetry, delay } from "./utils/fetchData.js";

// Setup header for API calls
const token = process.env.STRAPI_ADMIN_WEBTOKEN;
const header = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

// Helper function to delete data (does retry if needed)
async function deletDataWithRetry(url, retryCount = 3, delay = 1000) {
  try {
    const response = await axios.delete(url, header);
    return response;
  } catch (error) {
    if (retryCount > 0) {
      console.error(`Request failed. Retrying ${retryCount} more times...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchDataWithRetry(url, retryCount - 1, delay);
    } else {
      throw error;
    }
  }
}

// Helper function to delete entries
async function deleteEntries(props) {
  const { id, route } = props;
  const url = `${process.env.STRAPI_ADMIN_BACKEND_URL}${route}/${id}`;
  await deletDataWithRetry(url);
}

// Helper function to remove existing content based on participant IDs
async function removeCurrentContent(props) {
  const { ids, attribute, route } = props;

  let url = `${process.env.STRAPI_ADMIN_BACKEND_URL}/api/nwc-participants`;
  const query = qs.stringify(
    {
      populate: [attribute],
      filters: {
        id: {
          $in: ids,
        },
      },
    },
    { encodeValuesOnly: true }
  );

  const result = await fetchDataWithRetry(`${url}?${query}`);

  let deleteIds = [];
  result.data.data.map((participant) => {
    participant.attributes[attribute].data.forEach((e) => {
      deleteIds.push(e.id);
    });
  });

  deleteIds.length > 0 &&
    deleteIds.forEach(async (id) => {
      await deleteEntries({ id: id, route: route });
    });
}

// imports participant data, will overwrite existing content
async function HandleParticipants(props) {
  const { sheets, key } = props;
  const { pk, sheet, lookup, slug } = config[key];

  const sheetData = sheets[sheet] || {};

  const data = {
    version: 2,
    data: {
      [slug]: cleanSheetObject(sheetData, lookup, pk),
    },
  };

  try {
    let url = `${process.env.STRAPI_ADMIN_BACKEND_URL}/api/import-export-entries/content/import`;
    let result = await axios.post(
      url,
      {
        slug: slug,
        data: JSON.stringify(data),
        format: "json",
        idField: pk,
      },
      header
    );
    console.debug(`${result.status}: ${key} processed`);
  } catch (error) {
    console.error("An error occurred while adding new content:", error);
  }
}

// imports one to many content, will first remove existing content by participant ID
async function HandleOne2(props) {
  const { sheets, key } = props;
  const { pk, sheet, route, attribute, lookup, lookup_grad, lookup_undergrad } =
    config[key];

  const sheetData = sheets[sheet] || {};

  let newSheetData = [];

  // pre-process sheet data
  lookup && (newSheetData = cleanSheetArray(sheetData, lookup));
  lookup_grad &&
    lookup_undergrad &&
    (newSheetData = [
      ...cleanSheetArray(sheetData, lookup_grad),
      ...cleanSheetArray(sheetData, lookup_undergrad),
    ]);

  // Remove all one to many content based on participant ID
  const partIDs = _.uniq(newSheetData.map((item) => item[pk]));

  await removeCurrentContent({
    ids: partIDs,
    attribute: attribute,
    route: route,
  });

  try {
    for (const item of newSheetData) {
      let url = `${process.env.STRAPI_ADMIN_BACKEND_URL}${route}`;
      let data = { data: item };
      let result = await axios.post(url, data, header);
      console.debug(
        `${result.status}: ${key} for ID ${item.participant} added`
      );
    }
  } catch (error) {
    console.error("An error occurred while adding new content:", error);
  }
}

// imports many to many content
async function HandleMany2(props) {
  const { sheets, key } = props;
  const { pk, sheet, slug } = config[key];

  // get existing content
  const response = await axios.post(
    `${process.env.STRAPI_ADMIN_BACKEND_URL}/api/import-export-entries/content/export/contentTypes`,
    {
      slug: slug,
      exportFormat: "json-v2",
      deepness: 2,
    },
    header
  );

  const parsedData = JSON.parse(response.data.data);
  const strapiData = parsedData.data[slug];

  // create an object to only hold the relations that need to inserted
  // into the collections with many2many data
  const obj = {};
  Object.values(strapiData).forEach((item) => {
    obj[item[pk]] = { [pk]: item[pk] };

    item.participants && (obj[item[pk]]["participants"] = item.participants);
    item.participants_for &&
      (obj[item[pk]]["participants_for"] = item.participants_for);
    item.participants_against &&
      (obj[item[pk]]["participants_against"] = item.participants_against);
    item.participants_spoke_for &&
      (obj[item[pk]]["participants_spoke_for"] = item.participants_spoke_for);
  });

  const sheetData = sheets[sheet] || [];
  sheetData.forEach((item) => {
    Object.entries(item).forEach(([key, value]) => {
      value === "yes" &&
        key !== "Children" && // exclude the boolean value for has children
        (obj[key]
          ? !obj[key].participants.includes(item["ID"]) &&
            obj[key].participants.push(item["ID"])
          : (obj[key] = {
              [pk]: key,
              participants: [item["ID"]],
            }));
      value === "for" &&
        (obj[key]
          ? !obj[key].participants_for.includes(item["ID"]) &&
            obj[key].participants_for.push(item["ID"])
          : (obj[key] = {
              [pk]: key,
              participants_for: [item["ID"]],
              participants_against: [],
              participants_spoke_for: [],
            }));
      value === "against" &&
        (obj[key]
          ? !obj[key].participants_against.includes(item["ID"]) &&
            obj[key].participants_against.push(item["ID"])
          : (obj[key] = {
              [pk]: key,
              participants_for: [],
              participants_against: [item["ID"]],
              participants_spoke_for: [],
            }));
      value === "spoke_for" &&
        (obj[key]
          ? !obj[key].participants_spoke_for.includes(item["ID"]) &&
            obj[key].participants_spoke_for.push(item["ID"])
          : (obj[key] = {
              [pk]: key,
              participants_for: [],
              participants_against: [],
              participants_spoke_for: [item["ID"]],
            }));
    });
  });

  try {
    let url = `${process.env.STRAPI_ADMIN_BACKEND_URL}/api/import-export-entries/content/import`;
    let result = await axios.post(
      url,
      {
        slug: slug,
        data: JSON.stringify({
          version: 2,
          data: {
            [slug]: obj,
          },
        }),
        format: "json",
        idField: pk,
      },
      header
    );
    console.debug(`${result.status}: ${key} processed`);
  } catch (error) {
    console.log(error);
  }
}

// setup for data import processing
const orderObj = {
  ParticipantsList: [
    "participant",
    "education_participant",
    "political_participant",
    "role_participant",
  ],
  One2ManyList: [
    "residence_in_1977",
    "spouse",
    "education_career",
    "education_edu",
    "political_office_held",
    "political_office_lost",
    "political_party",
    "leadership_in_org",
  ],
  Many2ManyList: [
    "basic_race",
    "race",
    "organizational_political",
    "role",
    "plank",
  ],
};

// imports data after passing preflight
async function importDemographicData(data) {
  const sheets = JSON.parse(data);

  for (const [key, value] of Object.entries(orderObj)) {
    switch (key) {
      case "ParticipantsList":
        for (const key of value) {
          await HandleParticipants({ sheets: sheets, key: key });
          await delay(1000);
        }
        break;
      case "One2ManyList":
        for (const key of value) {
          await HandleOne2({ sheets: sheets, key: key });
          await delay(1000);
        }
        break;
      case "Many2ManyList":
        for (const key of value) {
          await HandleMany2({ sheets: sheets, key: key });
          await delay(1000);
        }
        break;
    }
  }
}

export { fetchDataWithRetry, importDemographicData };
