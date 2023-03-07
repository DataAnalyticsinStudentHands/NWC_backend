const CSVToJSON = require("csvtojson");
const _sth = require("../utility/utility.js");
const fs = require("fs");

const roleLookup = {
    administrator: 1,
    'board member': 2,
    'Chair/President': 3,
    'Founder/Co-founder': 4,
    member: 5,
    Representative: 6,
    'Other Community Leadership': 7,
    'Other Officer': 8,
    'Vice-chair/Vice-president': 9
  }
async function leadership_in_org(participants, path, apiObj) {
	try {
		const csvData = await CSVToJSON().fromFile(path);
        let leadership_in_org_data = [];
        csvData.forEach((e) => {
            let values = Object.values(e);
            leadership_in_org_data.push(_sth.removeNullUndefined({
                participant_id: parseInt(values[0]),
                role: roleLookup[values[2]],
                specific_name: values[3] == "NA" ? null : values[3],
                organization: values[4] == "NA" ? null : values[4],
            }))
		});
        // Components 
        participants = _sth.handleComponent(leadership_in_org_data, participants, apiObj.leadership)
        participants = _sth.pushComonent(leadership_in_org_data, participants, "leaderships_in_organization")
		
        return participants;

	} catch (err) {
		console.log(err);
	}
}
module.exports = {
	leadership_in_org
}