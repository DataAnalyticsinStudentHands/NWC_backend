const fs = require('fs');
const { toObject, onlyInLeft, removeNullUndefined, merge } = require('../utility/utility');

const political_office_held_lookup = JSON.parse(fs.readFileSync('../utility/office_held.json', 'utf-8'));
const political_office_lost_lookup = JSON.parse(fs.readFileSync('../utility/office_lost.json', 'utf-8'));
const spouse_political_office_lookup = JSON.parse(fs.readFileSync('../utility/spouse_offices.json', 'utf-8'));
const participantLookup = JSON.parse(fs.readFileSync('../utility/political_participants.json', 'utf-8'));

async function handleElectoralPoliticsData (
    data, participants, political_offices_helds, political_offices_losts, spouse_political_offices
) {

    const participantData = Object.values(participants).map((row) => {
        const participantDataObj = {};
        Object.keys(row).forEach(key => {
            Object.values(participantLookup).includes(key) ? participantDataObj[key] = row[key] : null;
        });
        return removeNullUndefined(participantDataObj);
    })
    .filter(obj => Object.keys(obj).length > 1);

    const held_data = Object.values(political_offices_helds).map((row) => ({
        jurisdiction: row.jurisdiction,
        political_office: row.political_office,
        start_year: row.start_year,
        end_year: row.end_year,
        present: row.present,
        participant: row.participant
      }));

    const lost_data = Object.values(political_offices_losts).map((row) => ({
        jurisdiction: row.jurisdiction,
        political_office: row.political_office,
        year: row.year,
        participant: row.participant
    }));

    const spouse_data = Object.values(spouse_political_offices).map((row) => ({
        political_office: row.political_office,
        participant: row.participant,
        start_year: row.start_year,
        end_year: row.end_year,
    }));

    let newPartcipantsData = [], held_new_data = [], lost_new_data = [], spouse_new_data = [];
    data.forEach((row) => {
        let participantObj = {}, held_obj = {}, lost_obj = {}, spouse_obj = {};
        Object.keys(row).forEach((key) => {
            participantLookup[key] ? participantObj[participantLookup[key]] = row[key] : null;
            political_office_held_lookup[key] ? held_obj[political_office_held_lookup[key]] = row[key] : null;
            political_office_lost_lookup[key] ? lost_obj[political_office_lost_lookup[key]] = row[key] : null;
            spouse_political_office_lookup[key] ? spouse_obj[spouse_political_office_lookup[key]] = row[key] : null;
        });
        Object.keys(participantObj).forEach((key) => {
            participantObj[key] === 'present' ? participantObj[key] = true : null;
            participantObj[key] === 'yes' ? participantObj[key] = true : null;
            participantObj[key] === 'no' ? participantObj[key] = false : null;
        })
        Object.keys(participantObj).length > 1 ? newPartcipantsData.push(participantObj) : null;

        held_obj.present === 'present' ? held_obj.present = true : null;
        Object.keys(held_obj).length > 1 ? held_new_data.push(held_obj) : null;
        Object.keys(lost_obj).length > 1 ? lost_new_data.push(lost_obj) : null;
        Object.keys(spouse_obj).length > 1 ? spouse_new_data.push(spouse_obj) : null;
    })

    const isSameParticipant = (a, b) => a.id == b.id && 
        a.political_party_membership == b.political_party_membership && 
        a.self_identified_feminist == b.self_identified_feminist;
    const participantDifference = onlyInLeft(newPartcipantsData, participantData, isSameParticipant);

    const isSameHeld = (a, b) => a.participant == b.participant && 
        a.political_office == b.political_office && 
        a.jurisdiction == b.jurisdiction && 
        a.start_year == b.start_year && 
        a.end_year == b.end_year && 
        a.present == b.present;

    const heldDifference = onlyInLeft(held_new_data, held_data, isSameHeld);
    const newHeldInput = heldDifference.map((row, index) => ({
        id: Object.keys(political_offices_helds).length + index + 1,
        ...row,
    })).reduce((obj, row) => ({ ...obj, [row.id]: row }), {});
    // let newHeldInput = {};
    // heldDifference.forEach((row, index) => {
    //     newHeldInput[Object.keys(political_offices_helds).length + index +1 ] = {id: Object.keys(political_offices_helds).length + index +1,...row}
    // });

    const isSameLost = (a, b) => a.participant == b.participant && a.political_office == b.political_office && a.jurisdiction == b.jurisdiction && a.year == b.year;
    const lostDifference = onlyInLeft(lost_new_data, lost_data, isSameLost);
    let newLostInput = {};
    lostDifference.forEach((row, index) => {
        newLostInput[Object.keys(political_offices_losts).length + index +1 ] = {id: Object.keys(political_offices_losts).length + index +1,...row}
    });

    const isSameSpouse = (a, b) => a.participant == b.participant && a.political_office == b.political_office;
    const spouseDifference = onlyInLeft(spouse_new_data, spouse_data, isSameSpouse);
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