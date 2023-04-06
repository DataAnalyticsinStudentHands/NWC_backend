const toObject = (arr, key) => arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {});
const getUniqueListBy = (arr, key) => [...new Map(arr.map((item) => [item[key], item])).values()];
const groupBy = (arr, key) => arr.reduce((acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc), {});
const pluck = (objs, property) => objs.map((obj) => obj[property]);
const merge = (a, b) => [...new Set(a.concat(b))];
const removeNullUndefined = (obj) => Object.entries(obj).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
const onlyInLeft = (left, right, compareFunction) => 
left.filter(leftValue =>
  !right.some(rightValue => 
	compareFunction(leftValue, rightValue)));

module.exports = {
    toObject,
    getUniqueListBy,
    groupBy,
    pluck,
    merge,
    removeNullUndefined,
    onlyInLeft
}