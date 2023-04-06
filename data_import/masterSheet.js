const fs = require("fs");
const { toObject } = require('./utility/utility');
const dataContent = JSON.parse(fs.readFileSync('existingData0402.json', "utf8"));
const data = Object.values(dataContent.data["api::nwc-participant.nwc-participant"]).map((item) => {
    return {
        id: item.id,
        last_name: item.last_name,
        first_name: item.first_name,
        represented_state : item.represented_state,
    }
});
fs.writeFileSync('jsonData/MasterSheet.json', JSON.stringify(toObject(data, 'id')), 'utf-8');