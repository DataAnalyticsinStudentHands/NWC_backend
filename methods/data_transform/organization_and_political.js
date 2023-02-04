const CSVToJSON = require("csvtojson");
const { startsWith } = require("lodash");
const _sth = require("./utility.js");
const fs = require("fs");
var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));

async function get_organization_and_political() {
	try {
		const csvData = await CSVToJSON().fromFile("./data/Organizational & Political.csv");
		let data = [];
		csvData.forEach((e) => {
			let keys = Object.keys(e);
			keys.forEach((key) => {
				e[key] == "yes" ? data.push({participant_id: parseInt(e.ID),organizational_and_political: key,}) : null
			});
		});
		participants = _sth.handleAPI(data, participants, "organizational_and_political", Object.keys(participants.data)[5]);

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
get_organization_and_political();
