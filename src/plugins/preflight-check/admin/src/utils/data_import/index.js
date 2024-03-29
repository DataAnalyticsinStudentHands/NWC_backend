const _ = require("lodash");
const { cleanSheetObject, cleanSheetArray } = require("./utils/sheetData.js");
import * as config from "./config.json";
import axios from "axios";
import qs from "qs";
const token = process.env.STRAPI_ADMIN_WEBTOKEN
const header = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function fetchDataWithRetry(url, retryCount = 3, delay = 1000) {
  try {
    const response = await axios.get(url);
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

async function deleteEntries(props) {
  const { id, route } = props;
  const url = `${process.env.STRAPI_ADMIN_BACKEND_URL}${route}/${id}`;
  await deletDataWithRetry(url);
  // let result = await deletDataWithRetry(url);
  // console.log(`${result.status} :Deleted ${id}`);
}

async function removeCurrentContent(props) {
  const { ids, attribute, route } = props;

  let url = `${process.env.STRAPI_ADMIN_BACKEND_URL}/api/nwc-participants`;
  const query = qs.stringify(
    {
      fields: [attribute],
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

async function HandleM2M(props) {
  const { sheets, key } = props;
  const { pk, sheet, route, attribute, lookup, lookup_gard, lookup_undergrad } =
    config[key];

  const sheetData = sheets[sheet] || {};

  let newSheetData = [];

  lookup && (newSheetData = cleanSheetArray(sheetData, lookup));
  lookup_gard &&
    lookup_undergrad &&
    (newSheetData = [
      ...cleanSheetArray(sheetData, lookup_gard),
      ...cleanSheetArray(sheetData, lookup_undergrad),
    ]);

  // Remove all many to many content
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
      await axios.post(url, data, header);
      //   let result = await axios.post(url, data);
      //   console.log(`${result.status}: ${key} Added`);
    }
  } catch (error) {
    console.error("An error occurred while adding new content:", error);
  }
}

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
    let result = await axios.post(url, {
      slug: slug,
      data: JSON.stringify(data),
      format: "json",
      idField: pk,
    }, header);
    console.log(`${result.status}: ${key} Added`);
  } catch (error) {
    console.error("An error occurred while adding new content:", error);
  }
}

async function HandleOne2Many(props) {
  const { sheets, key } = props;
  const { pk, sheet, slug } = config[key];

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
    item.total_population &&
      (obj[item[pk]]["total_population"] = parseInt(item.total_population));
    item.median_household_income &&
      (obj[item[pk]]["median_household_income"] = parseInt(
        item.median_household_income
      ));
  });

  const sheetData = sheets[sheet] || [];
  sheetData.forEach((item) => {
    Object.entries(item).forEach(([key, value]) => {
      value === "yes" &&
        key !== "Children" &&
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

      key === "Residence in 1977" &&
        (obj[value]
          ? !obj[value].participants.includes(item["ID"]) &&
            obj[value].participants.push(item["ID"])
          : (obj[value] = {
              [pk]: value,
              participants: [item["ID"]],
              total_population:
                item[
                  "Total Population of Place of Residence (check US Census)"
                ],
              median_household_income:
                item[
                  "Median Household Income of Place of Residence (check US Census)"
                ],
            }));
    });
  });

  try {
    let url = `${process.env.STRAPI_ADMIN_BACKEND_URL}/api/import-export-entries/content/import`;
    let result = await axios.post(url, {
      slug: slug,
      data: JSON.stringify({
        version: 2,
        data: {
          [slug]: obj,
        },
      }),
      format: "json",
      idField: pk,
    }, header);
    console.log(`${result.status}: ${key} Added`);
  } catch (error) {
    console.log(error);
  }
}
const orderObj = {
  ParticipantsList: [
    "participant",
    "education_participant",
    "politics_participant",
    "role_participant",
  ],
  One2ManyList: [
    "basic_race",
    "race",
    "organizational_and_political",
    "role",
    "plank",
    "residence_in_1977",
  ],
  Mant2ManyList: ["education_career", "education_edu", "politics_office_hold", "politics_office_lost"],
};

// function preFlightFile(sheets, jsonData){
async function preFlightFile(data) {
  const sheets = JSON.parse(data);

  for (const [key, value] of Object.entries(orderObj)) {
    switch (key) {
      case "ParticipantsList":
        for (const key of value) {
          await HandleParticipants({ sheets: sheets, key: key });
          console.log(`Finished ${key}`);
          await delay(1000);
        }
        break;
      case "One2ManyList":
        for (const key of value) {
          await HandleOne2Many({ sheets: sheets, key: key });
          console.log(`Finished ${key}`);
          await delay(1000);
        }
        break;
      case "Mant2ManyList":
        for (const key of value) {
          await HandleM2M({ sheets: sheets, key: key });
          console.log(`Finished ${key}`);
          await delay(1000);
        }
        break;
    }
  }
}

export { preFlightFile };
