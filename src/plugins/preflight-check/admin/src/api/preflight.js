import axios from "axios";

const token = process.env.STRAPI_WEBTOKEN
const header = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const preflightRequests = {
  getData: async () => {
    const exportURL =`https://dash.cs.uh.edu/api/import-export-entries/content/export/contentTypes`;
    const params = {
      slug: "api::nwc-participant.nwc-participant",
      exportFormat: "json-v2",
      deepness: 3,
    };

    const results = await axios.post(exportURL, params);
    return JSON.parse(results.data.data);
  },

  importData: async (dataContent) => {
    const importURL =`https://dash.cs.uh.edu/api/import-export-entries/content/import`;
    const data = {
      slug: "api::nwc-participant.nwc-participant",
      data: JSON.stringify(dataContent),
      format: "json",
    };

    axios.post(importURL, data);
  },
};
export default preflightRequests;
