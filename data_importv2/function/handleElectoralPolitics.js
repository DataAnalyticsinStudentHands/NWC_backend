const fs = require('fs');
const { toObject, onlyInLeft, removeNullUndefined, merge } = require('../utility/utility');
// Component
const political_office_held_lookup ={
    'ID':'participant',
    'Jurisdiction of Political Offices Held (if true for more than one category, create a new row for each)': 'jurisdiction',
    'Name of Political Offices Held (if more than one, list all but create new row for each)': 'political_office',
    'Start Year for Political Office': 'start_year',
    'End Year for Political Office (if office is still held leave this column blank)': 'end_year',
    'Optional Column:  Use this column only if the person is still serving in office.  Select "present" from the dropdown menu.': 'present'
}
// Component
const political_office_lost_lookup ={
    'ID':'participant',
    'Jurisdiction of Political Offices Sought but Lost': 'jurisdiction',
    'Name of Political Offices Sought but Lost (if more than one, list all but create new row for each)': 'political_office',
    'Year of Race that was Lost ': 'year'
}
// Component
const spouse_political_office_lookup = {
    'ID':'participant',
    "Spouse/partner's Political offices (include years) (if more than one, list all but create new column for each)": 'political_office'
}
// API
const participantLookup = {
    'ID':'id',
    'Political Party Membership': 'political_party_membership',
    'Identified Self as a Feminist': 'self_identified_feminist',
    // "President's Commission on the Status of Women (federal level)": 'federal_level',
    // 'state level Commission on the Status of Women (include years)': 'state_level',
    // 'county level Commission on the Status of Women (include years) ': 'county_level',
    // 'city level Commission on the Status of Women (include years)': 'city_level'
}

async function handleElectoralPoliticsData (data, participants, 
    political_offices_helds, 
    political_offices_losts, spouse_political_offices
) {
    let participantData = [], held_data = [], lost_data = [], spouse_data = [];
    Object.values(participants).forEach((row) => {
        let participantDataObj = {};
        Object.keys(row).forEach((key) => {
            Object.values(participantLookup).includes(key) ? participantDataObj[key] = row[key] : null;
        })
        Object.keys(removeNullUndefined(participantDataObj)).length > 1 ? participantData.push(removeNullUndefined(participantDataObj)) : null;
    })

    Object.values(political_offices_helds).forEach((row) => {
        held_data.push({
            jurisdiction: row.jurisdiction,
            political_office: row.political_office,
            start_year: row.start_year,
            end_year: row.end_year,
            present: row.present,
            participant: row.participant
        })
    });
    Object.values(political_offices_losts).forEach((row) => {
        lost_data.push({
            jurisdiction: row.jurisdiction,
            political_office: row.political_office,
            year: row.year,
            participant: row.participant
        })
    });
    Object.values(spouse_political_offices).forEach((row) => {
        spouse_data.push({
            political_office: row.political_office,
            participant: row.participant
        })
    });

    let newPartcipantsData = [], held_new_data = [], lost_new_data = [], spouse_new_data = [];
    data.forEach((row) => {
        let participantObj = {}, held_obj = {}, lost_obj = {}, spouse_obj = {};
        Object.keys(row).forEach((key) => {
            participantLookup[key] ? participantObj[participantLookup[key]] = row[key] : null;
            political_office_held_lookup[key] ? held_obj[political_office_held_lookup[key]] = row[key] : null;
            political_office_lost_lookup[key] ? lost_obj[political_office_lost_lookup[key]] = row[key] : null;
            spouse_political_office_lookup[key] ? spouse_obj[spouse_political_office_lookup[key]] = row[key] : null;
        });
        // handle political_office_held
        Object.keys(participantObj).forEach((key) => {
            participantObj[key] === 'present' ? participantObj[key] = true : null;
            participantObj[key] === 'yes' ? participantObj[key] = true : null;
            participantObj[key] === 'no' ? participantObj[key] = false : null;
        })
        // participants[participantObj.id] = {...participants[participantObj.id], ...participantObj};
        Object.keys(participantObj).length > 1 ? newPartcipantsData.push(participantObj) : null;

        // handle political_office_held
        // held_obj.participant == 22 ? console.log(held_obj) : null;
        held_obj.present === 'present' ? held_obj.present = true : null;
        Object.keys(held_obj).length > 1 && held_obj.jurisdiction !== 'none'
        ? held_new_data.push(held_obj) : null;
        // handle political_office_lost
        Object.keys(lost_obj).length > 1 &&  lost_obj.jurisdiction !== 'none'
        ? lost_new_data.push(lost_obj) : null;
        // handle spouse_political_office
        Object.keys(spouse_obj).length > 1 && spouse_obj.political_office !== 'none'
        ? spouse_new_data.push(spouse_obj) : null;
    })

    const isSameParticipant = (a, b) => a.id == b.id && 
        a.political_party_membership == b.political_party_membership && 
        a.self_identified_feminist == b.self_identified_feminist;
    let participantDifference = onlyInLeft(newPartcipantsData, participantData, isSameParticipant);


    const isSameHeld = (a, b) => a.participant == b.participant && 
        a.political_office == b.political_office && 
        a.jurisdiction == b.jurisdiction && 
        a.start_year == b.start_year && 
        a.end_year == b.end_year && 
        a.present == b.present;
    let heldDifference = onlyInLeft(held_new_data, held_data, isSameHeld);
    let newHeldInput = {};
    heldDifference.forEach((row, index) => {
        newHeldInput[Object.keys(political_offices_helds).length + index +1 ] = {id: Object.keys(political_offices_helds).length + index +1,...row}
    });

    const isSameLost = (a, b) => a.participant == b.participant && a.political_office == b.political_office && a.jurisdiction == b.jurisdiction && a.year == b.year;
    let lostDifference = onlyInLeft(lost_new_data, lost_data, isSameLost);
    let newLostInput = {};
    lostDifference.forEach((row, index) => {
        newLostInput[Object.keys(political_offices_losts).length + index +1 ] = {id: Object.keys(political_offices_losts).length + index +1,...row}
    });

    const isSameSpouse = (a, b) => a.participant == b.participant && a.political_office == b.political_office;
    let spouseDifference = onlyInLeft(spouse_new_data, spouse_data, isSameSpouse);
    let newSpouseInput = {};
    spouseDifference.forEach((row, index) => {
        newSpouseInput[Object.keys(spouse_political_offices).length + index +1 ] = {id: Object.keys(spouse_political_offices).length + index +1,...row}
    })

    fs.writeFileSync('jsonData/Electoral Politics.json', 
    JSON.stringify({
        "version": 2,
        "data": {
           "api::nwc-participant.nwc-participant": toObject(participantDifference, 'id'),
           "api::data-political-office-held.data-political-office-held": newHeldInput,
           "api::data-political-office-lost.data-political-office-lost": newLostInput,
           "api::data-spouse-political-office.data-spouse-political-office": newSpouseInput
        }
    }), 'utf-8');

    return{
        "api::nwc-participant.nwc-participant": toObject(participantDifference, 'id'),
        "api::data-political-office-held.data-political-office-held": newHeldInput,
        "api::data-political-office-lost.data-political-office-lost": newLostInput,
        "api::data-spouse-political-office.data-spouse-political-office": newSpouseInput
    }
}
module.exports = {
    handleElectoralPoliticsData
}