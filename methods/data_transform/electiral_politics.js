const CSVToJSON = require("csvtojson");
const _sth = require("./utility.js");

async function get_electoral_politices(participants, path) {
	try {
		const csvData = await CSVToJSON().fromFile(path);
		let party_data = []; let commission_data = []; let suppose_party_data = [];
        let office_hold_data = []; let office_lost_data = []; feminist_data = [];
        csvData.forEach((e) => {
            let values = Object.values(e);
            let keys = Object.keys(e);

            !["NA","none"].includes(values[2]) || values[3] !== "NA"  || values[4] !== 'NA' ||values[5] !== 'NA' ? 
            office_hold_data.push(_sth.removeNullUndefined({
                participant_id: parseInt(e.ID),
                level: !["NA","none"].includes(values[2]) ? values[2] : null,
                political_offices_name: values[3] !== "NA" ? values[3] : null,
                start_year: values[4] !== "NA" ? values[4] : null,
                end_year: values[5] !== "NA" ? values[5] : null,

            })) : null;
            !["NA","none"].includes(values[6]) || values[7] !== "NA"  || !Number.isNaN(parseInt(values[8])) ? 
            office_lost_data.push(_sth.removeNullUndefined({
                participant_id: parseInt(e.ID),
                level: !["NA","none"].includes(values[6]) ? values[6] : null,
                political_offices_name: values[7] !== "NA" ? values[7] : null,
                year: !Number.isNaN(parseInt(values[8])) ? parseInt(values[8]) : null,
            })) : null;

            values[9] !== "NA" ? party_data.push({political_party: values[9],participant_id: parseInt(e.ID)}) : null;
            values[10] !== "NA" ? suppose_party_data.push({spouse_political_office: values[10],participant_id: parseInt(e.ID)}) : null;
            values[11] == "yes" ? feminist_data.push({feminist: true,participant_id: parseInt(e.ID)}) : null;

            values[12] !== "NA" ? commission_data.push({level_of_commission: keys[12],participant_id: parseInt(e.ID)}) : null;
            values[13] !== "NA" ? commission_data.push({level_of_commission: keys[13],participant_id: parseInt(e.ID)}) : null;
            values[14] !== "NA" ? commission_data.push({level_of_commission: keys[14],participant_id: parseInt(e.ID)}) : null;
            values[15] !== "NA" ? commission_data.push({level_of_commission: keys[15],participant_id: parseInt(e.ID)}) : null;
        });
        // // API commission
        participants = _sth.handleAPI(commission_data, participants, 'level_of_commission', Object.keys(participants.data)[6])
        // // API party
        participants = _sth.handleAPI(party_data, participants, 'political_party', Object.keys(participants.data)[7])
        // // feminist
        feminist_data.forEach((e) => {participants.data[Object.keys(participants.data)[0]][`${e.participant_id}`].feminist = true;})
        // // Component suppose party
        participants = _sth.handleComponent(suppose_party_data, participants, Object.keys(participants.data)[12])
        participants = _sth.pushComonent(suppose_party_data, participants, "spouse_political_office")

        // // Component political_office_hold
        participants = _sth.handleComponent(office_hold_data, participants, Object.keys(participants.data)[14])
        participants = _sth.pushComonent(office_hold_data, participants, "political_office_hold")
        // // // Component political_office_lost
        participants = _sth.handleComponent(office_lost_data, participants,Object.keys(participants.data)[13])
        participants = _sth.pushComonent(office_lost_data, participants, "political_offices_lost")

        return participants

	} catch (err) {
		console.log(err);
	}
}

module.exports = {
    get_electoral_politices
}