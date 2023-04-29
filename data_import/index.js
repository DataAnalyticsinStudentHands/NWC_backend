const xlsx = require("xlsx");
const fs = require("fs");
const _ = require("lodash");
const { toObject, difference, signId, removeNullUndefined } = require("./utils/utils.js");
const { cleanStrapiObject, cleanStrapiObjectI, cleanStrapiArray } = require("./utils/strapiData.js");
const { cleanSheetObject, cleanSheetObjectI, cleanSheetArray } = require("./utils/sheetData.js");

const workbook = xlsx.readFile(process.argv[2]);
const sheets = workbook.SheetNames.reduce((acc, sheetName) => {
    acc[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return acc;
}, {});

const jsonData = JSON.parse(fs.readFileSync(process.argv[3]), "utf8");
const config = JSON.parse(fs.readFileSync("./config.json"), "utf8");

function OO (key){
    const {pk, lookup,sheet, api} = config[key];
    const sheetData = sheets[sheet];
    const strapiData = jsonData.data[api];

    const newStrapiData = cleanStrapiObject(Object.values(strapiData),lookup, pk);
    const newSheetData = cleanSheetObject(sheetData, lookup, pk);

    const diff = difference(
        Object.values(newSheetData),
        Object.values(newStrapiData),
        _.isEqual
    );
    return {[api]:toObject(diff,pk)};
}
function OOI (key){
    const {pk, lookup,sheet, api} = config[key];
    const sheetData = sheets[sheet];
	const strapiData = jsonData.data[api];

	const newStrapiData = cleanStrapiObjectI(Object.values(strapiData),lookup, pk);
	const newSheetData = cleanSheetObjectI(sheetData, lookup, pk);

	const diff = difference(
		Object.values(newSheetData),
		Object.values(newStrapiData),
		_.isEqual
	);
    const newObj = signId(diff,strapiData, lookup, pk);
    return {[api]:newObj};
}

function AA(key){
    switch (key){
        
        case 'education_edu':{
            const {pk, lookup_gard, lookup_undergrad,sheet, api} = config[key];
            const sheetData = sheets[sheet];
            const strapiData = jsonData.data[api];
            const maxId = Math.max(...Object.keys(strapiData).map(Number));
        
            const newStrapiData = cleanStrapiArray(Object.values(strapiData), lookup_gard, pk);
            const newSheetData = [
                ...cleanSheetArray(sheetData, lookup_gard, pk), 
                ...cleanSheetArray(sheetData, lookup_undergrad, pk)
            ];        
            const diff = difference(
                newSheetData, 
                newStrapiData, 
                _.isEqual
            );
        
            const newObj = {};
            diff.forEach((item, index) => {
                newObj[index + maxId + 1] = {
                    id: index + maxId + 1,
                    ...item
                }
            });
            return {[api]:newObj};
        }
        // Residence should not mix in Basci Data.
        case 'residence_in_1977':{
            const {pk, lookup,sheet, api} = config[key];

            const sheetData = sheets[sheet];
            const strapiData = jsonData.data[api];
        
            const newStrapiData = cleanStrapiArray(Object.values(strapiData), lookup, pk);
            const newSheetData = {};
            cleanSheetArray(sheetData, lookup, pk).forEach((item) => {
                newSheetData[item.residence_in_1977]
                ? newSheetData[item.residence_in_1977].participants.push(item.participant_id)
                : newSheetData[item.residence_in_1977] = removeNullUndefined({
                    participants: [item.participant_id],
                    residence_in_1977: item.residence_in_1977,
                    total_population: item.total_population,
                    median_household_income: item.median_household_income,
                })
            });
        
            const diff = difference(
                Object.values(newSheetData), 
                newStrapiData, 
                _.isEqual
            );

            const newObj = signId(diff,strapiData, lookup, pk);
            return {[api]:newObj};

        }
        default:{
            const {pk, lookup,sheet, api} = config[key];
            const sheetData = sheets[sheet];
            const strapiData = jsonData.data[api];
            const maxId = Math.max(...Object.keys(strapiData).map(Number));
        
            const newStrapiData = cleanStrapiArray(Object.values(strapiData),lookup, pk);
            const newSheetData = cleanSheetArray(sheetData, lookup, pk);
        
            const diff = difference(
                newSheetData, 
                newStrapiData, 
                _.isEqual
            );
        
            const newObj = {};
            diff.forEach((item, index) => {
                newObj[index + maxId + 1] = {
                    id: index + maxId + 1,
                    ...item
                }
            });
            return {[api]:newObj};
        }
    }
}

async function preFlight() {
    // OO
    const participant = OO('participant')
    const education_participant = OO('education_participant')
    const politics_participant = OO('politics_participant')
    const role_participant = OO('role_participant')

    // OOI
    const basic_race = OOI('basic_race')
    const race = OOI('race')
    const organization_and_political = OOI('organization_and_political')
    const role = OOI('role')
    const plank = OOI('plank')
    // AA
    const residence_in_1977 = AA('residence_in_1977')
    const education_edu = AA('education_edu')
    const education_spouse_career = AA('education_spouse_career')
    const eudcation_career = AA('eudcation_career')
    const politics_office_hold = AA('politics_office_hold')
    const politics_office_lost = AA('politics_office_lost')
    const politics_office_spouse = AA('politics_office_spouse')
    const leadership_in_org = AA('leadership_in_org')



    const merged = _.merge(
        participant, education_participant, politics_participant, role_participant,
        basic_race, race, organization_and_political, role, plank,
        residence_in_1977, education_edu, education_spouse_career, eudcation_career, politics_office_hold, politics_office_lost, politics_office_spouse, leadership_in_org
    )

    fs.writeFileSync(
		"newData.json",
		JSON.stringify({
			version: 2,
			data: merged,
		}),
		"utf-8"
	);
}

preFlight()