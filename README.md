# Sharing Stories 1977 Backend

This repository contains the code for a [Strapi](https://strapi.io/) based backend for the [Sharing Stories from 1977: The National Women’s Conference as a Window into Recent American History](https://drc.lib.uh.edu/current-and-past-projects/young-zarnow/). We use MongoDB as our data store.

## Development

```
// clone from github
git clone https://github.com/DataAnalyticsinStudentHands/NWC_backend.git
// cd into the folder and install packages
npm install
// create the proper .env file in the root folder of the project to setup connection with DB (see .env.example)
// run in development mode
npm run develop
```
    
## Production/Deployment

First built the admin interface and then start up the backend.
```
npm run build --clean
npm start
```

We recommend using [PM2](https://pm2.keymetrics.io/) as process manager. For configuration see `ecosystem.config.js`.

## Purpose
This backend is split up into 2 main functionalities: serving a light-weight CMS (Strapi) and allow the import of tabular data into the database.

### Page Content managed via Strapi
For some content on pages such as the home, this CMS is used. The data behind the text of each page can be found in content-nameOfPage. This will be fetched from the other end by Axios and fed into the respective pages.

### Story Content managed via Strapi
Story data will be handled with more or less elementary Strapi functionality, with basic upload and find apis. [This 3-5 minute get-started page should detail thoroughly how to handle this aspect.](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html)

### Deleting / Creating Content Types in Strapi
The process of deleting/creating content types is more or less described by the link above.
However, the where of the data should be mentioned.
If I create some new data type, "x", it will create a new folder in api/x that includes the model, controllers, and etc.
In other words, data structures are stored locally, rather than on the database.

### Import of Excel/Tabular Data into DB
Excel/Tabular data can be uploaded by running the following:
    
    //this turns xlsx into csv
    python methods/getsheets.py data/sample.xlsx -f csv
    // **must put a copy of the .env file into methods/**
    cd methods
    node import_participants -b -a -e -p -r -l -o -s

Excel/Tabular data's api is handled in api/participants.
