const format = require("./res/sheetHeader.json");

export default function checkFormat(sheets) {
    let errors = [];
    sheets && Object.entries(sheets).forEach(([sheetName, sheetData]) => {
        const headings = format[sheetName]?.headings;
        if (headings) {
            sheetData.forEach((row) => {
                Object.keys(row).forEach((key) => {
                    if (!headings.includes(key) && !_.startsWith(key, 'Notes')) {
                        let error = {
                            sheetName: sheetName,
                            key: key,
                            errorMessage: `Not a valid heading: ${sheetName} | ${key}`,
                        }
                        headings.forEach((header) => {
                            if(_.startsWith(header, key.substring(0, (key.length)/2))) {
                                error.suggestion = header;
                            } else if (_.startsWith(key, header.substring(0, (key.length)/2))) {
                                error.suggestion = header;
                            }
                        });
                        errors.push(error);
                    }
                });
            });
        }
    });

    return _.uniqWith(errors, _.isEqual);
}