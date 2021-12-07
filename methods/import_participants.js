require('dotenv').config()

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const csvtojson = require("csvtojson");
const { endsWith, startsWith } = require('lodash');
const yargs = require('yargs');

const url = process.env.DATABASE_URL //"mongodb://localhost:27017/";
const dbName = process.env.DATABASE_NAME //"nwc";
const collection =  process.env.DATABASE_COLLECTION //"participants";

// Exceute MongoDB function
function ExecuteDB(jsonBulk, logInfo) {
  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) throw err;

      client
        .db(dbName)
        .collection(collection)
        .bulkWrite(jsonBulk, (err, res) => {
          if (err) throw err;

          console.log(`${logInfo}: ${JSON.stringify(res)}`);
          client.close();
        });
    }
  );
};

// basic information
function createBasic() {
  csvtojson()
    .fromFile(process.argv[3] + "/Basic Data.csv")
    .then(csvData => {

      // clean up keys
      let jsonBulk = [];
      for (var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];
        var key, keys = Object.keys(obj);
        var newobj = {}
        for (var n = 0; n < keys.length; n++) {
          key = keys[n];
          // remove instructions (in parantheses)
          newkey = key.replace(/\([^()]*\)/g, '');
          newkey = newkey.replace(/\s+/g, '_').toLowerCase();
          // remove trailing underscore
          if (endsWith(newkey, '_'))
            newkey = newkey.slice(0, -1) //'abcde'
          // remove unknown
          if (obj[key] === "unknown")
            obj[key] = "";
          
          // making sure new objects have the correct type before import
          if(startsWith(newkey, 'age') || startsWith(newkey, 'total') || startsWith(newkey, 'median')) {
            var numberValue = parseInt(obj[key]);
            newobj[newkey] = numberValue;
          } else if (startsWith(newkey, 'longitude') || startsWith(newkey, 'latitude')) {
            var numberValue = parseFloat(obj[key]);
            newobj[newkey] = numberValue;
          // renaming id column to particpant_id key
          } else if (startsWith(newkey, 'ID')) {
            newobj[participant_id] = obj[key]
          } else {
            newobj[newkey] = obj[key];
          }
        }

        // remove Notes
        delete newobj['notes'];

        var bulk = {
          updateOne: {
            filter: { participant_id: obj['ID'] },
            update: { $set: newobj },
            upsert: true
          }
        };
        jsonBulk.push(bulk);
      }

      ExecuteDB(jsonBulk, "Basic");
    });
};

// race/ethnicity
function updateRace() {
  csvtojson()
    .fromFile(process.argv[3] + "/Racial and Ethnic Identifiers.csv")
    .then(csvData => {

      // clean up keys
      let jsonBulk = [];
      for (var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];

        var key, keys = Object.keys(obj);
        var newobj = {}
        for (var n = 0; n < keys.length; n++) {
          key = keys[n];
          // remove instructions (in parantheses)
          newkey = key.replace(/\([^()]*\)/g, '');
          newkey = newkey.replace(/\//g, '');
          newkey = newkey.replace(/\s+/g, '_').toLowerCase();
          // remove trailing underscore
          if (endsWith(newkey, '_'))
            newkey = newkey.slice(0, -1) //'abcde'
          // remove unknown
          if (obj[key] === "unknown")
            obj[key] = "";
          else if (obj[key] === "Yes")
            obj[key] = 1;
          else if (obj[key] === "N/A")
            obj[key] = 0;
        }

        // remove Notes and name as well as particpant ID
        delete newobj['notes'];
        delete newobj['id'];
        delete newobj['name'];

        var bulk = {
          updateOne: {
            filter: { participant_id: obj['ID'] },
            update: { $set: { race: newobj } }
          }
        };

        jsonBulk.push(bulk);
      }

      ExecuteDB(jsonBulk, "Race Ethnicity");
    });
};

