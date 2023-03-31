const fs = require('fs');
const { toObject, onlyInLeft, merge } = require('../utility/utility');

async function handleOrganizationalData(data, organizations){

    let organizationData = [];
    Object.values(organizations).forEach((row) => {
        organizationData.push({
            organizational_and_political: row.organizational_and_political,
            participants: row.participants
        })
    });

    let newOrganizationData = {};    
    data.forEach((row) => {
        Object.keys(row).forEach((key) => {
            if (key === "Name" || key === "ID") return;
            if(row[key] === 'yes'){
                newOrganizationData[key]
                ? newOrganizationData[key].participants.push(row["ID"])
                : newOrganizationData[key] = {
                    organizational_and_political: key,
                    participants: [row["ID"]]
                }
            } 
        })
    })

    const isSameOrganization = ( a , b ) => a.organizational_and_political == b.organizational_and_political && a.participants.sort().join(',') === b.participants.sort().join(',');
    let organizationDifference = onlyInLeft(Object.values(newOrganizationData), organizationData, isSameOrganization);
    let newOrganizationInput = {};
    organizations = toObject(Object.values(organizations), 'organizational_and_political');
    organizationDifference.forEach((row) => {
        organizations[row.organizational_and_political]
        ? newOrganizationInput[row.organizational_and_political] = { 
            id: organizations[row.organizational_and_political].id,
            organizational_and_political: row.organizational_and_political,
            participants: merge(organizations[row.organizational_and_political].participants, row.participants)
        }
        : newOrganizationInput[row.organizational_and_political] = {
            id: Object.keys(organizations).length + 1,
            organizational_and_political: row.organizational_and_political,
            participants: row.participants
        }
    })

    fs.writeFileSync('jsonData/Organizational & Political.json',
    JSON.stringify({
        "version": 2,
        "data": {
            "api::organizational-and-political.organizational-and-political": toObject(Object.values(newOrganizationInput), 'id')
        }
    }))

}
module.exports = {
    handleOrganizationalData
}