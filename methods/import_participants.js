const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const csvtojson = require("csvtojson");
const { endsWith } = require('lodash');
const yargs = require('yargs');

const url = "mongodb://localhost:27017/";
const dbName = "nwc";
const collection = "participants";

// basic information
function createBasic() {
  csvtojson()
  .fromFile("../data/sample/Basic Data.csv")
  .then(csvData => {
    
    // clean up keys
    let jsonBulk = [];
    for(var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];
    
        var key, keys = Object.keys(obj);
        var newobj={}
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
            newobj[newkey] = obj[key];
        }
        var bulk = {
          updateOne: {
            filter: { id: obj['ID'] },
            update: { $set: newobj },
            upsert: true 
          }
        };
        // remove Notes
        delete newobj['notes'];

        jsonBulk.push(bulk);
    }

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

            console.log(`Basic: ${JSON.stringify(res)}`);
            client.close();
          });
      }
    ); 
  });
};

// race/ethnicity
function updateRace() {
  csvtojson()
  .fromFile("../data/sample/Racial and Ethnic Identifiers.csv")
  .then(csvData => {
    
    // clean up keys
    let jsonBulk = [];
    for(var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];
    
        var key, keys = Object.keys(obj);
        var newobj={}
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
            console.log(obj[key]);
            if (obj[key] === "unknown")
                obj[key] = "";
            else if (obj[key] === "Yes")
                obj[key] = 1;
            else if (obj[key] === "N/A")
                obj[key] = 0;
            newobj[newkey] = obj[key];
        }
        var bulk = {
          updateOne: {
            filter: { id: obj['ID'] },
            update: { $set: { race: newobj }}
          }
        };
        // remove Notes
        delete newobj['notes'];
        delete newobj['id'];
        delete newobj['name'];

        jsonBulk.push(bulk);
    }

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

            console.log(`Race Ethnicity: ${JSON.stringify(res)}`);
            client.close();
          });
      }
    ); 
  });
};

//ed and career
function updateEdCareer() {
  csvtojson()
    .fromFile("../data/sample/Ed & Career.csv")
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
          newobj[newkey] = obj[key];
        }

        // remove Notes etc.
        delete newobj['notes'];
        delete newobj['id'];
        delete newobj['name'];

        var bulk = {
          updateOne: {
            filter: { id: obj['ID'] },
            update: { $set: {edc: newobj} }
          }
        }

        jsonBulk.push(bulk);
      }

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

              console.log(`Ed & Career: ${JSON.stringify(res)}`);
              client.close();
            });
        }
      );
    });
};

  //electoral politics
function updateElectoralPolitics() {
  csvtojson()
  .fromFile("../data/sample/Electoral Politics.csv")
  .then(csvData => {
    
    // clean up keys and create array for query
    let jsonBulk = [];
    for(var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];
        
        var key, keys = Object.keys(obj);
        var newobj={}
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
            newobj[newkey] = obj[key];
        }

        // remove Notes
        delete newobj['notes'];
        delete newobj['id'];
        delete newobj['name'];

        var bulk = {
          updateOne: {
            filter: {id: obj['ID']},
            update: {$set: { poli: newobj }}
          }
        }

        
        jsonBulk.push(bulk);
    }

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

            console.log(`Electoral Politics: ${JSON.stringify(res)}`);
            client.close();
          });
      }
    );
  });
};

//role at NWC
function updateRoleNWC() {
  csvtojson()
  .fromFile("../data/sample/Role at NWC.csv")
  .then(csvData => {
    
    // clean up keys and create array for query
    let jsonBulk = [];
    for(var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];
        
        var key, keys = Object.keys(obj);
        var newobj={}
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
            filter: {id: obj['ID']},
            update: {$set: {roles: newobj}}
          }
        };
        
        jsonBulk.push(bulk);
    }

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

            console.log(`Role at NWC: ${JSON.stringify(res)}`);
            client.close();
          });
      }
    );
  });
};

//sources
function updateSources() {
  csvtojson()
  .fromFile("../data/sample/Sources.csv")
  .then(csvData => {
    
    // clean up keys and create array for query
    let jsonBulk = [];
    for(var i = 0; i < csvData.length; i++) {
        var obj = csvData[i];
        
        var key, keys = Object.keys(obj);
        var newobj={}
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
            filter: {id: obj['ID']},
            update: {$set: {sources: newobj}}
          }
        };
        
        jsonBulk.push(bulk);
    }

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

            console.log(`Sources: ${JSON.stringify(res)}`);
            client.close();
          });
      }
    );
  });
};

const argv = yargs
  .option('basic', {
    alias: 'b',
    description: 'Insert/Update new particpants',
    type: 'boolean',
  })
  .option('ed', {
    alias: 'e',
    description: 'Insert/Update ed & career',
    type: 'boolean',
  })
  .option('race', {
    alias: 'a',
    description: 'Insert/Update race/ethnicity',
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
if (argv.e) {
  updateEdCareer();
}
if (argv.a) {
  updateRace();
}
if (argv.p) {
  updateElectoralPolitics();
}
if (argv.r) {
  updateRoleNWC();
}
if (argv.s) {
  updateSources();
}