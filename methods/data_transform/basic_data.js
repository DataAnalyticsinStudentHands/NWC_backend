const CSVToJSON = require("csvtojson");
const _sth = require('./utility.js');
const { startsWith } = require("lodash");

const fs = require("fs");
var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));

async function getBasicData() {
	try {
		let csvData = await CSVToJSON().fromFile("./data/Basic Data.csv");
		let participant_data = [], religion_data = [], residence_in_1977_data = [], state_data = [];

		for (let i = 0; i < csvData.length; i++) {
			let obj = csvData[i], keys = Object.keys(obj);
			let new_participant_obj = {}, new_religion_obj = {}, new_residence_obj = {}, new_state_obj = {};
			for (let j = 0; j < keys.length; j++) {
				let key = keys[j], newkey = key.replace(/\([^()]*\)/g, "").replace(/\s+/g, "_").toLowerCase();
				switch (true) {
					case startsWith(newkey, "notes") || obj[key] == "NA":
					  //remove notes, NAs
					  break;
					case startsWith(newkey, "age_in") || startsWith(newkey, "birth") || startsWith(newkey, "death") || startsWith(newkey, "zip") || startsWith(newkey, "specific") || startsWith(newkey, "id"):
					  var numberValue = parseInt(obj[key]);
					  !Number.isNaN(numberValue) ? new_participant_obj[newkey] = numberValue : null;
					  break;
					case startsWith(newkey, "religion"):
					  new_religion_obj[newkey]= obj[key]
					  new_religion_obj['participant_id']= parseInt(obj['ID'])
					  break;
					case startsWith(newkey, "state"):
					  new_state_obj[newkey] = obj[key];
					  new_state_obj['participant_id']= parseInt(obj['ID'])
					  break;
					case startsWith(newkey, "residence_"):
					  new_residence_obj["participant_id"] = parseInt(obj['ID']);
					  new_residence_obj["city_state"] = obj[key];
					  new_residence_obj['latitude'] = !Number.isNaN(obj['Latitude of Residence in 1977']) ? null : parseInt(obj['Latitude of Residence in 1977']);
					  new_residence_obj['longitude'] = !Number.isNaN(obj['Longitude of Residence in 1977']) ? null : parseInt(obj['Longitude of Residence in 1977']);
					  new_residence_obj["total_population"] = parseInt(obj['Total Population of Place of Residence (check US Census)']);
					  new_residence_obj["median_household_income"] = parseInt(obj['Median Household Income of Place of Residence (check US Census)']);
					  new_residence_obj["classification"] = obj[key];
					  break;
					case startsWith(newkey, "middle_name"):
					  new_participant_obj["middle_name_initial"] = obj[key];
					  break;	
					case startsWith(newkey, "total_number"):
						new_participant_obj["total_number_of_children"] = !Number.isNaN(parseInt(obj[key])) ? parseInt(obj[key]) : null;
						break;
					default:
						new_participant_obj[`${newkey}`] = obj[key];
				  }
			}
			new_participant_obj['education'] = [], new_participant_obj['career'] = [], new_participant_obj['spouse_profession'] = [], 
			new_participant_obj['political_office_hold'] = [], new_participant_obj['political_offices_lost'] = [], new_participant_obj['other_role'] = []
			new_participant_obj['leaderships_in_organization'] = [], new_participant_obj['spouse_political_office'] = []
			delete new_participant_obj['total_population_of_place_of_residence_']; delete new_participant_obj['median_household_income_of_place_of_residence_']
			participant_data.push(new_participant_obj);

			new_religion_obj.religion ? religion_data.push(new_religion_obj) : null;
			new_state_obj.state ? state_data.push(new_state_obj) : null;
			new_residence_obj.city_state ? residence_in_1977_data.push(_sth.removeNullUndefined(new_residence_obj)) : null;
		}
		// API Religion Data
		participants =_sth.handleAPI(religion_data, participants, 'religion',Object.keys(participants.data)[9])

		// API State Data
		participants = _sth.handleAPI(state_data, participants, 'state',Object.keys(participants.data)[1])

		// API Residence In 1977 Data
		participants = _sth.handleAPI(residence_in_1977_data, participants, 'city_state', Object.keys(participants.data)[2])

		// API Participant Data
		participants.data[Object.keys(participants.data)[0]] = _sth.toObject(participant_data,'id')

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

getBasicData()
