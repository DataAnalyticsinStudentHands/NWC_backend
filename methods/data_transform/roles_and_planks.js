const CSVToJSON = require("csvtojson");
const { endsWith, startsWith } = require("lodash");
const _sth = require('./utility.js');
const fs = require("fs");
var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));

async function get_roles_and_planks() {
	try {
		const csvData = await CSVToJSON().fromFile("./data/Role at NWC.csv");
		let participant_data = []; let roles_data = []; let planks_data = []; let other_role_data = [];

		csvData.forEach((e) => {
			let keys = Object.keys(e)
			keys.forEach((key) => {
				if (key === "ID" || key === "Name" || startsWith(key, "Notes") || e[key] ==='NA' || e[key] =='no known involvement' || e[key] === 'unknown'){
				} else if (key === 'Exhibitor' || key === 'Torch Relay Runner' || startsWith(key, "Member of State Level IWY")){
					participant_data.push({participant_id: parseInt(e.ID),role: key, status: e[key]})
				} else if(endsWith(key, "Plank") || startsWith(key, "Stance on the ERA")){
					planks_data.push({participant_id: parseInt(e.ID),stand: e[key],plank:key})
				} else if(startsWith(key, "Other")){
					other_role_data.push({participant_id: parseInt(e.ID),role: e[key],})
				} else if (e[key] == "yes"){
					roles_data.push({participant_id: parseInt(e.ID),role: key, status: e[key]})
				} 
			})
		})
        // Component Other Role
        participants = _sth.handleComponent(other_role_data, participants, Object.keys(participants.data)[10])
        participants = _sth.pushComonent(other_role_data, participants, "other_role")

        //API Role
        participants = _sth.handleAPI(roles_data,participants, 'role',Object.keys(participants.data)[4]);

        //API Planks
        let plank_obj = {}; let new_plank_obj = {};
        Object.values(planks_data).forEach((e) => {
            e.participants_for = [];
            e.participants_against = [];
            e.participants_spoke_for = [];
            if (plank_obj[`${e.plank}`]){
                switch (e.stand) {
                    case "for":
                        plank_obj[`${e.plank}`].participants_for.push(e.participant_id);
                        break;
                    case "spoke for":
                        plank_obj[`${e.plank}`].participants_spoke_for.push(e.participant_id);
                        break;
                    case "against":
                        plank_obj[`${e.plank}`].participants_against.push(e.participant_id);
                        break;
                }
            } else {
                plank_obj[`${e.plank}`] = e
                switch (e.stand) {
                    case "for":
                        plank_obj[`${e.plank}`].participants_for.push(e.participant_id);
                        break;
                    case "spoke for":
                        plank_obj[`${e.plank}`].participants_spoke_for.push(e.participant_id);
                        break;
                    case "against":
                        plank_obj[`${e.plank}`].participants_against.push(e.participant_id);
                        break;
                }
                delete plank_obj[`${e.plank}`].participant_id;
                delete plank_obj[`${e.plank}`].stand;
            }
        })
        plank_obj = Object.assign(plank_obj, participants.data[`${Object.keys(participants.data)[3]}`]);
        Object.values(plank_obj).forEach((e) => {
            if(new_plank_obj[`${e.plank}`]){
                _sth.merge(new_plank_obj[`${e.plank}`].participants_for, e.participants_for)
                _sth.merge(new_plank_obj[`${e.plank}`].participants_against, e.participants_against)
                _sth.merge(new_plank_obj[`${e.plank}`].participants_spoke_for, e.participants_spoke_for)
            } else {
                e.id ? null : e.id = Object.keys(new_plank_obj).length+1
                new_plank_obj[`${e.plank}`] = e
            }
        })
        participants.data[`${Object.keys(participants.data)[3]}`] = _sth.toObject(Object.values(new_plank_obj),'id')


        // Update API Participants
        participant_data.forEach((e) => {
            switch(e.role) {
                case "Exhibitor":
                    e.status == "yes"? participants.data[`${Object.keys(participants.data)[0]}`][`${e.participant_id}`]['exhibitor'] = true : null; 
                    e.status == "no"? participants.data[`${Object.keys(participants.data)[0]}`][`${e.participant_id}`]['exhibitor'] = false : null; 
                    break;
                case "Torch Relay Runner":
                    e.status == "yes"? participants.data[`${Object.keys(participants.data)[0]}`][`${e.participant_id}`]['torch_relay_runner'] = true : null; 
                    e.status == "no"? participants.data[`${Object.keys(participants.data)[0]}`][`${e.participant_id}`]['torch_relay_runner'] = false : null; 
                    break;
                case "Member of State Level IWY Coordinating Committee":
                    e.status == "yes"? participants.data[`${Object.keys(participants.data)[0]}`][`${e.participant_id}`]['member_of_state_level_IWY_coordinating_committee'] = true : null; 
                    e.status == "no"? participants.data[`${Object.keys(participants.data)[0]}`][`${e.participant_id}`]['member_of_state_level_IWY_coordinating_committee'] = false : null; 
                    break;                 
            }
        })

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

get_roles_and_planks()