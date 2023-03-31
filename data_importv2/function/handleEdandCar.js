const fs = require('fs');
const { toObject, onlyInLeft, removeNullUndefined } = require('../utility/utility');
// const removeDuplicate = (arr) => arr.filter((i) => arr.indexOf(i) === arr.lastIndexOf(i));

const educationUndergradComponentFields = {
    'ID':'participant',
    'College: Undergrad degree (if more than one, list all but create new row for each)': 'degree',
    'College: Undergrad institution (if more than one, list all but create new row for each)': 'institution',
    'College: Undergrad year of graduation (if more than one, list all but create new row for each)': 'year'
}
const educationGraduateComponentFields = {
    'ID':'participant',
    'College: Graduate/ Professional degree (if more than one, list all but create new row for each)': 'degree',
    'College: Graduate/ Professional institution (if more than one, list all but create new row for each)': 'institution',
    'College: Graduate/ Professional year of graduation (if more than one, list all but create new row for each)': 'year',
}
const careerComponentFields = {
    'ID':'participant',
    'Category of Employment': 'category_of_employment',
    'Job/ Profession (if more than one, list all but create new row for each)': 'job_profession',
}
const spouseComponentFields = {
    'ID':'participant',
    "Spouse's Profession (if more than one, list all but create new row for each)": "spouse_profession"
}
const participantFileds = {
    'ID':'id',
    'Highest Level of Education Attained': 'highest_level_of_education_attained',
    'High School': 'high_school',
    'Military Service': 'military_service',
    'Union Member': 'union_member',
    'Income Level': 'income_level',
    'Optional: Fill out ONLY if NWC Registration Forms have specific dollar amount check boxes, otherwise indicate low, medium, high, or not reported per the NWC Registration forms in previous column.': 'income_level_dollar_amount',
}

const category_of_employment_lookup = {
    Agriculture: 'Agriculture',
    'Architecture…': 'Architecture and Engineering',
    'Arts…': 'Arts and Entertainment',
    'Clergy…': 'Clergy/Religious-Related Employment',
    'Construction…': 'Construction and Trade',
    'Corporate…': 'Corporate and Management',
    'Education…': 'Education and Libraries',
    'Finance…': 'Finance, Insurance, and Real Estate',
    'Food…': 'Food, Retail, and Hospitality',
    'Government…': 'Government/Public Sector/Nonprofit',
    'Homemaker': 'Homemaker',
    'Law…': 'Law and Legal Employment',
    'Law Enforcement…': 'Law Enforcement and Criminal Justice',
    'Manufacturing': 'Manufacturing and Industrial Production',
    'Media…': 'Media and Communications',
    'Medical…': 'Medical/Health Care/Social Work',
    'Office…': 'Office and Administrative Support',
    'Science…': 'Science and Technology',
    'Service…': 'Service Sector',
    'Small Business Owner': 'Small Business Owner',
    'Student': 'Student',
    'Transportation…': 'Transportation and Public Utilities',
    'Unemployed': 'Unemployed',
    'Wholesal': 'Wholesale and Retail'
}

async function handleEdandCareerData(data, participants, educations, careers, spouses_carees) {

    let participantData = [], educationData = [], careerData = [], spouseData = [];
    Object.values(participants).forEach((row) => {
        let participantDataObj = {};
        Object.keys(row).forEach((key) => {
            Object.values(participantFileds).includes(key) ? participantDataObj[key] = row[key] : null;
        })
        participantData.push(removeNullUndefined(participantDataObj))
    })

    Object.values(educations).forEach((row) => {
        educationData.push({
            degree: row.degree,
            institution: row.institution,
            year: row.year,
            participant: row.participant
        })
    })
    Object.values(careers).forEach((row) => {
        careerData.push({
            category_of_employment: row.category_of_employment,
            job_profession: row.job_profession,
            participant: row.participant
        })
    })
    Object.values(spouses_carees).forEach((row) => {
        spouseData.push({
            spouse_profession: row.spouse_profession,
            participant: row.participant
        })
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
    let participantDifference = onlyInLeft(newPartcipantsData, participantData, isSameParticipant);

    const isSameEducation = (a, b) => a.participant == b.participant && a.degree == b.degree && a.institution == b.institution && a.year == b.year;    
    let educationDifference = onlyInLeft(educationsNewData, educationData, isSameEducation);
    let newEducationInput = {}
    educationDifference.forEach((row, index) => {
        newEducationInput[Object.keys(educations).length+1+index] = {
            id: Object.keys(educations).length+1+index,
            ...row
        }
    })

    const isSameCareer = (a, b) => a.participant == b.participant && a.category_of_employment == b.category_of_employment && a.job_profession == b.job_profession;
    let careerDifference = onlyInLeft(careerNewData, careerData, isSameCareer);
    let newCareerInput = {}
    careerDifference.forEach((row, index) => {
        newCareerInput[Object.keys(careers).length+1+index] = {
            id: Object.keys(careers).length+1+index,
            ...row
        }
    })

    const isSameSpouse = (a, b) => a.participant == b.participant && a.spouse_profession == b.spouse_profession;
    let spouseDifference = onlyInLeft(spousesNewData, spouseData, isSameSpouse);
    let newSpouseInput = {}
    spouseDifference.forEach((row, index) => {
        newSpouseInput[Object.keys(spouses_carees).length+1+index] = {
            id: Object.keys(spouses_carees).length+1+index,
            ...row
        }
    })

    fs.writeFileSync('jsonData/Ed & Career Test.json', 
    JSON.stringify({
        "version": 2,
        "data": {
            "api::nwc-participant.nwc-participant": toObject(participantDifference, 'id'),
            "api::data-education.data-education": newEducationInput,
            "api::data-career.data-career": newCareerInput,
            "api::data-spouse-career.data-spouse-career": spouses_carees
        }
    }), 'utf-8');
}
module.exports = {
    handleEdandCareerData
}