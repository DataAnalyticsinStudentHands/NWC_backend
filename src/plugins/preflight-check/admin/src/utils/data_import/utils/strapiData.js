const { removeNullUndefined } = require('./utils.js');
const reg = /^\d+$/;

  function cleanStrapiObject(data, lookup, pk) {
    const obj = {}
    data.forEach((row) => {
        const rowObj = {}
        Object.values(lookup).forEach((value) => {
            rowObj[value] = row[value];
        })
        Object.entries(rowObj).forEach(([key, value]) => {
            if (Array.isArray(value)) return;
            reg.test(value) ? rowObj[key] = parseInt(value) : null;
            value === 'true' ? rowObj[key] = true : null;
            value === 'false' ? rowObj[key] = false : null;
        });
        obj[rowObj[pk]] = removeNullUndefined(rowObj);
    });
    return obj;
  }
function cleanStrapiObjectI(data,lookup, pk) {
	const obj = {};
	data.map((row) => {
		obj[row[pk]] = removeNullUndefined({
			[pk]: row[pk],
      participants: row.participants,
      participants_for: row.participants_for,
      participants_against: row.participants_against,
      participants_spoke_for: row.participants_spoke_for
		});
	});
	return obj;
}

function cleanStrapiArray(data, lookup, pk) {
    const array = data.map((row) => {
        const rowObj = {}
        Object.values(lookup).forEach((value) => {
            // reg.test(row[value]) ? rowObj[value] = parseInt(row[value]) : rowObj[value] = row[value];
            Array.isArray(row[value])
            ? rowObj[value] = row[value]
            : reg.test(row[value])
                ? rowObj[value] = parseInt(row[value])
                : rowObj[value] = row[value];
        })
        return removeNullUndefined(rowObj)
    });
    return array;
  }
  module.exports = {
    cleanStrapiObjectI,
    cleanStrapiObject,
    cleanStrapiArray
  }