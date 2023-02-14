const CSVToJSON = require("csvtojson");
const _sth = require("./utility.js");

async function get_organization_and_political(participants, path) {
	try {
		const csvData = await CSVToJSON().fromFile(path);
		let data = [];
		csvData.forEach((e) => {
			let keys = Object.keys(e);
			keys.forEach((key) => {
				e[key] == "yes" ? data.push({participant_id: parseInt(e.ID),organizational_and_political: key,}) : null
			});
		});
		participants = _sth.handleAPI(data, participants, "organizational_and_political", Object.keys(participants.data)[5]);

		return participants;
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
    get_organization_and_political
}
