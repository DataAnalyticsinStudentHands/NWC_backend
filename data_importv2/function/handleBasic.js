const fs = require('fs');
const { toObject, onlyInLeft, removeNullUndefined, merge } = require('../utility/utility');

const participantLookup = {
    'ID': 'id',
    'Last Name': 'last_name',
    'First Name': 'first_name',
    'Middle Name and/or Initial ': 'middle_name_initial',
    'Nickname': 'nickname',
    'State': 'state',
    'Optional Column: Use only if Birthdate year is an approximation.  In such cases use dropdown menu and select ca.': 'birth_ca',
    'Birthdate Month': 'birth_month',
    'Birthdate Day': 'birth_day',
    'Birthdate Year': 'birth_year',
    'Optional Column: Fill out ONLY if birth year or Age in 1977 not found. Use Age Range from NWC Registration forms as indicated in dropdown menu.': 'age_range',
    'Age in 1977': 'age_in_1977',
    'Deathdate Month': 'death_month',
    'Deathdate Day':'death_day',
    'Deathdate Year': 'death_year',
    'Place of Birth': 'place_of_birth',
    'Marital Classification': 'marital_classification',
    'Name of Spouse': 'name_of_spouse',
    'Religion': 'religion',
    'Gender ': 'gender',
    'Sexual Orientation': 'sexual_orientation',
    'Total Number of Children (born throughout lifetime)': 'total_number_of_children',
}

const residenceIn1977Lookup = {
    'ID': 'participant_id',
    'Residence in 1977': 'residence_in_1977',
    'Total Population of Place of Residence (check US Census)': 'total_population',
    'Median Household Income of Place of Residence (check US Census)': 'median_household_income',
}

async function handleBasicData(data, participants, residences){

    let participantData = []; 
    Object.values(participants).forEach((participant) => {
        let participantDataObj = {};
        Object.keys(participant).forEach((key) => {
            Object.values(participantLookup).includes(key) ? participantDataObj[key] = participant[key] : null;
        });
        participantData.push(removeNullUndefined(participantDataObj));
    });

    let residenceData = Object.values(residences).map((residence) => {
        return {
            participants: residence.participants,
            residence_in_1977: residence.residence_in_1977,
            total_population: residence.total_population,
            median_household_income: residence.median_household_income
        }
    });

    let newPartcipantsData = [], newResidencesData = {};
    data.forEach((row) => {
        let newParticipantObj = {}, newResidencesObj = {};
        Object.keys(row).forEach((key) => {
            participantLookup[key] ? newParticipantObj[participantLookup[key]] = row[key] : null;
            residenceIn1977Lookup[key] ? newResidencesObj[residenceIn1977Lookup[key]] = row[key] : null;
        });
        newParticipantObj.birth_ca === 'ca.' ? newParticipantObj.birth_ca = true : null; // convert 'ca.' to true
        newPartcipantsData.push(newParticipantObj);

        newResidencesData[newResidencesObj.residence_in_1977]
        ? newResidencesData[newResidencesObj.residence_in_1977].participants.push(newResidencesObj.participant_id)
        : newResidencesData[newResidencesObj.residence_in_1977] = {
            participants: [newResidencesObj.participant_id],
            residence_in_1977: newResidencesObj.residence_in_1977,
            total_population: newResidencesObj.total_population,
            median_household_income: newResidencesObj.median_household_income
        };
    });

    const isSameParticipant = (a,b) => a.id === b.id && 
        a.last_name === b.last_name && 
        a.first_name === b.first_name && 
        a.middle_name_initial === b.middle_name_initial &&
        a.nickname === b.nickname &&
        a.state === b.state &&
        a.birth_ca === b.birth_ca &&
        a.birth_month === b.birth_month &&
        a.birth_day === b.birth_day &&
        a.birth_year === b.birth_year &&
        a.age_range === b.age_range &&
        a.age_in_1977 === b.age_in_1977 &&
        a.death_month === b.death_month &&
        a.death_day === b.death_day &&
        a.death_year === b.death_year &&
        a.place_of_birth === b.place_of_birth &&
        a.marital_classification === b.marital_classification &&
        a.name_of_spouse === b.name_of_spouse &&
        a.religion === b.religion &&
        a.gender === b.gender &&
        a.sexual_orientation === b.sexual_orientation &&
        a.total_number_of_children === b.total_number_of_children;
    let participantDifference = onlyInLeft(newPartcipantsData, participantData, isSameParticipant);

    const isSameResidence = (a,b) => a.participants.sort().join(',') === b.participants.sort().join(',') &&
        a.residence_in_1977 === b.residence_in_1977 &&
        a.total_population == b.total_population &&
        a.median_household_income == b.median_household_income;
    let residenceDifference = onlyInLeft(Object.values(newResidencesData), residenceData, isSameResidence);
    let newResidenceInput = {};
    residenceDifference.forEach((residence) => {
        toObject(Object.values(residences), 'residence_in_1977')[residence.residence_in_1977]
        ? newResidenceInput[toObject(Object.values(residences), 'residence_in_1977')[residence.residence_in_1977].id] = {
            id: toObject(Object.values(residences), 'residence_in_1977')[residence.residence_in_1977].id,
            ...residence,
            participants: merge(toObject(Object.values(residences), 'residence_in_1977')[residence.residence_in_1977].participants, residence.participants)
        }
        : newResidenceInput[Object.keys(residences).length + 1] = {
            id: Object.keys(residences).length + 1,
            ...residence
        }
    });

    fs.writeFileSync('jsonData/Basic Data.json', JSON.stringify({
        "version": 2,
        "data": {
            "api::nwc-participant.nwc-participant": toObject(participantDifference, 'id'),
            "api::resident-in-1977.resident-in-1977": newResidenceInput
        }
    }), 'utf-8');

    return {
        "api::nwc-participant.nwc-participant": toObject(participantDifference, 'id'),
        "api::resident-in-1977.resident-in-1977": newResidenceInput
    }
}

module.exports = {
    handleBasicData
  }