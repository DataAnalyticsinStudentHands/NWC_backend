const CSVToJSON = require("csvtojson");
const _sth = require('./utility.js');

async function get_race_and_ethnicity(participants, path) {
	try {
		const csvData = await CSVToJSON().fromFile(path);
		let race_data = [];
		csvData.forEach((e) => {
			let keys = Object.keys(e)
			keys.forEach((key) => {
				e[key] == 'yes' ? race_data.push({participant_id: parseInt(e.ID),race:key}) : null;
			})
		})
		participants = _sth.handleAPI(race_data, participants, 'race', Object.keys(participants.data)[8])
		
		return participants;

	} catch (err) {
		console.log(err);
	}
}
module.exports = {
	get_race_and_ethnicity
}