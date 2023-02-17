const toObject = (arr, key) => arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {});

function getUniqueListBy(arr, key) {
	return [...new Map(arr.map((item) => [item[key], item])).values()];
}

const groupBy = (arr, key) => arr.reduce((acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc), {});

const pluck = (objs, property) => objs.map((obj) => obj[property]);

const merge = (a, b) => [...new Set(a.concat(b))];
const removeNullUndefined = (obj) => Object.entries(obj).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});

function handleAPI(data,participantsData, attribute, apiName){
	let obj = {}, newObj = {};
	// Save new data to obj, use attribute instead of id as key. So we can remove duplicates
	Object.values(data).forEach((e) => {
		e.participants = []
		if(obj[e[attribute]]){
			obj[e[attribute]].participants.push(e.participant_id)
		}else{
			obj[e[attribute]]= e
			obj[e[attribute]].participants.push(e.participant_id)
			delete obj[e[attribute]].participant_id
		}
	})
	// Merge new data with old data
	obj = Object.assign(obj, participantsData.data[`${apiName}`]);
	// Save new data to newObj
	Object.values(obj).forEach((e) => {
		if(newObj[e[attribute]]){
			// Merge participants, remove duplicates
			merge(newObj[e[attribute]].participants, e.participants)
		} else {
			// if not exist, create new and give id
			e.id ? null : e.id = Object.keys(newObj).length+1
			newObj[e[attribute]] = e
		}
	})
	participantsData.data[`${apiName}`] = toObject(Object.values(newObj), 'id')
	return participantsData
}


function handleComponent(data,participantsData, apiName){
	// Push Component data to API 
    let component_data = []
	Object.values(participantsData.data[`${apiName}`]).forEach((e) => {delete e.id;component_data.push(e)})
    data = merge(data, component_data)
    data.forEach((e, i) => {e? e[`id`] = i+1 : null})
	participantsData.data[`${apiName}`] = toObject(Object.values(data), 'id')
    return participantsData
}
function pushComonent(data, participantsData, attribute){
    data.forEach((e) => {
		participantsData.data["api::nwc-participant.nwc-participant"][`${e.participant_id}`][`${attribute}`].includes(e.id) 
		? null 
		: participantsData.data["api::nwc-participant.nwc-participant"][`${e.participant_id}`][`${attribute}`].push(e.id)
    })
    return participantsData

}

module.exports = {
    handleAPI,
    handleComponent,
    pushComonent,
    toObject,
    getUniqueListBy,
    groupBy,
    pluck,
    merge,
	removeNullUndefined
}