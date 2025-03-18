const qs = require("qs");
const axios = require("axios");

import { fetchDataWithRetry } from "./fetchData";

// Setup header for Strapi API calls
const token = process.env.STRAPI_ADMIN_WEBTOKEN;
const header = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const fetchData = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

// parse address information from Strapi into query format
async function parseStrapiData(strapiData) {
  let queries = [];
  let participantIds = [];

  strapiData.data.data.map((participantData) => {
    participantData.attributes.residence_in_1977s.data.map((address) => {
      const city = address.attributes.city_state.split(",")[0];
      const state = address.attributes.city_state.split(",")[1];
      let query = qs.stringify({
        country: "us",
        address_line1: address.attributes.street_address,
        place: city,
        region: state,
        postcode: address.attributes.zip_code,
        access_token: `${process.env.STRAPI_ADMIN_MAPBOXKEY}`,
      });
      queries.push(query);
      participantIds.push(participantData.id);
    });
  });

  // return values
  return {
    queries,
    participantIds,
  };
}

// will create lat/long for any participant where it is missing - will not update
export default async function getGeoLocation() {
  // get existing data
  let url = `${process.env.STRAPI_ADMIN_BACKEND_URL}/api/nwc-participants`;
  const strapi_query = qs.stringify(
    {
      populate: "residence_in_1977s",
      filters: {
        lat: {
          $null: true,
        },
      },
    },
    { encodeValuesOnly: true }
  );

  const strapiData = await fetchDataWithRetry(`${url}?${strapi_query}`);
  const { queries, participantIds } = await parseStrapiData(strapiData);

  //using the MapBox geocoding api with a key
  //https://api.mapbox.com/search/geocode/v6/forward?country=us&address_line1=1531%20Maryland&place=Houston&region=%20TX&postcode=77006&access_token=...
  const promises = queries.map(async (query, i) => {
    let result = await fetchData(
      `https://api.mapbox.com/search/geocode/v6/forward?${query}`
    );
    return {
      lon: result.features[0].geometry.coordinates[0],
      lat: result.features[0].geometry.coordinates[1],
      id: participantIds[i],
    };
  });

  const results = await Promise.all(promises);

  // update all empty lat/lon for participantIds
  results.forEach(async (item) => {
    const slug = "api::nwc-participant.nwc-participant";
    //data prep
    const data = {
      version: 2,
      data: {
        [slug]: {
          1: {
            id: item.id,
            lat: item.lat,
            lon: item.lon
          },
        },
      },
    };

    try {
      let url = `${process.env.STRAPI_ADMIN_BACKEND_URL}/api/import-export-entries/content/import`;
      let result = await axios.post(
        url,
        {
          slug: "api::nwc-participant.nwc-participant",
          data: JSON.stringify(data),
          format: "json",
          idField: "id",
        },
        header
      );
      console.debug(`${result.status}: Latitude processed`);
    } catch (error) {
      console.error("An error occurred while adding new content:", error);
    }
  });
}
