const CSVToJSON = require("csvtojson");
const _sth = require("./utility.js");

async function get_leadership_in_org(participants, path) {
	try {
		const csvData = await CSVToJSON().fromFile(path);
        let leadership_in_org_data = [];
        csvData.forEach((e) => {
            let values = Object.values(e);
            leadership_in_org_data.push(_sth.removeNullUndefined({
                participant_id: parseInt(values[0]),
                general_name: values[2] == "NA" ? null : values[2],
                specific_name: values[3] == "NA" ? null : values[3],
                name_of_organization: values[4] == "NA" ? null : values[4],
            }))
		});
        // Components 
        participants = _sth.handleComponent(leadership_in_org_data, participants, Object.keys(participants.data)[11])
        participants = _sth.pushComonent(leadership_in_org_data, participants, "leaderships_in_organization")
        return participants;

	} catch (err) {
		console.log(err);
	}
}

module.exports = {
    get_leadership_in_org
}