//ed and career
function updateEdCareer() {
  csvtojson()
    .fromFile(process.argv[3] + "/Ed & Career.csv")
    .then(csvData => {

      // clean up keys and create array for query
      let jsonBulk = [];
      for (var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];

        var key, keys = Object.keys(obj);
        var newobj = {}
        for (var n = 0; n < keys.length; n++) {
          key = keys[n];
          // remove instructions (in parantheses)
          newkey = key.replace(/\([^()]*\)/g, '');
          // remove colons, single quote, forward slash
          newkey = newkey.replace(/:/g, '');
          newkey = newkey.replace(/'/g, '');
          newkey = newkey.replace(/\//g, '');
          newkey = newkey.replace(/\s+/g, '_').toLowerCase();
          // remove trailing underscore
          if (endsWith(newkey, '_'))
            newkey = newkey.slice(0, -1) //'abcde'
          // remove unknown
          if (obj[key] === "unknown")
            obj[key] = "";

          // making sure new objects have the correct type before import
          if (newkey.includes('year')) {
            var numberValue = parseInt(obj[key]);
            newobj[newkey] = numberValue;
          } else {
            newobj[newkey] = obj[key];
          }
        }

        // remove Notes etc.
        delete newobj['notes'];
        delete newobj['id'];
        delete newobj['name'];

        var bulk = {
          updateOne: {
            filter: { id: obj['ID'] },
            update: { $addToSet: { edc: newobj } }
          }
        }

        jsonBulk.push(bulk);
      }

      ExecuteDB(jsonBulk, "Ed & Career");
    });
};

//electoral politics
function updateElectoralPolitics() {
  csvtojson()
    .fromFile(process.argv[3] + "/Electoral Politics.csv")
    .then(csvData => {

      // clean up keys and create array for query
      let jsonBulk = [];
      for (var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];

        var key, keys = Object.keys(obj);
        var newobj = {}
        for (var n = 0; n < keys.length; n++) {
          key = keys[n];
          // remove instructions (in parantheses)
          newkey = key.replace(/\([^()]*\)/g, '');
          // remove colons, single quote, forward slash
          newkey = newkey.replace(/:/g, '');
          newkey = newkey.replace(/'/g, '');
          newkey = newkey.replace(/\//g, '');
          newkey = newkey.replace(/\s+/g, '_').toLowerCase();
          // remove trailing underscore
          if (endsWith(newkey, '_'))
            newkey = newkey.slice(0, -1) //'abcde'
          // remove unknown
          if (obj[key] === "unknown")
            obj[key] = "";
          // making sure new objects have the correct type before import
          if (newkey.includes('year')) {
            var numberValue = parseInt(obj[key]);
            newobj[newkey] = numberValue;
          } else {
            newobj[newkey] = obj[key];
          }
        }

        // remove Notes
        delete newobj['notes'];
        delete newobj['id'];
        delete newobj['name'];

        var bulk = {
          updateOne: {
            filter: { id: obj['ID'] },
            update: { $addToSet: { poli: newobj } }
          }
        }


        jsonBulk.push(bulk);
      }

      ExecuteDB(jsonBulk, "Electoral Politics");
    });
};

//role at NWC
function updateRoleNWC() {
  csvtojson()
    .fromFile(process.argv[3] + "/Role at NWC.csv")
    .then(csvData => {

      // clean up keys and create array for query
      let jsonBulk = [];
      for (var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];

        var key, keys = Object.keys(obj);
        var newobj = {}
        for (var n = 0; n < keys.length; n++) {
          key = keys[n];
          // remove instructions (in parantheses)
          newkey = key.replace(/\([^()]*\)/g, '');
          // remove colons, single quote, forward slash
          newkey = newkey.replace(/:/g, '');
          newkey = newkey.replace(/'/g, '');
          newkey = newkey.replace(/,/g, '');
          newkey = newkey.replace(/\//g, '');
          newkey = newkey.replace(/\s+/g, '_').toLowerCase();
          // remove trailing underscore
          if (endsWith(newkey, '_'))
            newkey = newkey.slice(0, -1) //'abcde'
          // remove unknown
          if (obj[key] === "unknown")
            obj[key] = "";
          newobj[newkey] = obj[key];
        }

        // remove Notes
        delete newobj['notes'];
        delete newobj['id'];
        delete newobj['name'];

        var bulk = {
          updateOne: {
            filter: { id: obj['ID'] },
            update: { $set: { roles: newobj } }
          }
        };

        jsonBulk.push(bulk);
      }

      ExecuteDB(jsonBulk, "Role at NW");
    });
};

//organizations
function updateLeadership() {
  csvtojson()
    .fromFile(process.argv[3] + "/Leadership in Org.csv")
    .then(csvData => {

      // clean up keys and create array for query
      let jsonBulk = [];
      for (var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];

        var key, keys = Object.keys(obj);
        var newobj = {}
        for (var n = 0; n < keys.length; n++) {
          key = keys[n];
          // remove instructions (in parantheses)
          newkey = key.replace(/\([^()]*\)/g, '');
          // remove colons, single quote, forward slash
          newkey = newkey.replace(/:/g, '');
          newkey = newkey.replace(/'/g, '');
          newkey = newkey.replace(/,/g, '');
          newkey = newkey.replace(/\//g, '');
          newkey = newkey.replace(/\s+/g, '_').toLowerCase();
          // remove trailing underscore
          if (endsWith(newkey, '_'))
            newkey = newkey.slice(0, -1) //'abcde'
          // remove unknown
          if (obj[key] === "unknown")
            obj[key] = "";
          newobj[newkey] = obj[key];
        }

        // remove Notes
        delete newobj['notes'];
        delete newobj['id'];
        delete newobj['name'];

        var bulk = {
          updateOne: {
            filter: { id: obj['ID'] },
            update: { $addToSet: { leadership: newobj } }
          }
        };

        jsonBulk.push(bulk);
      }

      ExecuteDB(jsonBulk, "Leadership");
    });
};

//organizations
function updateOrganizational() {
  csvtojson()
    .fromFile(process.argv[3] + "/Organizational and Political.csv")
    .then(csvData => {

      // clean up keys and create array for query
      let jsonBulk = [];
      for (var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];

        var key, keys = Object.keys(obj);
        var newobj = {}
        for (var n = 0; n < keys.length; n++) {
          key = keys[n];
          // remove colons, single quote, forward slash
          newkey = key.replace(/\(/g, '');
          newkey = newkey.replace(/\)/g, '');
          newkey = newkey.replace(/:/g, '');
          newkey = newkey.replace(/'/g, '');
          newkey = newkey.replace(/,/g, '');
          newkey = newkey.replace(/\//g, '');
          newkey = newkey.replace(/\s+/g, '_').toLowerCase();
          // remove trailing underscore
          if (endsWith(newkey, '_'))
            newkey = newkey.slice(0, -1) //'abcde'
          // remove unknown
          if (obj[key] == "yes")
            newobj[newkey] = obj[key];
        }

        // remove Notes
        delete newobj['notes'];
        delete newobj['id'];
        delete newobj['name'];

        var bulk = {
          updateOne: {
            filter: { id: obj['ID'] },
            update: { $set: { orgs: newobj } }
          }
        };

        jsonBulk.push(bulk);
      }

      ExecuteDB(jsonBulk, "Organizations");
    });
};

//sources
function updateSources() {
  csvtojson()
    .fromFile(process.argv[3] + "/Sources.csv")
    .then(csvData => {

      // clean up keys and create array for query
      let jsonBulk = [];
      for (var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];

        var key, keys = Object.keys(obj);
        var newobj = {}
        for (var n = 0; n < keys.length; n++) {
          key = keys[n];
          // remove instructions (in parantheses)
          newkey = key.replace(/\([^()]*\)/g, '');
          // remove colons, single quote, forward slash
          newkey = newkey.replace(/:/g, '');
          newkey = newkey.replace(/'/g, '');
          newkey = newkey.replace(/,/g, '');
          newkey = newkey.replace(/\//g, '');
          newkey = newkey.replace(/\s+/g, '_').toLowerCase();
          // remove trailing underscore
          if (endsWith(newkey, '_'))
            newkey = newkey.slice(0, -1) //'abcde'
          // remove unknown
          if (obj[key] === "unknown")
            obj[key] = "";
          newobj[newkey] = obj[key];
        }

        // remove Notes
        delete newobj['notes'];
        delete newobj['id'];
        delete newobj['name'];

        var bulk = {
          updateOne: {
            filter: { id: obj['ID'] },
            update: { $set: { sources: newobj } }
          }
        };

        jsonBulk.push(bulk);
      }

      ExecuteDB(jsonBulk, "Sources");
    });
};

const argv = yargs
  .option('directory', {
    alias: 'd',
    description: 'Directory to read files to be merged/imported',
    type: 'string',
    demand: true,
    demand: 'directory is required',
  })
  .option('basic', {
    alias: 'b',
    description: 'Insert/Update new particpants',
    type: 'boolean',
  })
  .option('race', {
    alias: 'a',
    description: 'Insert/Update race/ethnicity',
    type: 'boolean',
  })
  .option('ed', {
    alias: 'e',
    description: 'Insert/Update ed & career',
    type: 'boolean',
  })
  .option('politics', {
    alias: 'p',
    description: 'Insert/Update electoral politics',
    type: 'boolean',
  })
  .option('roles', {
    alias: 'r',
    description: 'Insert/Update roles at NWC',
    type: 'boolean',
  })
  .option('leadership', {
    alias: 'l',
    description: 'Insert/Update Leadership in Voluntary Organizations',
    type: 'boolean',
  })
  .option('organizations', {
    alias: 'o',
    description: 'Insert/Update organizational & political',
    type: 'boolean',
  })
  .option('sources', {
    alias: 's',
    description: 'Insert/Update sources',
    type: 'boolean',
  })
  .help()
  .alias('help', 'h')
  .argv;

if (argv.b) {
  createBasic();
}
if (argv.a) {
  updateRace();
}
if (argv.e) {
  updateEdCareer();
}
if (argv.p) {
  updateElectoralPolitics();
}
if (argv.r) {
  updateRoleNWC();
}
if (argv.l) {
  updateLeadership();
}
if (argv.o) {
  updateOrganizational();
}
if (argv.s) {
  updateSources();
}