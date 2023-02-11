const CSVToJSON = require("csvtojson");
const _sth = require('./utility.js');
const fs = require("fs");
var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));

async function get_roles_and_planks() {
	try {
		const csvData = await CSVToJSON().fromFile("./data/Role at NWC.csv");
		let roles_data = [];let other_role_data = [];

		csvData.forEach((e) => {
			let keys = Object.keys(e)
			keys.forEach((key) => {
                e[key] == 'yes' ? roles_data.push({
                    participant_id: parseInt(e.ID),
                    role: key,
                }) : null;
                key == 'Other Role' && e[key] != 'NA' ? other_role_data.push({
                    participant_id: parseInt(e.ID),
                    other_role: e[key],
                }): null;
            })
        })
        //API Role
        participants = _sth.handleAPI(roles_data,participants, 'role',Object.keys(participants.data)[4]);

        // Component Other Role
        participants = _sth.handleComponent(other_role_data, participants, Object.keys(participants.data)[10])
        participants = _sth.pushComonent(other_role_data, participants, "other_role")

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

get_roles_and_planks()