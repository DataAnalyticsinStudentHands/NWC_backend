const CSVToJSON = require("csvtojson");
const _sth = require("./utility.js");
const fs = require("fs");
var apiObj = JSON.parse(fs.readFileSync("./data/api.json", "utf-8"));
var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));

var categoryLookup = {
    Agriculture: { id: 1, value: 'Agriculture' },
    'Architecture…': { id: 2, value: 'Architecture and Engineering' },
    'Arts…': { id: 3, value: 'Arts and Entertainment' },
    'Clergy…': { id: 4, value: 'Clergy/Religious-Related Employment' },
    'Construction…': { id: 5, value: 'Construction and Trade' },
    'Corporate…': { id: 6, value: 'Corporate and Management' },
    'Education…': { id: 7, value: 'Education and Libraries' },
    'Finance…': { id: 8, value: 'Finance, Insurance, and Real Estate' },
    'Food…': { id: 9, value: 'Food, Retail, and Hospitality' },
    'Government…': { id: 10, value: 'Government/Public Sector/Nonprofit' },
    Homemaker: { id: 11, value: 'Homemaker' },
    'Law…': { id: 12, value: 'Law and Legal Employment' },
    'Law Enforcement…': { id: 13, value: 'Law Enforcement and Criminal Justice' },
    Manufacturing: { id: 14, value: 'Manufacturing and Industrial Production' },
    'Media…': { id: 15, value: 'Media and Communications' },
    'Medical…': { id: 16, value: 'Medical/Health Care/Social Work' },
    'Office…': { id: 17, value: 'Office and Administrative Support' },
    'Science…': { id: 18, value: 'Science and Technology' },
    'Service…': { id: 19, value: 'Service Sector' },
    'Small Business Owner': { id: 20, value: 'Small Business Owner' },
    Student: { id: 21, value: 'Student' },
    'Transportation…': { id: 22, value: 'Transportation and Public Utilities' },
    Unemployed: { id: 23, value: 'Unemployed' },
    Wholesal: { id: 24, value: 'Wholesale and Retail' }
  }
async function education_and_career() {
    try{
        const csvData = await CSVToJSON().fromFile("./data/Ed & Career.csv");
        let participant_data = [];
        //Component data
        let education_data = [], career_data = [], spouse_profession_data = []; 
        // API data
        let education_level_data = [];

        csvData.forEach((e) => {
            let values = Object.values(e);
            values[2] !== "NA" ? education_level_data.push({
                participant_id: parseInt(e.ID),
                education_level: values[2],
            }) : null;
            values[3] !== "NA" ? participant_data.push({
                participant_id: parseInt(e.ID),
                high_school: values[3],
            }) : null;
            values[4] !== "NA" ? education_data.push({
                participant_id: parseInt(e.ID),
                degree: values[4],
                college: values[5],
                year: parseInt(values[6]),
            }) : null;
            values[7] !== "NA" ? education_data.push({
                participant_id: parseInt(e.ID),
                degree: values[7],
                college: values[8],
                year: parseInt(values[9]),
            }) : null; 
            values[10] == "yes" ? participant_data.push({
                participant_id: parseInt(e.ID),
                military_service: true
            }) : null;
            values[11] !== "NA" || values[12] !=='NA' ? career_data.push(_sth.removeNullUndefined({
                participant_id: parseInt(e.ID),
                category:categoryLookup[values[11]] ? categoryLookup[values[11]].id : null,
                job_profession: values[12] == "NA" ? null : values[12],
                union_member: values[13] == "yes" ? true ? values[13] == "no" : false : null,
            })) : null;
            values[15] !== "NA" ? participant_data.push({
                participant_id: parseInt(e.ID),
                specific_dollar: parseInt(values[15]),
            }) : null;
            values[16] !== "NA" ? spouse_profession_data.push({
                participant_id: parseInt(e.ID),
                spouse_career: values[16],
            }) : null;

        })
        participants = _sth.handleAPI(education_level_data, participants, 'education_level', apiObj.education_level)

        participants = _sth.handleComponent(education_data, participants ,apiObj.education)
        participants = _sth.pushComonent(education_data, participants, "educations")

        participants = _sth.handleComponent(career_data,participants ,apiObj.career)
        participants = _sth.pushComonent(career_data, participants, "career")

        participants = _sth.handleComponent(spouse_profession_data,participants ,apiObj.spouse_career)
        participants = _sth.pushComonent(spouse_profession_data, participants, "spouse_career")
        
        participant_data.forEach((e) => {
            let keys = Object.keys(e);
            participants.data[Object.keys(participants.data)[0]][`${e.participant_id}`][keys[1]] = e[keys[1]]; 
        })

        var jsonContent = JSON.stringify(participants);
        fs.writeFile("participants.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("participants.json has been saved.");
        });

    } catch (error) {
        console.log(error);
    }
}

education_and_career()


