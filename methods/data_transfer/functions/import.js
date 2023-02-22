const fs = require("fs");
const qs = require("qs");
var participant = {
	"version": 2,
	"data": {
		"api::nwc-participant.nwc-participant": {}
	}
}
async function addressData(){

    let addressData = JSON.parse(fs.readFileSync("./data/address.json", "utf8"));
    Object.values(addressData).forEach((e) => {
        participant.data["api::nwc-participant.nwc-participant"][e.participant_id] = {
            id: e.participant_id,
            address: e.address,
            city: e.city,
            zip_code: e.zip,
            lat: parseFloat(e.lat),
            lon: parseFloat(e.lon),
            boundingbox: e.boundingbox
        };
    });
    fs.writeFileSync("./participantsAddress.json", JSON.stringify(participant), "utf8", (err) => {
        if(err) throw err;
        console.log("Done");
    });
    
}
addressData();