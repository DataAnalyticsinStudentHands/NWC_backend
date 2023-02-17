const CSVToJSON = require("csvtojson");
const _sth = require('./utility.js');
const fs = require("fs");
var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));
var apiObj = JSON.parse(fs.readFileSync("./data/api.json", "utf-8"));

async function get_roles_and_planks() {
	try {
		const csvData = await CSVToJSON().fromFile("./data/Position on Planks.csv");
		let planks_data = []; 

		csvData.forEach((e) => {
			let keys = Object.keys(e)
			keys.forEach((key) => {
                ['for', 'against','spoke about with position unknown'].includes(e[key]) ? planks_data.push({
                    participant_id: parseInt(e.ID),
                    stand: e[key],
                    plank:key
                }) : null
			})
		})

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
                    case "spoke about with position unknown":
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
                    case "spoke about with position unknown":
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
        plank_obj = Object.assign(plank_obj, participants.data[`${apiObj.plank}`]);
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
        participants.data[`${apiObj.plank}`] = _sth.toObject(Object.values(new_plank_obj),'id')

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