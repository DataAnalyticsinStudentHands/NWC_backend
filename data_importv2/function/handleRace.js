
const fs = require('fs');
const { toObject, onlyInLeft, merge } = require('../utility/utility');

const raceObj = {
    Arab: { id: 1, race: 'Arab'},
    Israeli: { id: 2, race: 'Israeli'},
    Cambodian: { id: 3, race: 'Cambodian'},
    Chinese: { id: 4, race: 'Chinese'},
    Filipino: { id: 5, race: 'Filipino'},
    Indian: { id: 6, race: 'Indian'},
    Japanese: { id: 7, race: 'Japanese'},
    Korean: { id: 8, race: 'Korean'},
    Malaysian: { id: 9, race: 'Malaysian'},
    'Native Hawaiian': { id: 10, race: 'Native Hawaiian'},
    'Pacific Islander': { id: 11, race: 'Pacific Islander'},
    Pakistani: { id: 12, race: 'Pakistani'},
    Polynesian: { id: 13, race: 'Polynesian'},
    'South Asian': { id: 14, race: 'South Asian'},
    Thai: { id: 15, race: 'Thai'},
    Vietnamese: { id: 16, race: 'Vietnamese'},
    African: { id: 17, race: 'African'},
    'African American': { id: 18, race: 'African American'},
    'Afro-Caribbean': { id: 19, race: 'Afro-Caribbean'},
    'Afro-Latina/Latino': { id: 20, race: 'Afro-Latina/Latino'},
    Black: { id: 21, race: 'Black'},
    'Chicana/Chicano': { id: 22, race: 'Chicana/Chicano'},
    Cuban: { id: 23, race: 'Cuban'},
    'Latina/Latino': { id: 24, race: 'Latina/Latino'},
    Latinx: { id: 25, race: 'Latinx'},
    Mexican: { id: 26, race: 'Mexican'},
    'Mexican American': { id: 27, race: 'Mexican American'},
    'Other Hispanic': { id: 28, race: 'Other Hispanic'},
    'Puerto Rican': { id: 29, race: 'Puerto Rican'},
    'Spanish/Hispanic': { id: 30, race: 'Spanish/Hispanic'},
    'Alaska Native': { id: 31, race: 'Alaska Native'},
    'First Nations': { id: 32, race: 'First Nations'},
    Indigenous: { id: 33, race: 'Indigenous'},
    'Native American/American Indian': { id: 34, race: 'Native American/American Indian'},
    Albanian: { id: 35, race: 'Albanian'},
    Czech: { id: 36, race: 'Czech'},
    Dutch: { id: 37, race: 'Dutch'},
    English: { id: 38, race: 'English'},
    French: { id: 39, race: 'French'},
    German: { id: 40, race: 'German'},
    Greek: { id: 41, race: 'Greek'},
    Hungarian: { id: 42, race: 'Hungarian'},
    Irish: { id: 43, race: 'Irish'},
    Italian: { id: 44, race: 'Italian'},
    Jewish: { id: 45, race: 'Jewish'},
    Polish: { id: 46, race: 'Polish'},
    Portugese: { id: 47, race: 'Portugese'},
    Russian: { id: 48, race: 'Russian'},
    Ruthenian: { id: 49, race: 'Ruthenian'},
    Scotch: { id: 50, race: 'Scotch'},
    Slavic: { id: 51, race: 'Slavic'},
    Spanish: { id: 52, race: 'Spanish'},
    Ukranian: { id: 53, race: 'Ukranian'},
    Welch: { id: 54, race: 'Welch'},
    White: { id: 55, race: 'White'} // Must fix 'white' in the xlsx file
  }

async function handleRaceData(data, races){

    let raceData = [];
    Object.values(races).forEach((row)=>{
        raceData.push({
            race: row.race,
            participants: row.participants
        })
    })

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