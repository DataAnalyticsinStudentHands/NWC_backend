const CSVToJSON = require("csvtojson");
const { startsWith, merge } = require("lodash");
const _sth = require("./utility.js");
const fs = require("fs");

var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));

async function get_leadership_in_org() {
	try {
		const csvData = await CSVToJSON().fromFile(
			"./data/Leadership in Org.csv"
		);
        let leadership_in_org_data = [];
		csvData.forEach((e) => {
			let keys = Object.keys(e);
			keys.forEach((key) => {
                startsWith(key, "Leadership") && e[key]!= "NA" ? leadership_in_org_data.push({leadership_position: e[key],participant_id: parseInt(e.ID)}) : null;
			});
		});
        // Components 
        participants = _sth.handleComponent(leadership_in_org_data, participants, Object.keys(participants.data)[11])
        participants = _sth.pushComonent(leadership_in_org_data, participants, "leaderships_in_organization")
		
        var jsonContent = JSON.stringify(participants);
        fs.writeFile("participants.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("participants.json has been saved.");
        });

	} catch (err) {
		console.log(err);
	}
}
get_leadership_in_org();