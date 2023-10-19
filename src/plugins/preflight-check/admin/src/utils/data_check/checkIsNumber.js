export default function checkIsNumber(sheets) {
    const numberColumnsList = [
        "ID",
        "Birthdate Month",
        "Birthdate Day",
        "Birthdate Year",
        "Age in 1977",
        "Deathdate Month",
        "Deathdate Day",
        "Deathdate Year",
        "Total Population of Place of Residence (check US Census)",
        "Median Household Income of Place of Residence (check US Census)",
        "Total Number of Children (born throughout lifetime)",
        "College: Undergrad year of graduation (if more than one, list all but create new row for each)",
        "College: Graduate/ Professional year of graduation (if more than one, list all but create new row for each)",
        "Start Year for Political Office",
        "End Year for Political Office (if office is still held leave this column blank)",
        "Year of Race that was Lost ",
        "Start Year for Spouse/Partner’s Political Office",
        "End Year for Spouse/Partner’s Political Office (if office is still held leave this column blank)",
        "Votes Received at State Meeting for NWC Delegate/Alternate",
      ];
    let errors = [];
    sheets && Object.entries(sheets).forEach(([sheetName, sheetData]) => {
         sheetData.forEach((row, index) => {
            Object.keys(row).forEach((key) => {
                if (numberColumnsList.includes(key)) {
                    if (isNaN(row[key])) {
                        errors.push({
                            sheetName: sheetName,
                            key: key,
                            participantID: row["ID"],
                            rowIndex: index+2,
                            errorMessage: `Not a valid number: ${row[key]}`,
                        });
                    }
                }
            });
        });
    });

    return _.uniqWith(errors, _.isEqual);;
};
