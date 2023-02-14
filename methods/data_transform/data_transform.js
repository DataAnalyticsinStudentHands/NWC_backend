const basic = require('./basic_data.js');
const edu = require('./education_and_career.js');
const elec = require('./electiral_politics.js');
const lead = require('./leadership_in_org.js');
const org = require('./organization_and_political.js');
const posi = require('./position_and_planks.js');
const race = require('./race_and_ethnicity.js')
const role = require('./role_at_nwc.js');
const fs = require("fs");

var participants = JSON.parse(fs.readFileSync("./participants.json", "utf-8"));

async function dataTransform(){
    new Promise((resolve) => {
        participants = basic.getBasicData(participants, "./data/Basic Data.csv");
        resolve(participants);
    })
    .then((participants) => {
        participants = edu.education_and_career(participants, "./data/Ed & Career.csv");
        return participants;
    })
    .then((participants) => {
        participants = elec.get_electoral_politices(participants, "./data/Electoral Politics.csv");
        return participants;
    })
    .then((participants) => {
        participants = lead.get_leadership_in_org(participants, "./data/Leadership in Org.csv");
        return participants;
    })
    .then((participants) => {
        participants = org.get_organization_and_political(participants, "./data/Organizational & Political.csv");
        return participants;
    })
    .then((participants) => {
        participants = posi.get_roles_and_planks(participants,"./data/Position on Planks.csv");
        return participants;
    })
    .then((participants) => {
        participants = race.get_race_and_ethnicity(participants,"./data/Race & Ethnicity--Expanded.csv");
        return participants;
    })
    .then((participants) => {
        participants = role.get_roles_and_planks(participants ,"./data/Role at NWC.csv");
        return participants;
    })
    .then((participants) => {
        var jsonContent = JSON.stringify(participants);
        fs.writeFile("participants.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("Process completed");
        });
    })
}

dataTransform();