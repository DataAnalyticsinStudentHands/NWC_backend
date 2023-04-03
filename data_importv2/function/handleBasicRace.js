const fs = require("fs");
const { toObject, onlyInLeft, merge } = require('../utility/utility');

const raceObj = {
    "Asian American/Pacific Islander": { id: 1, race: "Asian American/Pacific Islander" },
    "Black": {id: 2, race: "Black"},
    "Hispanic": {id : 3, race: "Hispanic"},
    "Native American/American Indian": { id : 4, race: "Native American/American Indian"},
    "White": {id: 5, race: "White"} // Must fix 'white' in the xlsx file
}

async function handleBasicRaceData (data, basicRace) {

    let basicRaceData = Object.values(basicRace).map((row) => ({
        basic_race: row.basic_race,
        participants: row.participants
    }));

    let newBasicRaceData = {};
    data.forEach((row) => {
        Object.keys(row).forEach((key) => {
            if(Object.keys(raceObj).includes(key)){
                newBasicRaceData[key]
                ? newBasicRaceData[key].participants.push(row["ID"])
                : newBasicRaceData[key] = {
                    basic_race: raceObj[key].race,
                    participants: [row["ID"]]
                }    
            }
        });
    });

    const isSameBasicRace = (a,b) => a.basic_race === b.basic_race && a.participants.sort().join(',') === b.participants.sort().join(',');
    let basicRaceDifference = onlyInLeft(Object.values(newBasicRaceData), basicRaceData, isSameBasicRace);

    let newBasicRaceInput = {};
    basicRaceDifference.forEach((row) => {
        toObject(Object.values(basicRace),'basic_race')[row.basic_race]
        ? newBasicRaceInput[toObject(Object.values(basicRace),'basic_race')[row.basic_race].id] = {
            id: toObject(Object.values(basicRace),'basic_race')[row.basic_race].id,
            ...row,
            participants: merge(toObject(Object.values(basicRace),'basic_race')[row.basic_race].participants, row.participants)
        }
        : Object.keys(raceObj).includes(row.basic_race)
            ? newBasicRaceInput[raceObj[row.basic_race].id] = {
                id: raceObj[row.basic_race].id,
                ...row
            } : null
    });

    fs.writeFileSync('jsonData/Race & Ethnicity--Reg Forms.json', 
    JSON.stringify({
        "version": 2,
        "data": {
           "api::basic-race.basic-race": newBasicRaceInput,
        }
    }), 'utf-8');
    return {
        "api::basic-race.basic-race": newBasicRaceInput,
    };
}
module.exports = {
    handleBasicRaceData
}