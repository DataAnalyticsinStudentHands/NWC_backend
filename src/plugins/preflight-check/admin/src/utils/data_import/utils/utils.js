const toObject = (arr, key) =>
	arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {});

const getUniqueListBy = (arr, key) => [
	...new Map(arr.map((item) => [item[key], item])).values(),
];

const groupBy = (arr, key) =>
	arr.reduce(
		(acc, item) => (
			(acc[item[key]] = [...(acc[item[key]] || []), item]), acc
		),
		{}
	);
const pluck = (objs, property) => objs.map((obj) => obj[property]);

const merge = (a, b) => [...new Set(a.concat(b))];

const removeNullUndefined = (obj) => Object.entries(obj).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)),{});

const difference = (left, right, compare) =>
	left.filter((l) => 
		!right.some((r) => 
			compare(l, r)
		)
	);

function signId(diff, strapiData, lookup, pk){
	const newObj = {};
	const maxId = Math.max(...Object.keys(strapiData).map(Number));

    diff.forEach((item, index) => {
		const obj = toObject(Object.values(strapiData), pk)[item[pk]]
		obj ? Object.values(lookup).forEach((key) => {
			Array.isArray(obj[key]) ? newObj[obj.id] = {
				id: obj.id,
				...newObj[obj.id],
				[key]: merge(obj[key], item[key])
			} : newObj[obj.id] = removeNullUndefined({
				id: obj.id,
				...newObj[obj.id],
				[key]: item[key]
			})
		}): newObj[maxId +1 + index] = {
			id: maxId +1 + index,
			...item
		}
    });
	return newObj;
}



module.exports = {
	toObject,
	getUniqueListBy,
	groupBy,
	pluck,
	merge,
	removeNullUndefined,
	difference,
	signId
};
