const CSVToJSON = require("csvtojson");
const { startsWith } = require("lodash");
const _sth = require("./utility.js");
const fs = require("fs");
var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));

async function education_and_career() {
    try{
        const csvData = await CSVToJSON().fromFile("./data/Ed & Career.csv");
        let education_data = []; let career_data = []; let spouse_profession_data = [];
        let participant_data = [];

        csvData.forEach((e) => {
            let values = Object.values(e);
            values[2] !== "NA" ? participant_data.push({
                participant_id: parseInt(e.ID),
                heighest_level_of_education: values[2],
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
                category_of_employment: values[11] == "NA" ? null : values[11],
                job_profession: values[12] == "NA" ? null : values[12],
            })) : null;
            values[13] == "yes" ? participant_data.push({
                participant_id: parseInt(e.ID),
                union_member: true,
            }) : null;
            values[14] !== "NA" ? participant_data.push({
                participant_id: parseInt(e.ID),
                income_level: values[14],
            }) : null;
            values[15] !== "NA" ? participant_data.push({
                participant_id: parseInt(e.ID),
                specific_dollar: values[15],
            }) : null;
            values[16] !== "NA" ? spouse_profession_data.push({
                participant_id: parseInt(e.ID),
                spouse_profession: values[16],
            }) : null;

        })
        participants = _sth.handleComponent(education_data, participants ,Object.keys(participants.data)[17])
        participants = _sth.pushComonent(education_data, participants, "education")

        participants = _sth.handleComponent(career_data,participants ,Object.keys(participants.data)[16])
        participants = _sth.pushComonent(career_data, participants, "career")

        participants = _sth.handleComponent(spouse_profession_data,participants ,Object.keys(participants.data)[15])
        participants = _sth.pushComonent(spouse_profession_data, participants, "spouse_profession")
        
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