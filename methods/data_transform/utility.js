// Convert an array of objects to a single object with the key as the value of the key passed as the second argument
const toObject = (arr, key) => arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {});
// toObject(
// 	[
// 		{ id: 1, name: "John", age: 20 },
// 		{ id: 2, name: "Jane", age: 24 },
// 		{ id: 3, name: "Jack", age: 30 },
// 	], 
//  'id'
// )
// 					Transfer To
// {
// 	"1": { id: '1', name: "John", age: 20 },
// 	"2": { id: '2', name: "Jane", age: 24 },
// 	"3": { id: '3', name: "Jack", age: 30 }
// }

// Get unique values from an array of objects
function getUniqueListBy(arr, key) {
	return [...new Map(arr.map((item) => [item[key], item])).values()];
}

// Group an array of objects by a key
const groupBy = (arr, key) => arr.reduce((acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc), {});
// groupBy(
//     [
//         { branch: 'audi', model: 'q8', year: '2019' },
//         { branch: 'audi', model: 'rs7', year: '2020' },
//         { branch: 'ford', model: 'mustang', year: '2019' },
//         { branch: 'ford', model: 'explorer', year: '2020' },
//         { branch: 'bmw', model: 'x7', year: '2020' },
//     ],
//     'branch'
// );
// 					Transfer To
// {
//     audi: [
//         { branch: 'audi', model: 'q8', year: '2019' },
//         { branch: 'audi', model: 'rs7', year: '2020' }
//     ],
//     bmw: [
//         { branch: 'bmw', model: 'x7', year: '2020' }
//     ],
//     ford: [
//         { branch: 'ford', model: 'mustang', year: '2019' },
//         { branch: 'ford', model: 'explorer', year: '2020' }
//     ],
// }


// Extract values of a property from an array of objects
const pluck = (objs, property) => objs.map((obj) => obj[property]);
// pluck(
//     [
//         { name: 'John', age: 20 },
//         { name: 'Smith', age: 25 },
//         { name: 'Peter', age: 30 },
//     ],
//     'name'
// ); 
// 					Transfer To
// ['John', 'Smith', 'Peter']

// Merge and remove the duplications
const merge = (a, b) => [...new Set(a.concat(b))];
// merge([1, 2, 3], [2, 3, 4])
// 					Transfer To
// [1, 2, 3, 4]

// Remove null and undefined values from an object
const removeNullUndefined = (obj) => Object.entries(obj).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
// removeNullUndefined({ a: 1, b: null, c: undefined, d: 2 })
// 					Transfer To
// { a: 1, d: 2 }

function handleAPI(data,participantsData, attribute, apiName){
	let obj = {};	let newObj = {};
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
	obj = Object.assign(obj, participantsData.data[`${apiName}`]);
	Object.values(obj).forEach((e) => {
		if(newObj[e[attribute]]){
			merge(newObj[e[attribute]].participants, e.participants)
		} else {
			e.id ? null : e.id = Object.keys(newObj).length+1
			newObj[e[attribute]] = e
		}
	})
	participantsData.data[`${apiName}`] = toObject(Object.values(newObj), 'id')
	return participantsData
}

function handleComponent(data,participantsData, apiName){
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