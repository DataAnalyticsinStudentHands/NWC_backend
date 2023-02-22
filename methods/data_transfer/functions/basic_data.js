const CSVToJSON = require("csvtojson");
const _sth = require("../utility/utility.js");
const fs = require("fs");
// var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));
var apiObj = JSON.parse(fs.readFileSync("utility/api.json", "utf-8"));

async function getBasicData(participants, path) {
	try {
		let csvData = await CSVToJSON().fromFile(path);
		let participant_data = []; 
		//APIs
		let religion_data = [], residence_in_1977_data = [], state_data = [], 
		sexual_orientation_data = [], gender_data = [], marital_data = [];

		csvData.forEach((e) => {
			let values = Object.values(e);
			residence_in_1977_data.push(_sth.removeNullUndefined({
				participant_id: parseInt(e.ID),
				city_state: values[17],
				latitude: !Number.isNaN(parseFloat(values[18])) ? parseFloat(values[18]) : null,
				longitude: !Number.isNaN(parseFloat(values[19])) ? parseFloat(values[19]) : null,
				total_population: !Number.isNaN(parseInt(values[20])) ? parseInt(values[20]) : null,
				median_household_income: !Number.isNaN(parseInt(values[21])) ? parseInt(values[21]) : null,
				classification: values[22] !== "NA" ? values[22] : null,
			}));
			values[6] !== "NA" ? state_data.push({
				participant_id: parseInt(e.ID),
				state: values[6],
			}) : null;
			values[23] !== "NA" ? marital_data.push({
				participant_id: parseInt(e.ID),
				marital: values[23],
			}) : null;
			values[25] !== "NA" ? religion_data.push({
				participant_id: parseInt(e.ID),
				religion: values[25],
			}) : null;
			values[26] !== "NA" ? gender_data.push({
				participant_id: parseInt(e.ID),
				gender: values[26],
			}) : null;
			values[27] !== "NA" ? sexual_orientation_data.push({
				participant_id: parseInt(e.ID),
				sexual_orientation: values[27],
			}) : null;

			participant_data.push(_sth.removeNullUndefined({
				id : parseInt(e.ID),
				last_name: values[1],
				first_name: values[2],
				middle_name_initial: values[3] == "NA" ? null : values[3],
				middle_name_initial_2: values[4] == "NA" ? null : values[4],
				nickname: values[5] == "NA" ? null : values[5],
				birth_month: !Number.isNaN(parseInt(values[7])) ? parseInt(values[7]) : null,
				birth_day: !Number.isNaN(parseInt(values[8])) ? parseInt(values[8]) : null,
				birth_ca: values[9] == "ca." ? true : null,
				birth_year: !Number.isNaN(parseInt(values[10])) ? parseInt(values[10]) : null,
				age_in_1977: !Number.isNaN(parseInt(values[11])) ? parseInt(values[11]) : null,
				death_month: !Number.isNaN(parseInt(values[13])) ? parseInt(values[13]) : null,
				death_day: !Number.isNaN(parseInt(values[14])) ? parseInt(values[14]) : null,
				death_year: !Number.isNaN(parseInt(values[15])) ? parseInt(values[15]) : null,
				place_of_birth: values[16] == "NA" ? null : values[16],
				name_of_spouse: values[24] == "NA" ? null : values[24],
				total_number_of_children: !Number.isNaN(parseInt(values[28])) ? parseInt(values[28]) : null,
				educations:[],
				career:[],
				spouse_career:[],
				political_office_hold:[],
				political_office_lost:[],
				spouse_political_office:[],
				leaderships_in_organization:[],
			}))
		});
		// API Participant Data
		participants.data[`${apiObj.participant}`] = _sth.toObject(participant_data,'id')
		// API State Data
		participants = _sth.handleAPI(state_data, participants, 'state',apiObj.state)
		// API Marital Data
		participants = _sth.handleAPI(marital_data, participants, 'marital',apiObj.marital)
		// API Gender Data
		participants = _sth.handleAPI(gender_data, participants, 'gender',apiObj.gender)
		// API Sexual Orientation Data
		participants = _sth.handleAPI(sexual_orientation_data, participants, 'sexual_orientation',apiObj.sexual_orientation)
		// API Residence In 1977 Data
		participants = _sth.handleAPI(residence_in_1977_data, participants, 'city_state', apiObj.resident_in_1977)
		// API Religion Data
		participants =_sth.handleAPI(religion_data, participants, 'religion',apiObj.religion)
		// Save participants as JSON file
		// var jsonContent = JSON.stringify(participants);
        // fs.writeFile("participants.json", jsonContent, 'utf8', function (err) {
        //     if (err) {
        //         console.log("An error occured while writing JSON Object to File.");
        //         return console.log(err);
        //     }
        //     console.log("Basic Data file is added into participants.json");
        // });
		return participants;

	} catch (err) {
		console.log(err);
	}
}

// getBasicData()
module.exports = {
	getBasicData
}