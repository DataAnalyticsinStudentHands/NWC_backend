const CSVToJSON = require("csvtojson");
const fs = require("fs");
const { endsWith, startsWith } = require("lodash");

const toObject = (arr, key) =>
	arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {});
function getUniqueListBy(arr, key) {
	return [...new Map(arr.map((item) => [item[key], item])).values()];
}
// Confirm the attributes exist
var participants = {
	"version": 2,
	"data": {
		"api::nwc-participant.nwc-participant": {},
		"api::state.state": {},
		"api::resident-in-1977.resident-in-1977": {},
		"api::nwc-plank.nwc-plank": {},
		"api::nwc-role.nwc-role": {},
		"api::organizational-and-political.organizational-and-political": {},
		"api::commission-of-women.commission-of-women": {},
		"api::political-party.political-party": {},
		"api::race.race": {},
		"api::religion.religion": {},
		"participant-component.leadership": {},
		"participant-component.spouse-political-office": {},
		"participant-component.political-office-lost": {},
		"participant-component.political-office-hold": {},
		"participant-component.supose-career": {},
		"participant-component.career": {},
		"participant-component.eudcation": {}
	}
}

function get_education_and_career_data() {
	CSVToJSON()
		.fromFile("./data/Ed & Career.csv")
		.then((csvData) => {
			let education_data = [];
			let career_data = [];
			let participant_data = [];
			let spouse_profession_data = [];

			for (let i = 0; i < csvData.length; i++) {
				let obj = csvData[i];
				obj["participant_id"] = parseInt(obj["ID"]);
				delete obj["ID"];
				let key, keys = Object.keys(obj);
				let new_education_obj = {};
				let new_career_obj = {};
				let new_participant_obj = {};
				let new_spouse_profession_obj = {};

				for (let j = 0; j < keys.length; j++) {
					key = keys[j];
					if (obj[key] == "NA") {
						//remove NAs
					} else if (startsWith(key, "College: Undergrad degree")) {
						new_education_obj["degree"] = obj[key];
					} else if (startsWith(key, "College: Undergrad institution")) {
						new_education_obj["college"] = obj[key];
					} else if (startsWith(key,"College: Undergrad year of graduation")) {
						new_education_obj["year"] = parseInt(obj[key]);
					} else if (startsWith(key,"College: Graduate/ Professional degree")) {
						new_education_obj["degree"] = obj[key];
					} else if (startsWith("College: Graduate/ Professional institution")) {
						new_education_obj["college"] = obj[key];
					} else if (startsWith(key,"College: Graduate/ Professional year of graduation")
					) {new_education_obj["year"] = parseInt(obj[key]);
					} else if (startsWith(key, "Category of Employment")) {
						new_career_obj["category_of_employment"] = obj[key];
					} else if (startsWith(key, "Job/ Profession") && obj[key]) {
						new_career_obj["job_profession"] = obj[key];
					} else if (startsWith(key, "Military Service")) {
						obj[key].toLowerCase() == "yes"
							? (new_participant_obj["military_service"] = true)
							: null;
						obj[key].toLowerCase() == "no"
							? (new_participant_obj["military_service"] = false)
							: null;
					} else if (startsWith(key, "Union Member")) {
						obj[key].toLowerCase() == "yes"
							? (new_participant_obj["union_member"] = true)
							: null;
						obj[key].toLowerCase() == "no"
							? (new_participant_obj["union_member"] = false)
							: null;
					} else if (startsWith(key, "Income Level")) {
						new_participant_obj["income_level"] = obj[key];
					} else if (startsWith(key, "Optional: Fill out")) {
						new_participant_obj["specific_dollar"] = parseInt(obj[key]);
					} else if (startsWith(key, "Spouse's Profession")) {
						new_spouse_profession_obj['spouse_profession'] = obj[key];
					}

					Object.keys(new_education_obj).length > 0
						? (new_education_obj["participant_id"] = obj["participant_id"])
						: null;
					Object.keys(new_career_obj).length > 0
						? (new_career_obj["participant_id"] = obj["participant_id"])
						: null;
					Object.keys(new_participant_obj).length > 0
						? (new_participant_obj["participant_id"] = obj["participant_id"])
						: null;
					Object.keys(new_spouse_profession_obj).length > 0
						? (new_spouse_profession_obj["participant_id"] = obj["participant_id"])
						: null;
				}
				new_education_obj["participant_id"] && education_data.push(new_education_obj);
				new_career_obj["participant_id"] && career_data.push(new_career_obj);
				new_participant_obj["participant_id"] && participant_data.push(new_participant_obj);
				new_spouse_profession_obj["participant_id"] && spouse_profession_data.push(new_spouse_profession_obj);

			}
			education_data.forEach((obj, index) => {obj["id"] = index + 1;});
			participants.data["participant-component.eudcation"] = toObject(education_data, "id");
			education_data.forEach((e) => {participants.data["api::nwc-participant.nwc-participant"][`${e.participant_id}`].education.push(e.id);});

			career_data.forEach((obj, index) => {obj["id"] = index + 1;});
			participants.data["participant-component.career"] = toObject(career_data, "id");
			career_data.forEach((e) => {participants.data["api::nwc-participant.nwc-participant"][`${e.participant_id}`]['career'].push(e.id);});

			spouse_profession_data.forEach((obj, index) => {obj["id"] = index + 1;});
			participants.data["participant-component.supose-career"] = toObject(spouse_profession_data, "id");
			spouse_profession_data.forEach((e) => {participants.data["api::nwc-participant.nwc-participant"][`${e.participant_id}`]['spouse_profession'].push(e.id);});

			participant_data.forEach((obj) => {
				let keys = Object.keys(obj);
				keys.includes('income_level') ? participants.data["api::nwc-participant.nwc-participant"][`${obj.participant_id}`]['income_level'] = obj.income_level : null;
				keys.includes('military_service') ? participants.data["api::nwc-participant.nwc-participant"][`${obj.participant_id}`]['military_service'] = obj.military_service : null;
				keys.includes('union_member') ? participants.data["api::nwc-participant.nwc-participant"][`${obj.participant_id}`]['union_member'] = obj.union_member : null;
				keys.includes('specific_dollar') ? participants.data["api::nwc-participant.nwc-participant"][`${obj.participant_id}`]['specific_dollar'] = obj.specific_dollar : null;
			})
		})
		// .then(() => {
		// 	var jsonContent = JSON.stringify(participants);
		// 	fs.writeFile("participants.json", jsonContent, 'utf8', function (err) {
		// 		if (err) {
		// 			console.log("An error occured while writing JSON Object to File.");
		// 			return console.log(err);
		// 		}
		// 		console.log("JSON file has been saved.");
		// 	});
		// })
		.catch((err) => {
			console.log(err);
		});
}
function get_electoral_politices() {
	CSVToJSON()
		.fromFile("./data/Electoral Politics.csv")
		.then((csvData) => {
			let political_offices_held_data = [];
			let political_offices_lost_data = [];
			let party_data = [];
			let commission_data = [];
			let participant_data = [];
			for (let i = 0; i < csvData.length; i++) {
				var obj = csvData[i];
				obj["participant_id"] = parseInt(obj["ID"]);
				let key, keys = Object.keys(obj);
				let new_hold_obj = {};
				let new_lost_obj = {};
				let new_party_obj = {};
				let new_commission_obj = {};
				let new_participant_obj = {};

				for (let j = 0; j < keys.length; j++) {
					key = keys[j];
					if (obj[key] == "NA" || obj[key] == "none" || startsWith(key, "notes")) {} 
					else if (
						startsWith(key, "President's Commission") ||
						startsWith(key, "state level ") ||
						startsWith(key, "county level ") ||
						startsWith(key, "city level ")
					){
						new_commission_obj['level_of_commission'] = key
					}
					else if (startsWith(key,"Jurisdiction of Political Offices Held") ) {
						new_hold_obj["level"] = obj[key];
					} else if (startsWith(key, "Name of Political Offices Held")) {
						new_hold_obj["jurisdiction_of_political_offices_held"] = obj[key];
					} else if (
						startsWith(key, "Start Year for Political Office")
					) {
						new_hold_obj["start_year"] = parseInt(obj[key]);
					} else if (
						startsWith(key, "End Year for Political Office") 
					) {
						new_hold_obj["end_year"] = parseInt(obj[key]);
					} else if (startsWith(key,"Jurisdiction of Political Offices Sought but Lost") ) {
						new_lost_obj["level"] = obj[key];
					} else if (
						startsWith(
							key,
							"Name of Political Offices Sought but Lost"
						) 
					) {
						new_lost_obj["political_offices_name"] = obj[key];
					} else if (
						startsWith(key, "Year of Race that was Lost")
					) {
						new_lost_obj["year"] = parseInt(obj[key]);
					} else if (startsWith(key, "Political Party Membership")) {
						new_party_obj["political_party"] = obj[key];
					} else if (startsWith(key, "Spouse/partne")) {
						new_participant_obj['spouse_political_office'] = obj[key];
					} else if (startsWith(key, "Identified Self as a Feminist")) {
						obj[key] == "yes"? new_participant_obj['feminist'] = true : null;
						obj[key] == "no"? new_participant_obj['feminist'] = true : null;
					}

					Object.keys(new_hold_obj).length > 0
						? (new_hold_obj["participant_id"] = obj["participant_id"])
						: null;
					Object.keys(new_lost_obj).length > 0
						? (new_lost_obj["participant_id"] = obj["participant_id"])
						: null;
					Object.keys(new_participant_obj).length > 0
						? (new_participant_obj["participant_id"] = obj["participant_id"])
						: null;
					Object.keys(new_party_obj).length > 0
						? (new_party_obj["nwc_participants"] = [])
						: null;
					Object.keys(new_commission_obj).length > 0
						? (new_commission_obj["nwc_participants"] = [])
						: null;
				}
				new_party_obj['nwc_participants'] && party_data.push(new_party_obj);
				new_commission_obj['nwc_participants'] && commission_data.push(new_commission_obj);

				new_hold_obj["participant_id"] &&political_offices_held_data.push(new_hold_obj);
				new_lost_obj["participant_id"] &&political_offices_lost_data.push(new_lost_obj);
				new_participant_obj["participant_id"] && participant_data.push(new_participant_obj);

			}

			// Api::political-party.political-party
			party_data = getUniqueListBy(party_data, "political_party");
			csvData.forEach((obj) => {party_data.forEach((e) => {e.political_party == obj["Political Party Membership"]? e.nwc_participants.push(parseInt(obj["ID"])): null;});})
			party_data.forEach((obj, index) => {obj["id"] = index + 1;});
			participants.data["api::political-party.political-party"] = toObject(party_data,"id");

			//Api::commission-of-women.commission-of-women
			commission_data = getUniqueListBy(commission_data, "level_of_commission");
			csvData.forEach((obj) => {
				let keys = Object.keys(obj);
				obj["participant_id"] = parseInt(obj["ID"]);
				keys.forEach((key) => {
					obj[key] == 'yes' ? (commission_data.forEach((e) => {e.level_of_commission == key ? e.nwc_participants.push(obj["participant_id"]): null;})):null;
				})
			})
			commission_data.forEach((obj, index) => {obj["id"] = index + 1;});
			participants.data["api::commission-of-women.commission-of-women"] = toObject(commission_data,"id");

			//Component political-offces-held-component
			political_offices_held_data.forEach((obj, index) => {obj["id"] = index + 1;});
			participants.data["participant-component.political-office-hold"] = toObject(political_offices_held_data, "id");
			political_offices_held_data.forEach((e) => {participants.data["api::nwc-participant.nwc-participant"][`${e.participant_id}`]['political_office_hold'].push(e.id);});

			//Component electoral-politic.political-offices-lost-component
			political_offices_lost_data.forEach((obj, index) => {obj["id"] = index + 1;});
			participants.data["participant-component.political-office-lost"] = toObject(political_offices_lost_data, "id");
			political_offices_lost_data.forEach((e) => {participants.data["api::nwc-participant.nwc-participant"][`${e.participant_id}`]['political_offices_lost'].push(e.id);});

			participant_data.forEach((obj, index) => {obj["id"] = index + 1;});
			participants.data["participant-component.spouse-political-office"] = toObject(participant_data, "id");
			participant_data.forEach((obj) => {
				let keys = Object.keys(obj);
				keys.includes('feminist') ? (
					participants.data["api::nwc-participant.nwc-participant"][`${obj.participant_id}`]['feminist'] = obj.feminist) : null;
				keys.includes('spouse_political_office') ? (
					participants.data["api::nwc-participant.nwc-participant"][`${obj.participant_id}`]['spouse_political_office'].push(obj.id)) : null;
			})
		})
		// .then(() => {
		// 	var jsonContent = JSON.stringify(participants);
		// 	fs.writeFile("participants.json", jsonContent, 'utf8', function (err) {
		// 		if (err) {
		// 			console.log("An error occured while writing JSON Object to File.");
		// 			return console.log(err);
		// 		}
		// 		console.log("JSON file has been saved.");
		// 	});
		// })
		.catch((err) => {
			console.log(err);
		});
}
function get_leadership_in_org() {
	CSVToJSON()
		.fromFile("./data/Leadership in Org.csv")
		.then((csvData) => {
			let leadership_in_org_data = [];
			for (let i = 0; i < csvData.length; i++) {
				var obj = csvData[i];
				obj["participant_id"] = parseInt(obj["ID"]);
				var key, keys = Object.keys(obj);
				var new_obj = {};
				for (let j = 0; j < keys.length; j++) {
					key = keys[j];
					if (obj[key] == "NA") {
					} else if (
						startsWith(key,"Leadership positions in voluntary organizations")
					) {
						new_obj["leadership_position"] = obj[key];
					}
					Object.keys(new_obj).length > 0
						? (new_obj["participant_id"] = obj["participant_id"])
						: null;
				}
				new_obj["participant_id"] && leadership_in_org_data.push(new_obj);
			}
			leadership_in_org_data.forEach((obj, index) => {obj["id"] = index + 1;});
			participants.data["participant-component.leadership"] = toObject(leadership_in_org_data, "id");
			leadership_in_org_data.forEach((e) => {participants.data["api::nwc-participant.nwc-participant"][`${e.participant_id}`]['leaderships_in_organization'].push(e.id);});
		})
		// .then(() => {
		// 	var jsonContent = JSON.stringify(participants);
		// 	fs.writeFile("participants.json", jsonContent, 'utf8', function (err) {
		// 		if (err) {
		// 			console.log("An error occured while writing JSON Object to File.");
		// 			return console.log(err);
		// 		}
		// 		console.log("JSON file has been saved.");
		// 	});
		// })
		.catch((err) => {
			console.log(err);
		});
}
function get_organization_and_political() {
	CSVToJSON()
		.fromFile("./data/Organizational & Political.csv")
		.then((csvData) => {
			var organization_and_political_data = [];
			var key,
				keys = Object.keys(csvData[0]);
			for (let i = 0; i < Object.keys(csvData[0]).length; i++) {
				let new_obj = {};
				key = keys[i];
				if (
					startsWith(key, "ID") ||
					startsWith(key, "Name") ||
					startsWith(key, "...") ||
					startsWith(key, "Note")
				) {
				} else {
					new_obj["organizational_and_political"] = key;
				}
				Object.keys(new_obj).length > 0
					? (new_obj["nwc_participants"] = [])
					: null;
				new_obj["nwc_participants"] &&
					organization_and_political_data.push(new_obj);
			}
			csvData.forEach((obj) => {
				let keys = Object.keys(obj);
				keys.forEach((key) => {
					obj[key] == 'yes' ? (organization_and_political_data.forEach((e) => {e.organizational_and_political == key ? e.nwc_participants.push(parseInt(obj["ID"])): null;})):null;
				})
			})
			organization_and_political_data.forEach((obj, index) => {obj["id"] = index + 1;});
			participants.data["api::organizational-and-political.organizational-and-political"] = toObject(organization_and_political_data, "id");
		})
		.then(() => {
			var jsonContent = JSON.stringify(participants);
			fs.writeFile("participants.json", jsonContent, 'utf8', function (err) {
				if (err) {
					console.log("An error occured while writing JSON Object to File.");
					return console.log(err);
				}
				console.log("JSON file has been saved.");
			});
		})
		.catch((err) => {
			console.log(err);
		});
}
function get_race_and_ethnicity() {
	CSVToJSON()
		.fromFile("./data/Race & Ethnicity--Expanded.csv")
		.then((csvData) => {
			let race_and_ethnicity_data = [];
			var key,keys = Object.keys(csvData[0]);
			for (let i = 0; i < Object.keys(csvData[0]).length; i++) {
				let new_obj = {};
				key = keys[i];
				if (
					startsWith(key, "ID") ||
					startsWith(key, "Name") ||
					startsWith(key, "Note")
				) {
				} else {
					new_obj["race"] = key;
				}
				Object.keys(new_obj).length > 0 ? (new_obj["nwc_participants"] = []): null;
				new_obj["nwc_participants"] &&race_and_ethnicity_data.push(new_obj);
			}

			csvData.forEach((obj) => {
				let keys = Object.keys(obj);
				keys.forEach((key) => {
					obj[key] == 'yes' ? (race_and_ethnicity_data.forEach((e) => {e.race == key ? e.nwc_participants.push(parseInt(obj["ID"])): null;})):null;
				})
			})
			race_and_ethnicity_data.forEach((obj, index) => {obj["id"] = index + 1;});
			participants.data["api::race.race"] =toObject(race_and_ethnicity_data, "id");
		})
		// .then(() => {
		// 	var jsonContent = JSON.stringify(participants);
		// 	fs.writeFile("participants.json", jsonContent, 'utf8', function (err) {
		// 		if (err) {
		// 			console.log("An error occured while writing JSON Object to File.");
		// 			return console.log(err);
		// 		}
		// 		console.log("JSON file has been saved.");
		// 	});
		// })
		.catch((err) => {
			console.log(err);
		});
}
function get_roles_and_planks() {
	CSVToJSON()
		.fromFile("./data/Role at NWC.csv")
		.then((csvData) => {
			let roles_data = [];
			let planks_data = [];
			let participant_data = [];

			var key, keys = Object.keys(csvData[0]);
			for (let i = 0; i < Object.keys(csvData[0]).length; i++) {
				let new_obj = {};
				key = keys[i];
				if (
					startsWith(key, "ID") ||
					startsWith(key, "Name") ||
					startsWith(key, "Note") ||
					startsWith(key, "Other")
				) {
				} else {
					if (
						endsWith(key, "Plank") ||
						startsWith(key, "Stance on the ERA")
					) {
						new_obj["plank"] = key;
						new_obj["nwc_participants_for"] = [];
						new_obj["nwc_participants_against"] = [];
						new_obj["nwc_participants_spoke_for"] = [];
					} else {
						new_obj["role"] = key;
					}
				}
				new_obj.role ? new_obj["nwc_participants"] = [] : null;
				new_obj['nwc_participants'] && roles_data.push(new_obj)
				new_obj['plank'] && planks_data.push(new_obj)
			}

			// console.log(planks_data);
			for (let i = 0; i < csvData.length; i++) {
				var obj = csvData[i];
				obj["participant_id"] = parseInt(obj["ID"]);
				var key, keys = Object.keys(obj);
				let new_participant_obj = {};
				for (let j = 0; j < keys.length; j++) {
					key = keys[j];
					if (obj[key] == "NA" || startsWith(obj[key], 'unknow') || startsWith(obj[key], 'no known involvement')) {
					} else if (key == "Exhibitor") {
						obj[key] == "yes" ? new_participant_obj['exhibitor'] = true : new_participant_obj['exhibitor'] = false;

					} else if (key == "Torch Relay Runner") {
						obj[key] == "yes" ? new_participant_obj['torch_relay_runner'] = true : new_participant_obj['torch_relay_runner'] = false;

					} else if (startsWith(key, 'Member of State Level IWY')) {
						obj[key] == "yes" ? new_participant_obj['member_of_state_level_IWY_coordinating_committee'] = true : new_participant_obj['member_of_state_level_IWY_coordinating_committee'] = false;
					} else if (
						obj[key] == "yes" &&
						!(
							endsWith(key, "Plank") ||
							startsWith(key, "Stance on the")
						)
					) {
						roles_data.forEach((e) => {
							e.role == key ? e.nwc_participants.push(obj["participant_id"]) : null;
						})
					} 
					else if (
						obj[key] == "spoke for" &&
						(endsWith(key, "Plank") || startsWith(key, "Stance on the"))
					) {
						planks_data.forEach((e) => {
							e.plank == key ? e.nwc_participants_spoke_for.push(obj["participant_id"]) : null;
						})
					} 
					 else if (
						obj[key] == "for" &&
						(endsWith(key, "Plank") || startsWith(key, "Stance on the"))
					) {
						planks_data.forEach((e) => {
							e.plank == key ? e.nwc_participants_for.push(obj["participant_id"]) : null;
						})
					}
					 else if (
						obj[key] == "spoke against" &&
						(endsWith(key, "Plank") ||
							startsWith(key, "Stance on the"))
					) {
						planks_data.forEach((e) => {
							e.plank == key ? e.nwc_participants_against.push(obj["participant_id"]) : null;
						})
					}
					
					Object.keys(new_participant_obj).length > 0
					? (new_participant_obj["participant_id"] = obj["participant_id"])
					: null;
				}
				new_participant_obj['participant_id'] && participant_data.push(new_participant_obj);
			}
			roles_data.forEach((obj, index) => {obj["id"] = index + 1;});
			planks_data.forEach((obj, index) => {obj["id"] = index + 1;});
			participants.data["api::nwc-role.nwc-role"] = toObject(roles_data,"id");
			participants.data["api::nwc-plank.nwc-plank"] = toObject(planks_data,"id");

			participant_data.forEach((obj) => {
				let keys = Object.keys(obj);
				keys.includes('exhibitor') ? (
					participants.data["api::nwc-participant.nwc-participant"][`${obj.participant_id}`]['exhibitor'] = obj.exhibitor
					) : null;
				keys.includes('torch_relay_runner') ? participants.data["api::nwc-participant.nwc-participant"][`${obj.participant_id}`]['torch_relay_runner'] = obj.torch_relay_runner : null;
				keys.includes('member_of_state_level_IWY_coordinating_committee') ? participants.data["api::nwc-participant.nwc-participant"][`${obj.participant_id}`]['member_of_state_level_IWY_coordinating_committee'] = obj.member_of_state_level_IWY_coordinating_committee : null;
			
			})
		})
		// .then(() => {
		// 	var jsonContent = JSON.stringify(participants);
		// 	fs.writeFile("participants.json", jsonContent, 'utf8', function (err) {
		// 		if (err) {
		// 			console.log("An error occured while writing JSON Object to File.");
		// 			return console.log(err);
		// 		}
		// 		console.log("JSON file has been saved.");
		// 	});
		// })
		.catch((err) => {
			console.log(err);
		});
}
function getBasicData() {
	CSVToJSON()
		.fromFile("./data/Basic Data.csv")
		.then((csvData) => {
			let participant_data = [];
			let religion_data = [];
			let residence_in_1977_data = [];
			let state_data = [];
			for (let i = 0; i < csvData.length; i++) {
				let obj = csvData[i];
				let key, keys = Object.keys(obj);
				let new_participant_obj = {};
				let new_religion_obj = {};
				let new_residence_obj = {};
				let new_state_obj = {};
				for (let j = 0; j < keys.length; j++) {
					key = keys[j];
					newkey = key.replace(/\([^()]*\)/g, "");
					newkey = newkey.replace(/\s+/g, "_").toLowerCase();
					if (
						startsWith(newkey, "age_in") ||
						startsWith(newkey, "birth") ||
						startsWith(newkey, "death") ||
						startsWith(newkey, "zip") ||
						startsWith(newkey, "specific") ||
						startsWith(newkey, "id")
					) {
						var numberValue = parseInt(obj[key]);
						!Number.isNaN(numberValue) ? new_participant_obj[newkey] = numberValue : null;
					} else if (
						startsWith(newkey, "notes") ||
						obj[key] == "NA"
					) {
						//remove notes, NAs
					} else if (startsWith(newkey, "total_number")){
						new_participant_obj['total_number_of_children'] = parseInt(obj[key]);
					} else if (startsWith(newkey, "religion")) {
						new_religion_obj[newkey]= obj[key]
					} else if (startsWith(newkey, "state")) {
						new_state_obj[newkey] = obj[key];
					} else if (startsWith(newkey, "residence_")) {
						new_residence_obj["city_state"] = obj[key];
					} else if (startsWith(newkey, "total_population_")) {
						new_residence_obj["total_population"] = parseInt(obj[key]);
					} else if (startsWith(newkey, "median_household")) {
						new_residence_obj["median_household_income"] = parseInt(obj[key]);
					} else if (newkey == "classification") {
						new_residence_obj["classification"] = obj[key];
					} else if (startsWith(newkey, "middle_name")) {
						new_participant_obj["middle_name_initial"] = obj[key];
					} else if (startsWith(newkey, "name_of_spouse")) {
						new_participant_obj["name_of_spouse"] = obj[key];
					} else{
						new_participant_obj[newkey] = obj[key];
					}
				}
				new_participant_obj['education'] = [];
				new_participant_obj['career'] = [];
				new_participant_obj['spouse_profession'] = [];
				new_participant_obj['political_office_hold'] = [];
				new_participant_obj['political_offices_lost'] = [];
				new_participant_obj['leaderships_in_organization'] = [];
				new_participant_obj['spouse_political_office'] = [];
				participant_data.push(new_participant_obj);

				new_religion_obj['participants']=[]
				new_religion_obj.religion ? religion_data.push(new_religion_obj) : null;;
				new_residence_obj['nwc_participants']=[]
				new_residence_obj.city_state ?residence_in_1977_data.push(new_residence_obj) : null;
				new_state_obj['nwc_participants']=[]
				new_state_obj.state ? state_data.push(new_state_obj) : null;
			}
			
			religion_data = getUniqueListBy(religion_data, "religion");
			residence_in_1977_data = getUniqueListBy(residence_in_1977_data,"city_state");
			state_data = getUniqueListBy(state_data, "state");

			csvData.forEach((obj) => {
				religion_data.forEach((e) => {e.religion == obj["Religion"]? e.participants.push(parseInt(obj["ID"])): null;});
				residence_in_1977_data.forEach((e) => {e.city_state == obj["Residence in 1977"]? e.nwc_participants.push(parseInt(obj["ID"])): null;});
				state_data.forEach((e) => {e.state == obj["State"]? e.nwc_participants.push(parseInt(obj["ID"])): null;});
			})

			religion_data.forEach((obj, index) => {obj["id"] = index + 1;});
			residence_in_1977_data.forEach((obj, index) => {obj["id"] = index + 1;});
			state_data.forEach((obj, index) => {obj["id"] = index + 1;});

			participants.data["api::nwc-participant.nwc-participant"] = toObject(participant_data,"id");
			participants.data["api::religion.religion"] = toObject(religion_data,"id");
			participants.data["api::resident-in-1977.resident-in-1977"] =toObject(residence_in_1977_data, "id");
			participants.data["api::state.state"] = toObject(state_data, "id");

			get_education_and_career_data() // CHecked
			get_electoral_politices() // CHecked
			get_leadership_in_org() //Cheked
			get_organization_and_political() //Cheked
			get_race_and_ethnicity() //checked
			get_roles_and_planks() //checked
		})
		// .then(() => {
		// 	var jsonContent = JSON.stringify(participants);
		// 	fs.writeFile("participants.json", jsonContent, 'utf8', function (err) {
		// 		if (err) {
		// 			console.log("An error occured while writing JSON Object to File.");
		// 			return console.log(err);
		// 		}
		// 		console.log("JSON file has been saved.");
		// 	});
		// })
		.catch((err) => {
			console.log(err);
		});
}


getBasicData()
