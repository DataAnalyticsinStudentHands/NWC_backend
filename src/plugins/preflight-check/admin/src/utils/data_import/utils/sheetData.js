const { removeNullUndefined } = require("./utils.js");
const reg = /^\d+$/;
const category_of_employment = {
  Agriculture: "Agriculture",
  "Architecture…": "Architecture and Engineering",
  "Arts…": "Arts and Entertainment",
  "Clergy…": "Clergy/Religious-Related Employment",
  "Construction…": "Construction and Trade",
  "Corporate…": "Corporate and Management",
  "Education…": "Education and Libraries",
  "Finance…": "Finance, Insurance, and Real Estate",
  "Food…": "Food, Retail, and Hospitality",
  "Government…": "Government/Public Sector/Nonprofit",
  Homemaker: "Homemaker",
  "Law…": "Law and Legal Employment",
  "Law Enforcement…": "Law Enforcement and Criminal Justice",
  Manufacturing: "Manufacturing and Industrial Production",
  "Media…": "Media and Communications",
  "Medical…": "Medical/Health Care/Social Work",
  "Office…": "Office and Administrative Support",
  "Science…": "Science and Technology",
  "Service…": "Service Sector",
  "Small Business Owner": "Small Business Owner",
  Student: "Student",
  "Transportation…": "Transportation and Public Utilities",
  Unemployed: "Unemployed",
  Wholesal: "Wholesale and Retail",
};

function cleanSheetObject(data, lookup, pk) {
  const obj = {};
  data.forEach((row) => {
    const rowObj = {};
    Object.entries(lookup).forEach(([key, value]) => {
      rowObj[value] = reg.test(row[key]) ? parseInt(row[key]) : row[key];
    });
    Object.entries(rowObj).forEach(([key, value]) => {
      value === "ca." ? (rowObj[key] = true) : null;
      value === "yes" ? (rowObj[key] = true) : null;
      value === "no" ? (rowObj[key] = false) : null;
    });
    if (Object.keys(removeNullUndefined(rowObj)).length > 1)
      obj[rowObj[pk]] = removeNullUndefined(rowObj);
  });

  return obj;
}
function cleanSheetObjectI(data, lookup, pk) {
  const obj = {};
  data.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (value === "yes") {
        obj[key]
          ? obj[key].participants.push(row["ID"])
          : (obj[key] = {
              participants: [row["ID"]],
              [pk]: key,
            });
      }
      if (key === "Other Role" && value) {
        obj[value]
          ? obj[value].participants.push(row["ID"])
          : (obj[value] = {
              participants: [row["ID"]],
              [pk]: value,
            });
      }

      if (value === "for") {
        obj[key]
          ? obj[key].participants_for.push(row["ID"])
          : (obj[key] = {
              [pk]: key,
              participants_for: [
                ...(obj[key]?.participants_for || []),
                row["ID"],
              ],
              participants_against: [...(obj[key]?.participants_against || [])],
              participants_spoke_for: [
                ...(obj[key]?.participants_spoke_for || []),
              ],
            });
      }
      if (value === "against") {
        obj[key]
          ? obj[key].participants_against.push(row["ID"])
          : (obj[key] = {
              [pk]: key,
              participants_for: [...(obj[key]?.participants_for || [])],
              participants_against: [
                ...(obj[key]?.participants_against || []),
                row["ID"],
              ],
              participants_spoke_for: [
                ...(obj[key]?.participants_spoke_for || []),
              ],
            });
      }
      if (value === "spoke about with position unknown") {
        obj[key]
          ? obj[key].participants_spoke_for.push(row["ID"])
          : (obj[key] = {
              [pk]: key,
              participants_for: [...(obj[key]?.participants_for || [])],
              participants_against: [...(obj[key]?.participants_against || [])],
              participants_spoke_for: [
                ...(obj[key]?.participants_spoke_for || []),
                row["ID"],
              ],
            });
      }
    });
  });
  return obj;
}

function cleanSheetArray(data, lookup, pk) {
  const array = [];
  data.forEach((row) => {
    const rowObj = {};
    Object.entries(lookup).forEach(([key, value]) => {
      if (Array.isArray(value)) return;
      row[key] === "yes"
        ? (rowObj[value] = true)
        : row[key] === "present"
        ? (rowObj[value] = true)
        : row[key] === "no"
        ? (rowObj[value] = false)
        : reg.test(row[key])
        ? (rowObj[value] = parseInt(row[key]))
        : (rowObj[value] = row[key]);
    });

    // fix some special cases for types
    rowObj.zip_code ? (rowObj.zip_code = String(rowObj.zip_code)) : null;
    rowObj.category_of_employment
      ? (rowObj.category_of_employment =
          category_of_employment[rowObj.category_of_employment])
      : null;

    if (Object.keys(removeNullUndefined(rowObj)).length > 1)
      array.push(removeNullUndefined(rowObj));
  });
  return array;
}

module.exports = {
  cleanSheetObject,
  cleanSheetObjectI,
  cleanSheetArray,
};
