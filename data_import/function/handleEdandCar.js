const fs = require('fs');
const { toObject, onlyInLeft, removeNullUndefined } = require('../utility/utility');

const educationUndergradComponentFields = JSON.parse(fs.readFileSync('../utility/undergrad.json', 'utf-8'));
const educationGraduateComponentFields = JSON.parse(fs.readFileSync('../utility/graduate.json', 'utf-8'));
const careerComponentFields = JSON.parse(fs.readFileSync('../utility/career.json', 'utf-8'));
const spouseComponentFields = JSON.parse(fs.readFileSync('../utility/spouse_career.json', 'utf-8'));
const participantFileds = JSON.parse(fs.readFileSync('../utility/education_participant.json', 'utf-8'));
const category_of_employment_lookup = JSON.parse(fs.readFileSync('../utility/category_of_employment.json', 'utf-8'));

async function handleEdandCareerData(data, participants, educations, careers, spouses_carees) {

    const participantData = Object.values(participants).map((row) => {
        let participantDataObj = {};
        Object.keys(row).forEach((key) => {
            Object.values(participantFileds).includes(key) ? participantDataObj[key] = row[key] : null;
        })
        return removeNullUndefined(participantDataObj)
    })
    const educationData = Object.values(educations).map((row) => {
        return {
            degree: row.degree,
            institution: row.institution,
            year: row.year,
            participant: row.participant
        }
    })
    const careerData = Object.values(careers).map((row) => {
        return {
            category_of_employment: row.category_of_employment,
            job_profession: row.job_profession,
            participant: row.participant
        }
    })
    const spouseData = Object.values(spouses_carees).map((row) => {
        return {
            spouse_profession: row.spouse_profession,
            participant: row.participant
        }
    })


    let newPartcipantsData = [], educationsNewData = [], careerNewData = [], spousesNewData = []
    data.forEach((row) => {
        let undergradObj = {}, graduateObj = {}, careerObj = {}, spouseObj = {} , participantObj = {};
        Object.keys(row).forEach((key) => {
            participantFileds[key] ? participantObj[participantFileds[key]] = row[key] : null;
            educationUndergradComponentFields[key] ? undergradObj[educationUndergradComponentFields[key]] = row[key] : null;
            educationGraduateComponentFields[key] ? graduateObj[educationGraduateComponentFields[key]] = row[key] : null;
            careerComponentFields[key] ? careerObj[careerComponentFields[key]] = row[key] : null;
            spouseComponentFields[key] ? spouseObj[spouseComponentFields[key]] = row[key] : null;
        })
        
        participantObj.union_member === 'yes' ? participantObj.union_member = true : null
        participantObj.union_member === 'no' ? participantObj.union_member = false : null
        participantObj.military_service === 'yes' ? participantObj.military_service = true : null
        participantObj.military_service === 'no' ? participantObj.military_service = false : null
        Object.keys(participantObj).length > 1 ? newPartcipantsData.push(participantObj) : null;

        Object.keys(undergradObj).length > 1 ? educationsNewData.push(undergradObj) : null;
        Object.keys(graduateObj).length > 1 ? educationsNewData.push(graduateObj) : null;

        careerObj.category_of_employment = category_of_employment_lookup[careerObj.category_of_employment];
        Object.keys(careerObj).length > 1 ? careerNewData.push(careerObj) : null;
        Object.keys(spouseObj).length > 1 ? spousesNewData.push(spouseObj) : null;

    })

    const isSameParticipant = (a, b) => a.id == b.id &&
        a.highest_level_of_education_attained == b.highest_level_of_education_attained &&
        a.high_school == b.high_school &&
        a.military_service == b.military_service &&
        a.union_member == b.union_member &&
        a.income_level == b.income_level &&
        a.income_level_dollar_amount == b.income_level_dollar_amount;
    const participantDifference = onlyInLeft(newPartcipantsData, participantData, isSameParticipant);

    const isSameEducation = (a, b) => a.participant == b.participant && a.degree == b.degree && a.institution == b.institution && a.year == b.year;    
    const educationDifference = onlyInLeft(educationsNewData, educationData, isSameEducation);
    let newEducationInput = {}
    educationDifference.forEach((row, index) => {
        newEducationInput[Object.keys(educations).length+1+index] = {
            id: Object.keys(educations).length+1+index,
            ...row
        }
    })

    const isSameCareer = (a, b) => a.participant == b.participant && a.category_of_employment == b.category_of_employment && a.job_profession == b.job_profession;
    const careerDifference = onlyInLeft(careerNewData, careerData, isSameCareer);
    let newCareerInput = {}
    careerDifference.forEach((row, index) => {
        newCareerInput[Object.keys(careers).length+1+index] = {
            id: Object.keys(careers).length+1+index,
            ...row
        }
    })

    const isSameSpouse = (a, b) => a.participant == b.participant && a.spouse_profession == b.spouse_profession;
    const spouseDifference = onlyInLeft(spousesNewData, spouseData, isSameSpouse);
    let newSpouseInput = {}
    spouseDifference.forEach((row, index) => {
        newSpouseInput[Object.keys(spouses_carees).length+1+index] = {
            id: Object.keys(spouses_carees).length+1+index,
            ...row
        }
    })

    fs.writeFileSync('jsonData/Ed & Career.json', 
    JSON.stringify({
        "version": 2,
        "data": {
            "api::nwc-participant.nwc-participant": toObject(participantDifference, 'id'),
            "api::data-education.data-education": newEducationInput,
            "api::data-career.data-career": newCareerInput,
            "api::data-spouse-career.data-spouse-career": newSpouseInput
        }
    }), 'utf-8');

    return{
        "api::nwc-participant.nwc-participant": toObject(participantDifference, 'id'),
        "api::data-education.data-education": newEducationInput,
        "api::data-career.data-career": newCareerInput,
        "api::data-spouse-career.data-spouse-career": newSpouseInput
    }
}
module.exports = {
    handleEdandCareerData
}