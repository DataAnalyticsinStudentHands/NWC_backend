import { fetchDataWithRetry } from "../data_import";

const masterdata = await fetchDataWithRetry(
  `${process.env.STRAPI_ADMIN_BACKEND_URL}/api/data-idc-masters`
);
const master = masterdata.data.data;

export default function checkWithMaster(sheets) {
    const masterCheck = {
      ID: "id",
      "Last Name": "last_name",
      "First Name": "first_name",
      State: "represented_state",
      "Middle Name and/or Initial 1": "middle_name_initial_1",
      "Middle Name and/or Initial 2": "middle_name_initial_2",
      Nickname: "nick_name",
      Name: "last_name",
    };
  
    let errors = [];
    sheets && Object.entries(sheets).forEach(([sheetName, sheetData]) => {
        if (sheetName === "Sources" || sheetName === "Questions") return;
        const newSheetData = sheetData.map((row) => {
          const newRow = {};
          Object.keys(row).forEach((key) => {
            const newKey = masterCheck[key];
            if (newKey) {
              newRow[newKey] = _.isString(row[key])
                ? newKey === "last_name"
                  ? row[key].trim().split(",")[0]
                  : row[key].trim()
                : row[key];
            }
          });
          return newRow;
        });
        // check the data for match in master idc
        newSheetData?.forEach((row) => {
          const masterRow = _.find(master, { id: row.id });
          if (!masterRow || masterRow === undefined) {
            errors.push({
              id: row.id,
              sheetName: sheetName,
              errorMessage: `No master row found for ${row.id}`,
            });
          } else {
            Object.keys(row).forEach((key) => {
              //don't check again for id
              if(key !== 'id') {
                if (masterRow.attributes[key] !== row[key]) {
                  errors.push({
                    id: row.id,
                    key: key,
                    sheetName: sheetName,
                    masterValue: masterRow[key],
                    sheetValue: row[key],
                    errorMessage: `Mismatch for ${row.id} ${key}: ${masterRow[key]}(master) !== ${row[key]}`,
                  });
                }
              }
            });
          }
        });
      });
      return _.uniqWith(errors, _.isEqual);
  }