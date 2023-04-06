const fs = require('fs');
const { onlyInLeft } = require('../utility/utility');

const leadershipLookup = JSON.parse(fs.readFileSync('../utility/leadership.json', 'utf-8'));
async function handleLeadershipData(data, leaderships){

    const leadershipsData = Object.values(leaderships).map(row => ({
        role: row.role,
        specific_role: row.specific_role,
        organization: row.organization,
        participant: row.participant
    }));
 
    const newLeadershipData = data.map(row => {
        let leadershipObj = {};
        Object.keys(row).forEach(key => {
            leadershipLookup[key] ? leadershipObj[leadershipLookup[key]] = row[key] : null;
        });
        return leadershipObj;
    }).filter(obj => Object.keys(obj).length > 1);
    
    const isSameLeadership = (a, b) => a.participant === b.participant && a.role === b.role && a.specific_role === b.specific_role && a.organization === b.organization;
    const leadershipDifference = onlyInLeft(newLeadershipData, leadershipsData, isSameLeadership);
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