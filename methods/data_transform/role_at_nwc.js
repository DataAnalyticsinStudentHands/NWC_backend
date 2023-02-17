const CSVToJSON = require("csvtojson");
const _sth = require('./utility.js');

async function get_roles_and_planks(participants, path) {
	try {
		const csvData = await CSVToJSON().fromFile(path);
		let roles_data = [];let other_role_data = [];

		csvData.forEach((e) => {
			let keys = Object.keys(e)
			keys.forEach((key) => {
                e[key] == 'yes' ? roles_data.push({
                    participant_id: parseInt(e.ID),
                    role: key,
                }) : null;
                key == 'Other Role' && e[key] != 'NA' ? other_role_data.push({
                    participant_id: parseInt(e.ID),
                    other_role: e[key],
                }): null;
            })
        })
        //API Role
        participants = _sth.handleAPI(roles_data,participants, 'role',Object.keys(participants.data)[4]);

        // Component Other Role
        participants = _sth.handleComponent(other_role_data, participants, Object.keys(participants.data)[10])
        participants = _sth.pushComonent(other_role_data, participants, "other_role")

        return participants;
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
    get_roles_and_planks
}