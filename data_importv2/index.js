const xlsx = require('xlsx');
const fs = require('fs');

const file = fs.readFileSync('TXDemographics_NBY_Pub_2023-02-24.xlsx');
const workbook = xlsx.read(file, { type: "array" });
const sheets = {}
workbook.SheetNames.forEach((sheet) => {
    sheets[sheet] = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
})
const dataContent = JSON.parse(fs.readFileSync('existingData.json', 'utf8'));
const basic = require('./function/handleBasic.js');
const basicrace = require('./function/handleBasicRace.js');
const race = require('./function/handleRace.js');
const educarr = require('./function/handleEdandCar.js');
const electpol = require('./function/handleElectoralPolitics.js');
const leadership = require('./function/handleLeadership.js');
const organization = require('./function/handleOrganizational.js');
const nwcrole = require('./function/handleNWCRole.js');
const position = require('./function/handlePosition.js');


Object.keys(sheets).forEach(async(sheet) => {
    switch (sheet) {
        case 'Basic Data':
           basic.handleBasicData(
                sheets[sheet], 
                await dataContent.data['api::nwc-participant.nwc-participant'],
                await dataContent.data['api::resident-in-1977.resident-in-1977']
            )
            break;
        case 'Race & Ethnicity--Reg Forms':
            basicrace.handleBasicRaceData(
                sheets[sheet],
                dataContent.data['api::basic-race.basic-race']
            )
            break;
        case 'Race & Ethnicity--Expanded':
            race.handleRaceData(
                sheets[sheet],
                dataContent.data["api::race.race"]
            )
            break;
        case 'Ed & Career':
            educarr.handleEdandCareerData(
                sheets[sheet],
                dataContent.data["api::nwc-participant.nwc-participant"],
                dataContent.data["api::data-education.data-education"],
                dataContent.data["api::data-career.data-career"],
                dataContent.data["api::data-spouse-career.data-spouse-career"],
            )
            break;
        case 'Electoral Politics':
            electpol.handleElectoralPoliticsData(
                sheets[sheet],
                dataContent.data["api::nwc-participant.nwc-participant"],
                dataContent.data["api::data-political-office-held.data-political-office-held"],
                dataContent.data["api::data-political-office-lost.data-political-office-lost"],
                dataContent.data["api::data-spouse-political-office.data-spouse-political-office"],
            )
            break;
        case 'Leadership in Org':
            leadership.handleLeadershipData(
                sheets[sheet],
                dataContent.data["api::data-leadership-in-organization.data-leadership-in-organization"],
            )
            break;
        case 'Organizational & Political':
            organization.handleOrganizationalData(
                sheets[sheet],
                dataContent.data["api::organizational-and-political.organizational-and-political"],
            )
            break;
        case 'Role at NWC':
            nwcrole.handleNWCRoleData(
                sheets[sheet],
                dataContent.data["api::nwc-participant.nwc-participant"],
                dataContent.data["api::nwc-role.nwc-role"],
            )
            break;
        case 'Position on Planks':
            position.handlePositionData(
                sheets[sheet],
                dataContent.data["api::nwc-plank.nwc-plank"],
            )
            break;
        default:
            break;
    }
})

// fs.writeFileSync('data.json', JSON.stringify(sheetobj), 'utf-8');


