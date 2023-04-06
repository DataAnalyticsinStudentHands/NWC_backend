
const fs = require('fs');
const { toObject, onlyInLeft, merge } = require('../utility/utility');

const raceObj = JSON.parse(fs.readFileSync('../utility/race.json', 'utf-8'));

async function handleRaceData(data, races){

    const raceData = Object.values(races).map(({race, participants}) => ({race, participants}));

    let newRaceData = {};
    data.forEach((row) => {
        Object.keys(row).forEach((key) => {
            if (Object.keys(raceObj).includes(key)){
                newRaceData[key]
                ? newRaceData[key].participants.push(row['ID'])
                : newRaceData[key] = {
                    race: raceObj[key].race,
                    participants: [row['ID']]
                }
            }
        })
    });

    const isSameRace = (a,b) => a.race === b.race && a.participants.sort().join(',') === b.participants.sort().join(',');
    // let raceDifference = Object.values(newRaceData).filter((row) => !raceData.some((r) => isSameRace(row,r)));
    let raceDifference = onlyInLeft( Object.values(newRaceData), raceData, isSameRace);
    let newRaceInput = {};
    raceDifference.forEach((row) => {
        toObject(Object.values(races), 'race')[row.race]
        ? newRaceInput[toObject(Object.values(races), 'race')[row.race].id] = {
            id: toObject(Object.values(races), 'race')[row.race].id,
            race : row.race,
            participants: merge(toObject(Object.values(races), 'race')[row.race].participants, row.participants)
        }
        : Object.keys(raceObj).includes(row.race)
            ? newRaceInput[raceObj[row.race].id] = {
                id: raceObj[row.race].id,
                ... row
            } : null
    });

    fs.writeFileSync('jsonData/Race & Ethnicity--Expanded.json', JSON.stringify({
        "version": 2,
        "data": {
            "api::race.race": newRaceInput
        }
    }), 'utf-8');

    return {
        "api::race.race": newRaceInput
    };

}
module.exports = {
    handleRaceData
}