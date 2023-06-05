import axios from "axios";
const token = process.env.STRAPI_TOKEN;
const header = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
const preflightRequests = {
  getData: async () => {
    const exportURL =`/api/import-export-entries/content/export/contentTypes`;
    const params = {
      slug: "api::nwc-participant.nwc-participant",
      exportFormat: "json-v2",
      deepness: 3,
    };

    const results = await axios.post(exportURL, params, header);
    return JSON.parse(results.data.data);
  },

  importData: async (dataContent) => {
    const importURL ="/api/import-export-entries/content/import";
    const data = {
      slug: "api::nwc-participant.nwc-participant",
      data: JSON.stringify(dataContent),
      format: "json",
    };

    axios.post(importURL, data, header);
  },
};
export default preflightRequests;
