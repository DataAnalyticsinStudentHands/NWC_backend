const CSVToJSON = require("csvtojson");
const _sth = require('./utility.js');

async function getBasicData(participants, path) {
	try {
		let csvData = await CSVToJSON().fromFile(path);
		let participant_data = [], religion_data = []; let residence_in_1977_data = [], state_data = [];
		csvData.forEach((e) => {
			let values = Object.values(e);

			values[6] !== "NA" ? state_data.push({
				participant_id: parseInt(e.ID),
				state: values[6],
			}) : null;

			residence_in_1977_data.push(_sth.removeNullUndefined({
				participant_id: parseInt(e.ID),
				city_state: values[17],
				latitude: !Number.isNaN(parseFloat(values[18])) ? parseFloat(values[18]) : null,
				longitude: !Number.isNaN(parseFloat(values[19])) ? parseFloat(values[19]) : null,
				total_population: !Number.isNaN(parseInt(values[20])) ? parseInt(values[20]) : null,
				median_household_income: !Number.isNaN(parseInt(values[21])) ? parseInt(values[21]) : null,
				classification: values[22] !== "NA" ? values[22] : null,
			}));

			values[25] !== "NA" ? religion_data.push({
				participant_id: parseInt(e.ID),
				religion: values[25],
			}) : null;

			participant_data.push(_sth.removeNullUndefined({
				id : parseInt(e.ID),
				last_name: values[1],
				first_name: values[2],
				middle_name_initial: values[3] == "NA" ? null : values[3],
				middle_name_initial_2: values[4] == "NA" ? null : values[4],
				nick_name: values[5] == "NA" ? null : values[5],
				birth_month: !Number.isNaN(parseInt(values[7])) ? parseInt(values[7]) : null,
				birth_day: !Number.isNaN(parseInt(values[8])) ? parseInt(values[8]) : null,
				birth_co: values[9] == "ca." ? true : null,
				birth_year: !Number.isNaN(parseInt(values[10])) ? parseInt(values[10]) : null,
				age_in_1977: !Number.isNaN(parseInt(values[11])) ? parseInt(values[11]) : null,
				age_range_in_1977: values[12] == "NA" ? null : values[12],
				death_month: !Number.isNaN(parseInt(values[13])) ? parseInt(values[13]) : null,
				death_day: !Number.isNaN(parseInt(values[14])) ? parseInt(values[14]) : null,
				death_year: !Number.isNaN(parseInt(values[15])) ? parseInt(values[15]) : null,
				place_of_birth: values[16] == "NA" ? null : values[16],
				marital_classification: values[23] == "NA" ? null : values[23],
				name_of_spouse: values[24] == "NA" ? null : values[24],
				gender: values[26] == "NA" ? null : values[26],
				sexual_orientation: values[27] == "NA" ? null : values[27],
				total_number_of_children: !Number.isNaN(parseInt(values[28])) ? parseInt(values[28]) : null,
				education:[], career: [], spouse_profession: [], political_office_hold:[],political_offices_lost:[],
				other_role:[], leaderships_in_organization:[], spouse_political_office:[]
			}))

		});
		// API Participant Data
		participants.data[Object.keys(participants.data)[0]] = _sth.toObject(participant_data,'id')
		// // API State Data
		participants = _sth.handleAPI(state_data, participants, 'state',Object.keys(participants.data)[1])
		// // API Residence In 1977 Data
		participants = _sth.handleAPI(residence_in_1977_data, participants, 'city_state', Object.keys(participants.data)[2])
		// // API Religion Data
		participants =_sth.handleAPI(religion_data, participants, 'religion',Object.keys(participants.data)[9])
		// // Save participants as JSON file
		return participants;

	} catch (err) {
		console.log(err);
	}
}
// getBasicData()
module.exports = {
	getBasicData
}