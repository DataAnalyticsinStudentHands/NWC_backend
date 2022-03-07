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
          
          // making sure new objects have the correct type before import
          if(startsWith(newkey, 'age') || startsWith(newkey, 'total') || startsWith(newkey, 'median')) {
            var numberValue = parseInt(obj[key]);
            if (!Number.isNaN(numberValue))
              newobj[newkey] = numberValue;
            else
              newobj[newkey] = obj[key]; 
          } else if (startsWith(newkey, 'longitude') || startsWith(newkey, 'latitude')) {
            var numberValue = parseFloat(obj[key]);
            newobj[newkey] = numberValue;
          // renaming id column to particpant_id key
          } else if (startsWith(newkey, 'id')) {
            newobj['participant_id'] = obj[key]
          // convert religion to lower case and one word only (as listed in enumeration)
          } else if (startsWith(newkey, 'religion')) {
            newobj[newkey] = (obj[key].replace(/\s+/g, '_').toLowerCase()).split('_')[0];       
          // remove Notes
          } else if (startsWith(newkey, 'notes') || startsWith(newkey, '...')) {
            
          } else {
            newobj[newkey] = obj[key];
          }
        }

        // add note about where data is coming from from mapping file
        newobj['import_note'] = process.argv[5];

        //convert lat/long into geospatial data type
        newobj['location_of_residence_in1977'] = { type: "Point", coordinates: [ newobj['longitude_of_residence_in_1977'], newobj['latitude_of_residence_in_1977'] ] };

        // remove Notes, id and first/last name
        delete newobj['latitude_of_residence_in_1977'];
        delete newobj['longitude_of_residence_in_1977'];

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

      //lookup table for basic race
      let lookup = {
        "white": mongodb.ObjectID("621cf611ced4cb1cddcc5edd"),
        "asian_americanpacific_islander": mongodb.ObjectID("621cf64c1d48960351dafaf4"),
        "black": mongodb.ObjectID("621cf6521d48960351dafaf5"),
        "hispanic": mongodb.ObjectID("621cf6551d48960351dafaf6"),
        "native_americanamerican_indian": mongodb.ObjectID("621cf6571d48960351dafaf7"),
      }

      // clean up keys
      let jsonBulk = [];
      for (var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];

        var key, keys = Object.keys(obj);
        var nwcRacesObj = [];
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
          // make into binary
          if (obj[key] === "unknown")
            obj[key] = "";
          else if (obj[key] === "Yes")
            obj[key] = 1;
          else if (obj[key] === "N/A")
            obj[key] = 0;

          // remove Notes
          if(startsWith(newkey, 'notes') || startsWith(newkey, '...')) {
          } else {
              if (obj[key] === 1) {
                let result =  lookup[newkey];
                nwcRacesObj.push(result);
              }
            }
        }

        var bulk = {
          updateOne: {
            filter: { participant_id: obj['ID'] },
            update: { $set: { nwc_races: nwcRacesObj } }
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
        var highestLevel
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
          // storing higest level of eduction in separate field
          } else if(startsWith(newkey, 'highest') & obj[key] !== "NA") {
            highestLevel = obj[key].replace(/\//g, '_');
            highestLevel = highestLevel.replace(/\s+/g, '_').toLowerCase();
          // remove Notes
          } else if(startsWith(newkey, 'notes') || startsWith(newkey, '...')) {
           
          } else {
            newobj[newkey] = obj[key];
          }
        }

        // remove original id column etc.
        delete newobj['id'];
        delete newobj['name'];

        var bulk = {
          updateOne: {
            filter: { participant_id: obj['ID'] },
            update: { $addToSet: { edc: newobj },
                      $set: {highest_level_education: highestLevel} }
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
        var partyObj
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

          // making sure new objects have the correct type before import
          if (newkey.includes('year')) {
            var numberValue = parseInt(obj[key]);
            newobj[newkey] = numberValue;
          // remove Notes
          } else if (startsWith(newkey, 'notes') || startsWith(newkey, '...')) {
          //encode political party separately
          } else if (startsWith(newkey, 'political_party') && obj[key] !== "NA") {
            partyObj = (obj[key].replace(/\s+/g, '_').toLowerCase()).split('_')[0]; 
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
            filter: { participant_id: obj['ID'] },
            update: { $addToSet: { poli: newobj }, 
                      $set: {political_party: partyObj} }
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

      //lookup table for roles
      let lookup = {
        "delegate_at_the_nwc": mongodb.ObjectID("6216879c5c79fee91893b9a6"),
        "ford_national_commissioner": mongodb.ObjectID("62168f8e32e34deb93dc3421"),
        "carter_national_commissioner": mongodb.ObjectID("62169094a14631ec129ca7a5"),
        "international_dignitary": mongodb.ObjectID("6216a00792a101f2d552b8b4"),
        "torch_relay_runner": mongodb.ObjectID("6216a02fa75a14636f3dcc74"),
        "alternate_at_the_nwc": mongodb.ObjectID("6216a03aa75a14636f3dcc76"),
        "delegate_at_large": mongodb.ObjectID("6216a043a75a14636f3dcc77"),
        "official_observer": mongodb.ObjectID("6216b309a75a14636f3dcc8c"),
        "volunteer": mongodb.ObjectID("6216b30ca75a14636f3dcc8d"),
        "paid_staff_member": mongodb.ObjectID("6216b30ea75a14636f3dcc8e"),
        "notable_speaker": mongodb.ObjectID("6216b310a75a14636f3dcc8f"),
        "unofficial_observer": mongodb.ObjectID("6216b312a75a14636f3dcc90"),
        "journalists_covering_the_nwc": mongodb.ObjectID("6216b314a75a14636f3dcc91"),
        "state_delegation_chair": mongodb.ObjectID("6216b316a75a14636f3dcc92"),
        "exhibitor": mongodb.ObjectID("6216b320a75a14636f3dcc94"),
      }

      // clean up keys and create array for query
      let jsonBulk = [];
      for (var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];

        var key, keys = Object.keys(obj);
        var otherRole;
        var plankObj = {};
        var nwcRolesObj = [];
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
          // make into binary
          if (obj[key] === "unknown")
            obj[key] = NaN;
          else if (obj[key] === "yes")
            obj[key] = 1;
          else if (obj[key] === "no")
            obj[key] = 0;
          else if (obj[key] === "for")
            obj[key] = 1;
          else if (obj[key] === "against")
            obj[key] = 0;
          else if (obj[key] === "no known involvement")
            obj[key] = NaN;
          
          // remove Notes
          if(startsWith(newkey, 'notes') || startsWith(newkey, '...')) {
          } else if (!newkey.includes('plank')) { //slit into roles and plank issues
            //filter roles and represent as ObjectIDs
            if (startsWith(newkey, 'other'))
              otherRole = obj[key];
            else {
              if (obj[key] === 1) {
                let result =  lookup[newkey];
                nwcRolesObj.push(result);
              }
            }
          } else {
            plankObj[newkey] = obj[key];
          }
        }

        var bulk = {
          updateOne: {
            filter: { participant_id: obj['ID'] },
            update: { $set: { nwc_roles: nwcRolesObj, planks: plankObj, otherRole: otherRole } }
          }
        };

        jsonBulk.push(bulk);
      }

      ExecuteDB(jsonBulk, "Role at NW");
    });
};

//leadership
function updateLeadership() {
  csvtojson()
    .fromFile(process.argv[3] + "/Leadership in Org.csv")
    .then(csvData => {

      // clean up keys and create array for query
      let jsonBulk = [];
      for (var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];

        var key, keys = Object.keys(obj);
        var newobj;
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
          // keep only info
          if (key === "ID" || key === "First Name" || key === "Last Name" || key === "Name" || startsWith(newkey, 'notes') || startsWith(newkey, '...') || obj[key] === "unknown"){
          } else
            newobj  = obj[key];
        }

        var bulk = {
          updateOne: {
            filter: { participant_id: obj['ID'] },
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

        // remove Notes etc.
        delete newobj['notes'];
        delete newobj['id'];
        delete newobj['name'];

        var bulk = {
          updateOne: {
            filter: { participant_id: obj['ID'] },
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
            filter: { participant_id: obj['ID'] },
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
  .option('note', {
    alias: 'd',
    description: 'Note to be used for teh records',
    type: 'string',
    demand: true,
    demand: 'note is required',
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