const CSVToJSON = require("csvtojson");
const { startsWith } = require("lodash");
const _sth = require("./utility.js");
const fs = require("fs");
var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));

async function get_electoral_politices() {
	try {
		const csvData = await CSVToJSON().fromFile("./data/Electoral Politics.csv");
		let party_data = []; let commission_data = []; let suppose_party_data = [];
        let office_hold_data = []; let office_lost_data = [];
		csvData.forEach((e) => {
			let keys = Object.keys(e);
			keys.forEach((key) => {
                if(key === "ID" || key === "Name" || startsWith(key, "...") ||key === "Notes" || e[key] == "NA"){
                } else if (key === "Political Party Membership") {
                    party_data.push({political_party: e[key],participant_id: parseInt(e.ID)})
                } else if ( startsWith(key, "President's Commission")
                            || startsWith(key, "state level Commission")
                            || startsWith(key, "county level Commission")
                            || startsWith(key, "city level Commission")) {
                                commission_data.push({level_of_commission: key ,participant_id: parseInt(e.ID)})
                } else if (startsWith(key, "Spouse")) {
                    suppose_party_data.push({spouse_political_office: e[key],participant_id: parseInt(e.ID)})
                } else if (startsWith(key, "Name of Political Offices Held")) {
                    office_hold_data.push(_sth.removeNullUndefined({
                        participant_id: parseInt(e.ID),
                        level: e['Jurisdiction of Political Offices Held (if true for more than one category, create a new row for each)'] == 'NA' ? null : e['Jurisdiction of Political Offices Held (if true for more than one category, create a new row for each)'],
                        start_year: e['Start Year for Political Office'] == "NA"? null : parseInt(e['Start Year for Political Office']),
                        end_year: e['End Year for Political Office'] == 'NA' ? null : parseInt(e['End Year for Political Office']),
                        jurisdiction_of_political_offices_held: e[key]
                    }))
                } else if (startsWith(key, "Name of Political Offices Sought but Lost")) {
                    office_lost_data.push(_sth.removeNullUndefined({
                        participant_id: parseInt(e.ID),
                        level: ['NA','none'].includes(e['Jurisdiction of Political Offices Sought but Lost']) ? null : e['Jurisdiction of Political Offices Held (if true for more than one category, create a new row for each)'],
                        year: e['Year of Race that was Lost'] == "NA"? null : parseInt(e['Year of Race that was Lost']),
                        political_offices_name: e[key]
                    }))
                } 
			});
		});
        // // API commission
        participants = _sth.handleAPI(commission_data, participants, 'level_of_commission', Object.keys(participants.data)[6])
        // API party
        participants = _sth.handleAPI(party_data, participants, 'political_party', Object.keys(participants.data)[7])
        // Component suppose party
        participants = _sth.handleComponent(suppose_party_data, participants, Object.keys(participants.data)[12])
        participants = _sth.pushComonent(suppose_party_data, participants, "spouse_political_office")
        // Component political_office_hold
        participants = _sth.handleComponent(office_hold_data, participants, Object.keys(participants.data)[14])
        participants = _sth.pushComonent(office_hold_data, participants, "political_office_hold")
        // Component political_office_lost
        participants = _sth.handleComponent(office_lost_data, participants,Object.keys(participants.data)[13])
        participants = _sth.pushComonent(office_lost_data, participants, "political_offices_lost")

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
get_electoral_politices();