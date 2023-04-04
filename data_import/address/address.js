const qs = require('qs');
const fs = require("fs");
const axios = require('axios');
const xlsx = require("xlsx");

const fetchData = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

async function fetchAllData(){
    const file = fs.readFileSync("address.xlsx");
    const workbook = xlsx.read(file, { type: "array" });
    let sheets = workbook.SheetNames.map((sheet) => {
        return xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
    });
    const promises = sheets[0].map(async (address) => {
        let query = qs.stringify({
            street:address.street,
            city:address.city,
            state:address.state,
            zip:address.zip
        });
        let result = await fetchData(`https://geocode.maps.co/search?${query}`);
        return {
            id: address.id,
            name: address.name,
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zip,
            lat: result[0]?.lat,
            lon: result[0]?.lon,
            boundingbox: result[0]?.boundingbox,
            rowData: result
        }
    });

    const results = await Promise.all(promises);

	fs.writeFileSync("./address.json", JSON.stringify(results), "utf-8");
    console.log('Process completed, address.json file created');

}
fetchAllData()