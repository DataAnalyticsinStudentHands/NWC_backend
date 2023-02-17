const CSVToJSON = require("csvtojson");
const _sth = require('./utility.js');
const fs = require("fs");
var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));
var apiObj = JSON.parse(fs.readFileSync("./data/api.json", "utf-8"));

async function get_race_and_ethnicity() {
	try {
		const csvData = await CSVToJSON().fromFile("./data/Race & Ethnicity--Expanded.csv");
		let race_data = [];
		csvData.forEach((e) => {
			let keys = Object.keys(e)
			keys.forEach((key) => {
				e[key] == 'yes' ? race_data.push({participant_id: parseInt(e.ID),race:key}) : null;
			})
		})
		participants = _sth.handleAPI(race_data, participants, 'race', apiObj.race)
		
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
get_race_and_ethnicity()