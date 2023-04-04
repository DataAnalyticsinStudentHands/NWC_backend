const qs = require('qs');
const axios = require('axios');

async function MapsAPI(){
    const query1 = qs.stringify({
      street:"5017 15th",
      city:"Lubbock",
      state:"TX",
      zip:"79416"
    });
    // [
    //   {
    //     place_id: 105862885,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 21107693,
    //     boundingbox: [ '33.5824997', '33.5825033', '-101.921993', '-101.918447' ],
    //     lat: '33.5824997',
    //     lon: '-101.920275',
    //     display_name: '15th Street, Pheasant Ridge, Lubbock, Lubbock County, Texas, 79416, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.31
    //   },
    //   {
    //     place_id: 106357019,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 21107685,
    //     boundingbox: [ '33.5815808', '33.5823687', '-101.9571393', '-101.9435422' ],
    //     lat: '33.58236',
    //     lon: '-101.9505422',
    //     display_name: '15th Street, Northridge, Lubbock, Lubbock County, Texas, 79416, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.31
    //   },
    //   {
    //     place_id: 105751290,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 21107701,
    //     boundingbox: [ '33.5823661', '33.583266', '-101.9338247', '-101.9224349' ],
    //     lat: '33.5831401',
    //     lon: '-101.928214',
    //     display_name: '15th Street, Alford Terrace, Lubbock, Lubbock County, Texas, 79416, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.31
    //   },
    //   {
    //     place_id: 105773135,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 21093340,
    //     boundingbox: [ '33.5823528', '33.5823578', '-101.8011022', '-101.7924592' ],
    //     lat: '33.5823548',
    //     lon: '-101.7967662',
    //     display_name: 'East 15th Street, Windmill, Lubbock, Lubbock County, Texas, 79403, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.31
    //   },
    //   {
    //     place_id: 105538830,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 21107697,
    //     boundingbox: [ '33.5825997', '33.5829407', '-101.918085', '-101.9051062' ],
    //     lat: '33.5829387',
    //     lon: '-101.911915',
    //     display_name: '15th Street, Rush, Lubbock, Lubbock County, Texas, 79416, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.31
    //   },
    //   {
    //     place_id: 106354589,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 21104110,
    //     boundingbox: [ '33.5814458', '33.5814668', '-101.8011052', '-101.7924652' ],
    //     lat: '33.5814668',
    //     lon: '-101.7967862',
    //     display_name: 'East 15th Place, Windmill, Lubbock, Lubbock County, Texas, 79403, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.31
    //   },
    //   {
    //     place_id: 105855579,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 21092942,
    //     boundingbox: [ '33.5805291', '33.5823711', '-101.960495', '-101.9577381' ],
    //     lat: '33.5818077',
    //     lon: '-101.9592348',
    //     display_name: '15th Drive, Tierra Estates, Lubbock, Lubbock County, Texas, 79416, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.31
    //   },
    //   {
    //     place_id: 150197738,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 196291194,
    //     boundingbox: [ '33.5815924', '33.5817187', '-102.0126538', '-102.0095325' ],
    //     lat: '33.5817187',
    //     lon: '-102.010271',
    //     display_name: '15th Street, Willow Bend, Lubbock, Lubbock County, Texas, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.31
    //   },
    //   {
    //     place_id: 105751276,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 21107690,
    //     boundingbox: [ '33.5836351', '33.5837621', '-101.9359887', '-101.93475' ],
    //     lat: '33.5837613',
    //     lon: '-101.93541',
    //     display_name: '15th Street, Tracy Heights, Lubbock, Lubbock County, Texas, 79416, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.31
    //   },
    //   {
    //     place_id: 105780277,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 21107706,
    //     boundingbox: [ '33.5819827', '33.5819894', '-101.9019807', '-101.9000515' ],
    //     lat: '33.5819827',
    //     lon: '-101.9012657',
    //     display_name: '15th Street, Lubbock, Lubbock County, Texas, 79416, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.31
    //   }
    // ]
    const query2 = qs.stringify({
      street:"1531 Maryland",
      city:"Houston",
      state:"TX",
      zip:"77006"
    });
    // [
    //   {
    //     place_id: 102725745,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 15376998,
    //     boundingbox: [ '29.7457452', '29.7467609', '-95.4019571', '-95.3993673' ],
    //     lat: '29.7458006',
    //     lon: '-95.4013777',
    //     display_name: 'Maryland Street, Houston, Harris County, Texas, 77019, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.31
    //   },
    //   {
    //     place_id: 103595855,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 15376997,
    //     boundingbox: [ '29.747271', '29.7479887', '-95.39828', '-95.3967737' ],
    //     lat: '29.7477775',
    //     lon: '-95.397217',
    //     display_name: 'Maryland Street, Houston, Harris County, Texas, 77006, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.31
    //   }
    // ]
    const query3 = qs.stringify({
      street:"2206 Berkley",
      city:"Wichita Falls",
      state:"TX",
      zip:"76308"
    });
    // [
    //   {
    //     place_id: 105643009,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 21339304,
    //     boundingbox: [ '33.8841947', '33.8854857', '-98.5212537', '-98.50611' ],
    //     lat: '33.885313',
    //     lon: '-98.513287',
    //     display_name: 'Berkley Drive, Wichita Falls, Wichita County, Texas, 76308, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.4
    //   }
    // ]
    const query4 = qs.stringify({
      street:"531 Marquette Ave.",
      city:"San Antonio",
      state:"TX",
      zip:"78228"
    });
    // [
    //   {
    //     place_id: 102752465,
    //     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    //     powered_by: 'Map Maker: https://maps.co',
    //     osm_type: 'way',
    //     osm_id: 15157445,
    //     boundingbox: [ '29.454062', '29.455482', '-98.556034', '-98.553689' ],
    //     lat: '29.45519',
    //     lon: '-98.554644',
    //     display_name: 'Marquette Drive, San Antonio, Bexar County, Texas, 78228, United States',
    //     class: 'highway',
    //     type: 'residential',
    //     importance: 0.4
    //   }
    // ]
    const query5 = qs.stringify({
      street:"Rt. 2, Box 503K",
      city:"Leander",
      state:"TX",
      zip:"78641"
    });
    // []

    let response = await axios.get(`https://geocode.maps.co/search?${query5}`)

    console.log(response.data);

}
MapsAPI()