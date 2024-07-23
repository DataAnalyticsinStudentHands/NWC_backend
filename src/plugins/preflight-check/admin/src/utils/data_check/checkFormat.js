const format = require("./res/DemographicsTemplate.json");

function matchStringWithArray(string, array, stop_words) {
	stop_words = stop_words || [];
	let obj = {};
	string.split(" ").forEach((word) => {
		if (stop_words.includes(word)) return;
		array.forEach((item) => {
			if (
                _.includes(item, word) || 
                _.includes(item.split(" "), word)
            ) {
				obj[item] ? (obj[item] = obj[item] + 1) : (obj[item] = 1);
			}
		});
	});
	let maxCount = Math.max(...Object.values(obj));
	return Object.keys(obj).filter((key) => obj[key] === maxCount && maxCount > 1);
}

// checks all rows for correct headers (it will not check any headers that have no data)
export default function checkFormat(sheets) {
    const stop_sheet_list = ["Race & Ethnicity--Expanded", "Organizational & Political", "Validations", "Questions", "Sources"];
    let errors = [];
    sheets && Object.entries(sheets).forEach(([sheetName, sheetData]) => {
        if(!format[sheetName]) {
            let error = {
                sheetName: sheetName,
                attribute: `Not a valid sheet name`,
                suggestion: matchStringWithArray(sheetName, Object.keys(format), ["and"])
            }
            errors.push(error);
        } else {
            if(stop_sheet_list.includes(sheetName)) return;
            format[sheetName] && sheetData.forEach((row) => {
                Object.keys(row).forEach((key) => {
                    if(!format[sheetName].includes(key)) {
                        if(_.startsWith(key, "Notes")) return;
                        let error = {
                            sheetName: sheetName,
                            attribute: key,
                            suggestion: matchStringWithArray(key, format[sheetName], ["and"])
                        }
                        errors.push(error);
                    }
                });
            });
        }
    });

    return _.uniqWith(errors, _.isEqual);
}