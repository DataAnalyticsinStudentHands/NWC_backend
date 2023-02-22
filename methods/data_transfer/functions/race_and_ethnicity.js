const CSVToJSON = require("csvtojson");
const _sth = require("../utility/utility.js");

async function race_and_ethnicity(participants, path, apiObj) {
	try {
		const csvData = await CSVToJSON().fromFile(path);
		let race_data = [];
		csvData.forEach((e) => {
			let keys = Object.keys(e)
			keys.forEach((key) => {
				e[key] == 'yes' ? race_data.push({participant_id: parseInt(e.ID),race:key}) : null;
			})
		})
		participants = _sth.handleAPI(race_data, participants, 'race', apiObj.race)
		
		return participants;
		
	} catch (err) {
		console.log(err);
	}
}
module.exports = {
	race_and_ethnicity
}
