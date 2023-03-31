const fs = require('fs');
const { toObject, onlyInLeft, merge } = require('../utility/utility');

async function handleNWCRoleData(data, participants, roles){

    let roleData = [], participantData = [];
    Object.values(roles).forEach((row) => {
        roleData.push({
            role: row.role,
            participants: row.participants
        })
    });
    Object.values(participants).forEach((row) => {
        participantData.push({
            id: row.id,
            votes_received_at_state_meeting_for_nwc_delegate_alternate: row.votes_received_at_state_meeting_for_nwc_delegate_alternate
        })
    });

    let newRoleData = {}, newParticipantData = [];
    data.forEach((row) => {
        let roleObj = {};
        Object.keys(row).forEach((key) => {
            if (key === "Name" || key === "ID") return;
            if (key === "Votes Received at State Meeting for NWC Delegate/Alternate"){
                newParticipantData.push({
                    id: row["ID"],
                    votes_received_at_state_meeting_for_nwc_delegate_alternate: row[key]
                })
            }
            if(row[key] === 'yes'){
                newRoleData[key]
                ? newRoleData[key].participants.push(row["ID"])
                : newRoleData[key] = {
                    role: key,
                    participants: [row["ID"]]
                }
            } 
        })
        
    })

    const isSameParticipant = ( a , b ) => a.id == b.id && 
        a.votes_received_at_state_meeting_for_nwc_delegate_alternate == b.votes_received_at_state_meeting_for_nwc_delegate_alternate;
    let participantDifference = onlyInLeft(newParticipantData, participantData, isSameParticipant);

    const isSameRole = ( a , b ) => a.role == b.role && a.participants.sort().join(',') === b.participants.sort().join(',');
    let roleDifference = onlyInLeft(Object.values(newRoleData), roleData, isSameRole);
    let newRoleInput = {};
    roleDifference.forEach((row, index) => {
        toObject(Object.values(roles), 'role')[row.role]
        ? newRoleInput[toObject(Object.values(roles), 'role')[row.role].id] = {
            id: toObject(Object.values(roles), 'role')[row.role].id,
            role: row.role,
            participants: merge(toObject(Object.values(roles), 'role')[row.role].participants, row.participants)
        }
        : newRoleInput[Object.keys(roles).length + 1 + index] = {
            id: Object.keys(roles).length + 1 + index,
            role: row.role,
            participants: row.participants
        }
    });

    fs.writeFileSync('jsonData/Role at NWC.json',
    JSON.stringify({
        "version": 2,
        "data": {
            "api::nwc-participant.nwc-participant": toObject(participantDifference, 'id'),
            "api::nwc-role.nwc-role": newRoleInput
        }
    }))
    
}
module.exports = {
    handleNWCRoleData
}