const master = require("./res/master.json");

export default function checkWithMaser(sheets) {
    const masterCheck = {
      ID: "id",
      "Last Name": "last_name",
      "First Name": "first_name",
      State: "represented_state",
      "Middle Name and/or Initial and/or Nickname": "middle_name_initial",
      "Middle Name and/or Initial 1": "middle_name_initial",
      "Middle Name and/or Initial 2": "middle_name_initial_2",
      Nickname: "nickname",
      Name: "last_name",
    };
  
    let errors = [];
    sheets && Object.entries(sheets).forEach(([sheetName, sheetData]) => {
      // ingore the Sources sheet
        if (sheetName === "Sources") return;
      // preparcessing the data
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
      // check the data
        newSheetData?.forEach((row) => {
          const masterRow = _.find(master, { id: row.id });
          if (!masterRow) {
            errors.push({
              id: row.id,
              sheetName: sheetName,
              errorMessage: `No master row found for ${row.id}`,
            });
          } else {
            Object.keys(row).forEach((key) => {
              if (masterRow[key] !== row[key]) {
                errors.push({
                  id: row.id,
                  key: key,
                  sheetName: sheetName,
                  masterValue: masterRow[key],
                  sheetValue: row[key],
                  errorMessage: `Mismatch for ${row.id} ${key}: ${masterRow[key]}(master) !== ${row[key]}`,
                });
              }
            });
          }
        });
      });
      return errors;
  }