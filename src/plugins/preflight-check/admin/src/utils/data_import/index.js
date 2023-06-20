// const config = JSON.parse(fs.readFileSync("./config.json"), "utf8");
const _ = require("lodash");
const {  difference, signId, removeNullUndefined } = require("./utils/utils.js");
const {  cleanStrapiObjectI, cleanStrapiArray } = require("./utils/strapiData.js");
const { cleanSheetObject, cleanSheetObjectI, cleanSheetArray, cleanResidenceSheetData } = require("./utils/sheetData.js");
import * as config from './config.json';
import preflightRequests from '../../api/preflight';

async function handleResidence(key, sheets){
    const {pk, lookup,sheet, api} = config[key];
    const sheetData = sheets[sheet];
    const newSheetData = cleanResidenceSheetData(sheetData, lookup, pk);
    const strapiData = await preflightRequests.getData({slug:api});

    const newStrapiData = {};
    Object.values(strapiData.data[api]).forEach((item) => {
        newStrapiData[item.residence_in_1977] = {
            participants: item.participants,
            residence_in_1977: item.residence_in_1977,
            total_population: item.total_population,
            median_household_income: item.median_household_income,
        }
    });

    Object.entries(newSheetData).forEach(([key, value]) => {
        newStrapiData[key] ?  (
            newStrapiData[key].participants = [
                ...newStrapiData[key].participants || [], 
                ...value.participants
            ]
        )
        : newStrapiData[key] = value;
    });

    const data = {
        version:2,
        data:{
            [api]:newStrapiData
        }
    }
    preflightRequests.importData({slug:api, dataContent:data, idField:pk});

}
async function OO (key, sheets){

    const {pk, lookup,sheet, api} = config[key];
    const sheetData = sheets[sheet];

    const newSheetData = cleanSheetObject(sheetData, lookup, pk);

    const data = {
        version: 2,
        data: {
            [api]:newSheetData
        }
    }
    preflightRequests.importData({slug:api, dataContent:data, idField:pk});
}
async function OOI (key, sheets){
    const {pk, lookup,sheet, api} = config[key];
    const sheetData = sheets[sheet];
	const strapiData = await preflightRequests.getData({slug:api});

	const newStrapiData = cleanStrapiObjectI(Object.values(strapiData.data[api]),lookup, pk);
	const newSheetData = cleanSheetObjectI(sheetData, lookup, pk);

    console.log(newSheetData);

    if(key === 'plank'){
        Object.entries(newSheetData).forEach(([key, value]) => {
            newStrapiData[key] ?  (
                newStrapiData[key].participants_for = [
                    ...newStrapiData[key].participants_for || [], 
                    ...value.participants_for || []
                ],
                newStrapiData[key].participants_against = [
                    ...newStrapiData[key].participants_against || [],
                    ...value.participants_against || []
                ],
                newStrapiData[key].participants_spoke_for = [
                    ...newStrapiData[key].participants_spoke_for || [],
                    ...value.participants_spoke_for || []
                ]
        )
        : newStrapiData[key] = value;
        });
    } else {
        Object.entries(newSheetData).forEach(([key, value]) => {
            newStrapiData[key] ?  (
                newStrapiData[key].participants = [
                    ...newStrapiData[key].participants || [], 
                    ...value.participants
                ]
            )
            : newStrapiData[key] = value;
        });
    }
    const data = {
        version: 2,
        data: {
            [api]:newStrapiData
        }
    }
    preflightRequests.importData({slug:api, dataContent:data, idField:pk});

    // const newObj = signId(diff,strapiData, lookup, pk);
    // return {[api]:newObj};
}

function AA(key, sheets, jsonData){
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

// function preFlightFile(sheets, jsonData){
async function preFlightFile(data){


    const sheets = JSON.parse(data);
    OO('participant', sheets);
    OO('education_participant', sheets)
    OO('politics_participant', sheets)
    OO('role_participant', sheets)

    // // // // OOI
    OOI('basic_race', sheets)
    OOI('race', sheets)
    OOI('organization_and_political', sheets)
    OOI('role', sheets)
    OOI('plank', sheets)
    handleResidence('residence_in_1977', sheets)

    // // // AA
    // const education_edu = AA('education_edu', sheets, jsonData)
    // const education_spouse_career = AA('education_spouse_career', sheets, jsonData)
    // const eudcation_career = AA('eudcation_career', sheets, jsonData)
    // const politics_office_hold = AA('politics_office_hold', sheets, jsonData)
    // const politics_office_lost = AA('politics_office_lost', sheets, jsonData)
    // const politics_office_spouse = AA('politics_office_spouse', sheets, jsonData)
    // const leadership_in_org = AA('leadership_in_org', sheets, jsonData)

    // const merged = _.merge(
    //     participant, education_participant, politics_participant, role_participant,
    //     basic_race, race, organization_and_political, role, plank,
    //     residence_in_1977, 
    //     education_edu, 
    //     education_spouse_career, eudcation_career, politics_office_hold, politics_office_lost, politics_office_spouse, leadership_in_org
    // )

    // return sheets
    
    // return ({
    //     version: 2,
    //     data: merged,
    // });
}

export { preFlightFile };