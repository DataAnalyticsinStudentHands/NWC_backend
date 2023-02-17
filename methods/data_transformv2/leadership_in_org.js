const CSVToJSON = require("csvtojson");
const _sth = require("./utility.js");
const fs = require("fs");
var apiObj = JSON.parse(fs.readFileSync("./data/api.json", "utf-8"));

var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));
let org_role_lookup = {
    Administrator: 1,
    'Board Member': 2,
    'Chair/President': 3,
    'Founder/Co-founder': 4,
    Member: 5,
    Representative: 6,
    'Other Community Leadership': 7,
    'Other Officer': 8,
    'Vice-chair/Vice-president': 9
  }
async function get_leadership_in_org() {
	try {
		const csvData = await CSVToJSON().fromFile(
			"./data/Leadership in Org.csv"
		);
        let leadership_in_org_data = [];
        csvData.forEach((e) => {
            let values = Object.values(e);
            leadership_in_org_data.push(_sth.removeNullUndefined({
                participant_id: parseInt(values[0]),
                role: org_role_lookup[values[2]],
                specific_name: values[3] == "NA" ? null : values[3],
                organization: values[4] == "NA" ? null : values[4],
            }))
		});
        // Components 
        participants = _sth.handleComponent(leadership_in_org_data, participants, apiObj.leadership)
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