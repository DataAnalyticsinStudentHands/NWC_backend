const fs = require('fs');
const { onlyInLeft } = require('../utility/utility');
const leadershipLookup = {
    'ID':'participant',
    'General Name of Leadership Position:  Use Dropdown Menu (create separate row for each leadership position)': 'role',
    'Specific Name of Leadership Position  (create separate row for each leadership position)': 'specific_role',
    'Name of Organization in which leadership position was held ': 'organization',
  }

async function handleLeadershipData(data, leaderships){

    let leadershipsData = [];
    Object.values(leaderships).forEach((row) => {
        leadershipsData.push({
            role: row.role,
            specific_role: row.specific_role,
            organization: row.organization,
            participant: row.participant
        })
    });

    let newLeadershipData = [];
    data.forEach((row) => {
        let leadershipObj = {};
        Object.keys(row).forEach((key) => {
            leadershipLookup[key] ? leadershipObj[leadershipLookup[key]] = row[key] : null;
        });

        Object.keys(leadershipObj).length > 1 ? newLeadershipData.push(leadershipObj) : null;
    })
    
    const isSameLeadership = (a, b) => a.participant === b.participant && a.role === b.role && a.specific_role === b.specific_role && a.organization === b.organization;
    let leadershipDifference = onlyInLeft(newLeadershipData, leadershipsData, isSameLeadership);
    let newLeadershipInput = {};
    leadershipDifference.forEach((row, index) => {
        newLeadershipInput[Object.keys(leaderships).length + 1 + index] = {id: Object.keys(leaderships).length + 1 + index,...row};
    });

    fs.writeFileSync('jsonData/Leadership in Org.json', 
    JSON.stringify({
        "version": 2,
        "data": {
           "api::data-leadership-in-organization.data-leadership-in-organization": newLeadershipInput,
        }
    }), 'utf-8');

    return {
        "api::data-leadership-in-organization.data-leadership-in-organization": newLeadershipInput,
    }
}
module.exports = {
    handleLeadershipData
}