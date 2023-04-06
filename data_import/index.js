const xlsx = require("xlsx");
const fs = require("fs");
const _ = require("lodash");

const basic = require("./function/handleBasic.js");
const basicrace = require("./function/handleBasicRace.js");
const race = require("./function/handleRace.js");
const educarr = require("./function/handleEdandCar.js");
const electpol = require("./function/handleElectoralPolitics.js");
const leadership = require("./function/handleLeadership.js");
const organization = require("./function/handleOrganizational.js");
const nwcrole = require("./function/handleNWCRole.js");
const position = require("./function/handlePosition.js");

const handleData = async (data, handler, params) => {
	if (data) {
		return await handler(data, ...params);
	}
	return null;
};

async function main() {

	const file = fs.readFileSync(process.argv[2]);
	const workbook = xlsx.read(file, { type: "array" });
	const sheets = {};
	workbook.SheetNames.forEach((sheet) => {
		sheets[sheet] = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
	});

	const dataContent = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));

	const [
		basicData,
		basicRaceData,
		raceData,
		edAndCareerData,
		electoralPoliticsData,
		leadershipData,
		organizationalData,
		roleData,
		positionData,
	] = await Promise.all([
		handleData(
            sheets["Basic Data"], basic.handleBasicData, [
			dataContent.data["api::nwc-participant.nwc-participant"],
			dataContent.data["api::resident-in-1977.resident-in-1977"],
		]),
		handleData(
			sheets["Race & Ethnicity--Reg Forms"], basicrace.handleBasicRaceData,[
				dataContent.data["api::basic-race.basic-race"]
			]
		),
		handleData(sheets["Race & Ethnicity--Expanded"], race.handleRaceData, [
			dataContent.data["api::race.race"],
		]),
		handleData(sheets["Ed & Career"], educarr.handleEdandCareerData, [
			dataContent.data["api::nwc-participant.nwc-participant"],
			dataContent.data["api::data-education.data-education"],
			dataContent.data["api::data-career.data-career"],
			dataContent.data["api::data-spouse-career.data-spouse-career"],
		]),
		handleData(
			sheets["Electoral Politics"], electpol.handleElectoralPoliticsData,[
				dataContent.data["api::nwc-participant.nwc-participant"],
				dataContent.data["api::data-political-office-held.data-political-office-held"],
				dataContent.data["api::data-political-office-lost.data-political-office-lost"],
				dataContent.data["api::data-spouse-political-office.data-spouse-political-office"],
			]
		),
		handleData(
			sheets["Leadership in Org"],
			leadership.handleLeadershipData,[
				dataContent.data["api::data-leadership-in-organization.data-leadership-in-organization"],
			]
		),
		handleData(
			sheets["Organizational & Political"], organization.handleOrganizationalData,[
				dataContent.data["api::organizational-and-political.organizational-and-political"],
			]
		),
		handleData(sheets["Role at NWC"], nwcrole.handleNWCRoleData, [
			dataContent.data["api::nwc-participant.nwc-participant"],
			dataContent.data["api::nwc-role.nwc-role"],
		]),
		handleData(sheets["Position on Planks"], position.handlePositionData, [
			dataContent.data["api::nwc-plank.nwc-plank"],
		]),
	]);

	const mergedData = _.merge(
		{},
		basicData,
		basicRaceData,
		raceData,
		edAndCareerData,
		electoralPoliticsData,
		leadershipData,
		organizationalData,
		roleData,
		positionData
	);

	fs.writeFileSync(
		"data.json",
		JSON.stringify({
			version: 2,
			data: mergedData,
		}),
		"utf-8"
	);
}
main()
	.then(() => {
		console.log("done");
	})
	.catch((err) => {
		console.log(err);
	});
