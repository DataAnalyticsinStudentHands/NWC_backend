const CSVToJSON = require("csvtojson");
const _sth = require("../utility/utility.js");

async function roles_and_planks(participants, path, apiObj) {
	try {
		const csvData = await CSVToJSON().fromFile(path);
		let roles_data = [];
		csvData.forEach((e) => {
			let keys = Object.keys(e)
			keys.forEach((key) => {
                e[key] == 'yes' ? roles_data.push({
                    participant_id: parseInt(e.ID),
                    role: key,
                }) : null;
                key == 'Other Role' && e[key] != 'NA' ? roles_data.push({
                    participant_id: parseInt(e.ID),
                    role: e[key],
                }): null;
            })
        })
        //API Role
        participants = _sth.handleAPI(roles_data,participants, 'role',apiObj.role);

        return participants;

	} catch (err) {
		console.log(err);
	}
}
module.exports = {
    roles_and_planks
}
