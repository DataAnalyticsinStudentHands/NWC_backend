const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const csvtojson = require("csvtojson");
const { endsWith } = require('lodash');

const url = "mongodb://localhost:27017/";
const dbName = "nwc";

// basic information
csvtojson()
  .fromFile("../data/sample/Basic Data.csv")
  .then(csvData => {
    
    // clean up keys
    let jsonData = [];
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
        // remove Notes
        delete newobj['notes'];
        jsonData.push(newobj);
    }

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) throw err;

        client
          .db(dbName)
          .collection("participants")
          .insertMany(jsonData, (err, res) => {
            if (err) throw err;

            console.log(`Inserted: ${res.insertedCount} rows`);
            client.close();
          });
      }
    ); 
  });

  //ed and career
  csvtojson()
  .fromFile("../data/sample/Ed & Career.csv")
  .then(csvData => {
    
    // clean up keys and create array for query
    let jsonData = [];
    let jsonQuery = [];
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

        jsonQuery.push(newobj['id']);
        // remove Notes
        delete newobj['notes'];
        delete newobj['id'];
        delete newobj['name'];
        jsonData.push(newobj);
    }
    console.log(jsonData);
    console.log(jsonQuery);

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) throw err;

        client
          .db(dbName)
          .collection("participants")
          .updateMany(jsonQuery, jsonData, (err, res) => {
            if (err) throw err;

            console.log(`Updated: ${res.insertedCount} rows`);
            client.close();
          });
      }
    );
  });