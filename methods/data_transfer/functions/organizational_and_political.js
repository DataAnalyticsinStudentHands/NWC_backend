const CSVToJSON = require("csvtojson");
const _sth = require("../utility/utility.js");

async function organizational_and_political(participants, path, apiObj) {
	try {
		const csvData = await CSVToJSON().fromFile(path);
		let data = [];
		csvData.forEach((e) => {
			let keys = Object.keys(e);
			keys.forEach((key) => {
				e[key] == "yes" ? data.push({participant_id: parseInt(e.ID),organizational_and_political: key,}) : null
			});
		});
		participants = _sth.handleAPI(data, participants, "organizational_and_political", apiObj.organizational_and_political);
		
		return participants;

	} catch (err) {
		console.log(err);
	}
}
module.exports = {
	organizational_and_political
}
