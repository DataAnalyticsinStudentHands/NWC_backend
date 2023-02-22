const fs = require("fs");
const basic = require("./functions/basic_data.js");
const edu = require("./functions/education_and_career.js");
const electoral = require("./functions/electiral_politics.js");
const leadership = require("./functions/leadership_in_org.js");
const org = require("./functions/organizational_and_political.js");
const position = require("./functions/position_and_planks.js");
const race = require("./functions/race_and_ethnicity.js");
const role = require("./functions/role_at_nwc.js");
const _sth = require("./utility/utility.js");
const apiObj = JSON.parse(fs.readFileSync("./utility/api.json", "utf-8"));
const dataFolder = fs.readdirSync(process.argv[2]);
const fileLookup = {
    basic_data: "Basic Data.csv",
    ed_and_career: "Ed & Career.csv",
    electoral_politics: "Electoral Politics.csv",
    leadership_in_org: "Leadership in Org.csv",
    organizational_and_political: "Organizational & Political.csv",
    position_on_planks: "Position on Planks.csv",
    race_and_ethnicity: 'Race & Ethnicity--Expanded.csv',
    role_at_nwc: "Role at NWC.csv"
}

var dataContent = JSON.parse(fs.readFileSync(`${process.argv[3]}`, "utf-8"));

async function main() {
    
    dataFolder.includes(fileLookup.basic_data) ? dataContent = await basic.getBasicData(dataContent, `./${process.argv[2]}/${fileLookup.basic_data}`, apiObj) : null;
    dataFolder.includes(fileLookup.ed_and_career) ? dataContent = await edu.education_and_career(dataContent, `./${process.argv[2]}/${fileLookup.ed_and_career}`,apiObj) : null;
    dataFolder.includes(fileLookup.electoral_politics) ? dataContent = await electoral.electoral_politices(dataContent, `./${process.argv[2]}/${fileLookup.electoral_politics}`,apiObj) : null;
    dataFolder.includes(fileLookup.leadership_in_org) ? dataContent = await leadership.leadership_in_org(dataContent, `./${process.argv[2]}/${fileLookup.leadership_in_org}`, apiObj) : null;
    dataFolder.includes(fileLookup.organizational_and_political) ? dataContent = await org.organizational_and_political(dataContent, `./${process.argv[2]}/${fileLookup.organizational_and_political}`, apiObj) : null;
    dataFolder.includes(fileLookup.position_on_planks) ? dataContent = await position.position_and_planks(dataContent, `./${process.argv[2]}/${fileLookup.position_on_planks}`, apiObj) : null;
    dataFolder.includes(fileLookup.race_and_ethnicity) ? dataContent = await race.race_and_ethnicity(dataContent, `./${process.argv[2]}/${fileLookup.race_and_ethnicity}`, apiObj) : null;
    dataFolder.includes(fileLookup.role_at_nwc) ? dataContent = await role.roles_and_planks(dataContent, `./${process.argv[2]}/${fileLookup.role_at_nwc}`, apiObj) : null;

    // This is temperary
    dataContent.data[apiObj.organizational_role] = {}
    dataContent.data[apiObj.career_category] = {}
    dataContent = await _sth.handleOneWayAPI(
        "Administrator,Board Member,Chair/President,Founder/Co-founder,Member,Representative,Other Community Leadership,Other Officer,Vice-chair/Vice-president",
        dataContent,
        apiObj.organizational_role,
        'organization_role',
    )
    dataContent = await _sth.handleOneWayAPI(
        "Agriculture; Architecture and Engineering; Arts and Entertainment; Clergy/Religious-Related Employment; Construction and Trade; Corporate and Management; Education and Libraries; Finance, Insurance, and Real Estate; Food, Retail, and Hospitality; Government/Public Sector/Nonprofit; Homemaker; Law and Legal Employment; Law Enforcement and Criminal Justice; Manufacturing and Industrial Production; Media and Communications; Medical/Health Care/Social Work; Office and Administrative Support; Science and Technology; Service Sector; Small Business Owner; Student; Transportation and Public Utilities; Unemployed; Wholesale and Retail",
        dataContent,
        apiObj.career_category,
        'career_category',
        '; '
    )

    fs.writeFileSync(process.argv[3], JSON.stringify(dataContent), "utf-8");

}
main().then;
