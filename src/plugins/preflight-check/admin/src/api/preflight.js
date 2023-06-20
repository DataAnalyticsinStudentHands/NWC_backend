import axios from "axios";

const token = process.env.STRAPI_ADMIN_WEBTOKEN

const header = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const preflightRequests = {
  getData: async ({slug}) => {
    const exportURL =`${process.env.STRAPI_ADMIN_BACKEND_URL}/api/import-export-entries/content/export/contentTypes`;
    const params = {
      slug: slug,
      exportFormat: "json-v2",
      deepness: 2,
    };

    const results = await axios.post(exportURL, params, header);
    return JSON.parse(results.data.data);
  },

  importData: async (props) => {
    const {slug, dataContent, idField} = props;
    const importURL =`${process.env.STRAPI_ADMIN_BACKEND_URL}/api/import-export-entries/content/import`;

    const data = {
      slug: slug,
      data: JSON.stringify(dataContent),
      format: "json",
      idField:idField
    };

    axios.post(importURL, data, header);

  },
};
export default preflightRequests;
