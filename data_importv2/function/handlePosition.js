const fs = require('fs');
const { onlyInLeft, merge } = require('../utility/utility');

const positionsLookup = {
  'Arts and Humanities Plank': {
    id: 1,
    plank: 'Arts and Humanities Plank'
  },
  'Battered Women Plank': {
    id: 2,
    plank: 'Battered Women Plank'
  },
  'Business Plank': {
    id: 3,
    plank: 'Business Plank'
  },
  'Child Abuse Plank': {
    id: 4,
    plank: 'Child Abuse Plank'
  },
  'Child Care Plank': {
    id: 5,
    plank: 'Child Care Plank'
  },
  'Credit Plank': {
    id: 6,
    plank: 'Credit Plank'
  },
  'Disabled Women Plank': {
    id: 7,
    plank: 'Disabled Women Plank'
  },
  'Education Plank': {
    id: 8,
    plank: 'Education Plank'
  },
  'Elective and Appointive Office Plank': {
    id: 9,
    plank: 'Elective and Appointive Office Plank'
  },
  'Employment Plank': {
    id: 10,
    plank: 'Employment Plank'
  },
  'Equal Rights Amendment Plank': {
    id: 11,
    plank: 'Equal Rights Amendment Plank'
  },
  'Health Plank': {
    id: 12,
    plank: 'Health Plank'
  },
  'Homemakers Plank': {
    id: 13,
    plank: 'Homemakers Plank'
  },
  'Insurance Plank': {
    id: 14,
    plank: 'Insurance Plank'
  },
  'International Affairs Plank': {
    id: 15,
    plank: 'International Affairs Plank'
  },
  'Media Plank': {
    id: 16,
    plank: 'Media Plank'
  },
  'Minority Women Plank': {
    id: 17,
    plank: 'Minority Women Plank'
  },
  'Offenders Plank': {
    id: 18,
    plank: 'Offenders Plank'
  },
  'Older Women Plank': {
    id: 19,
    plank: 'Older Women Plank'
  },
  'Rape Plank': {
    id: 20,
    plank: 'Rape Plank'
  },
  'Reproductive Freedom Plank': {
    id: 21,
    plank: 'Reproductive Freedom Plank'
  },
  'Rural Women Plank': {
    id: 22,
    plank: 'Rural Women Plank'
  },
  'Sexual Preference Plank': {
    id: 23,
    plank: 'Sexual Preference Plank'
  },
  'Statistics Plank': {
    id: 24,
    plank: 'Statistics Plank'
  },
  'Women, Welfare and Poverty Plank': {
    id: 25,
    plank: 'Women, Welfare and Poverty Plank'
  },
  'Committee on the Conference Plank': {
    id: 26,
    plank: 'Committee on the Conference Plank'
  }
}
async function handlePositionData(data, positions){

    let positionData = [];
    Object.values(positions).forEach((position) => {
      positionData.push({
        plank: position.plank,
        participants_for: position.participants_for,
        participants_against: position.participants_against,
        participants_spoke_for: position.participants_spoke_for
      })
    });

    let newPositionData = {};
    data.forEach((row) => {
        Object.keys(row).forEach((key) => {

            row[key] === 'for' ? newPositionData[key] = {
                plank:key,
                participants_for: [...newPositionData[key]?.participants_for || [], row['ID']],
                participants_against: [...newPositionData[key]?.participants_against || []],
                participants_spoke_for: [...newPositionData[key]?.participants_spoke_for || []]
            } : null;

            row[key] === 'against'
            ? newPositionData[key] = {
                plank:key,
                participants_for: [...newPositionData[key]?.participants_for || []],
                participants_against: [...newPositionData[key]?.participants_against || [], row['ID']],
                participants_spoke_for: [...newPositionData[key]?.participants_spoke_for || []]
              } : null;

            row[key] === 'spoke about with position unknown'
            ? newPositionData[key] = {
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
    let positionDiffernce = onlyInLeft(Object.values(newPositionData), positionData, isSamePosition);
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

}
module.exports = {
    handlePositionData
}