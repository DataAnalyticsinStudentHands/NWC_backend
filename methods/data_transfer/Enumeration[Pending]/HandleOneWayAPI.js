const fs = require("fs");
const _sth = require("../utility/utility.js");
const apiObj = JSON.parse(fs.readFileSync("../utility/api.json", "utf-8"));
var dataContent = JSON.parse(fs.readFileSync(`${process.argv[2]}`, "utf-8"));

async function handleOneWayAPI(strValues,participantsData, apiName, attributes, spliterator ){
    spliterator = spliterator ? spliterator : ',';
	let newValues = strValues.split(spliterator)
	let newData = {};

	Object.values(participantsData.data[apiName]).forEach((e) => {
		newData[`${e[attributes]}`] ? null : newData[e[attributes]] = _sth.removeNullUndefined({
			id: e.id ,
			[attributes]: e[attributes]
		});
	});
	newValues.forEach((e) => {
		newData[e] ? null : newData[e] = {
			id: Object.keys(newData).length+1,
			[attributes]: e
		};
	});
	// let lookup = {}
	// Object.values(newData).map((e) => {
	// 	lookup[e[attributes]] = e.id
	// });
	participantsData.data[apiName] = _sth.toObject(Object.values(newData), 'id')

	return participantsData
	// Save to the main json file
	// fs.writeFileSync(`${process.argv[2]}`, JSON.stringify(dataContent, null, 2), "utf-8");
	// Save the lookup file
	// fs.writeFileSync(`${attributes}.json`, JSON.stringify(lookup, null, 2), "utf-8");
}

handleOneWayAPI(
    "Administrator,Board Member,Chair/President,Founder/Co-founder,Member,Representative,Other Community Leadership,Other Officer,Vice-chair/Vice-president",
	apiObj.organizational_role,
    'organization_role',
    "./organization_role.json",
);

handleOneWayAPI(
	"Agriculture; Architecture and Engineering; Arts and Entertainment; Clergy/Religious-Related Employment; Construction and Trade; Corporate and Management; Education and Libraries; Finance, Insurance, and Real Estate; Food, Retail, and Hospitality; Government/Public Sector/Nonprofit; Homemaker; Law and Legal Employment; Law Enforcement and Criminal Justice; Manufacturing and Industrial Production; Media and Communications; Medical/Health Care/Social Work; Office and Administrative Support; Science and Technology; Service Sector; Small Business Owner; Student; Transportation and Public Utilities; Unemployed; Wholesale and Retail",
	apiObj.career_category,
    'career_category',
    "./career_category.json",
    '; '
);