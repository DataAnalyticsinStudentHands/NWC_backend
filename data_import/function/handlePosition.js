const fs = require('fs');
const { onlyInLeft, merge } = require('../utility/utility');

const positionsLookup = JSON.parse(fs.readFileSync('../utility/positions.json', 'utf-8'));
const options = {
  for: 'for',
  against: 'against',
  spoke: 'spoke about with position unknown'
}
async function handlePositionData(data, positions){
    const positionData = Object.values(positions).map((position) => ({
        plank: position.plank,
        participants_for: position.participants_for,
        participants_against: position.participants_against,
        participants_spoke_for: position.participants_spoke_for
    }));
    let newPositionData = {};
    data.forEach((row) => {
        Object.keys(row).forEach((key) => {
            row[key] === options.for ? newPositionData[key] = {
                plank:key,
                participants_for: [...newPositionData[key]?.participants_for || [], row['ID']],
                participants_against: [...newPositionData[key]?.participants_against || []],
                participants_spoke_for: [...newPositionData[key]?.participants_spoke_for || []]
            } : null;

            row[key] === options.against ? newPositionData[key] = {
                plank:key,
                participants_for: [...newPositionData[key]?.participants_for || []],
                participants_against: [...newPositionData[key]?.participants_against || [], row['ID']],
                participants_spoke_for: [...newPositionData[key]?.participants_spoke_for || []]
              } : null;

            row[key] === options.spoke ? newPositionData[key] = {
                plank:key,
                participants_for: [...newPositionData[key]?.participants_for || []],
                participants_against: [...newPositionData[key]?.participants_against || []],
                participants_spoke_for: [...newPositionData[key]?.participants_spoke_for || [], row['ID']]
            } : null;
        });
    });

    const isSamePosition = (a, b) => a.plank == b.plank && 
      a.participants_for.sort().join(',') == b.participants_for.sort().join(',') && 
      a.participants_against.sort().join(',') == b.participants_against.sort().join(',') && 
      a.participants_spoke_for.sort().join(',') == b.participants_spoke_for.sort().join(',');
    const positionDiffernce = onlyInLeft(Object.values(newPositionData), positionData, isSamePosition);
    let newPositionInput = {};
    positionDiffernce.forEach((position) => {
      newPositionInput[positionsLookup[position.plank].id] = {
        id: positionsLookup[position.plank].id,
        plank: positionsLookup[position.plank].plank,
        participants_for: merge(position.participants_for, positionData.find((p) => p.plank === position.plank)?.participants_for || []),
        participants_against: merge(position.participants_against, positionData.find((p) => p.plank === position.plank)?.participants_against || []),
        participants_spoke_for: merge(position.participants_spoke_for, positionData.find((p) => p.plank === position.plank)?.participants_spoke_for || [])
      }
    });

    fs.writeFileSync('jsonData/Position on Planks.json', 
    JSON.stringify({
        "version":2,
        "data":{
            "api::nwc-plank.nwc-plank": newPositionInput
        }
    }));

    return {
      "api::nwc-plank.nwc-plank": newPositionInput
    }

}
module.exports = {
    handlePositionData
}