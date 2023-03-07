# Sharing Stories 1977 Backend

This repository contains the code for a [Strapi](https://strapi.io/) based backend for the [Sharing Stories from 1977: The National Women’s Conference as a Window into Recent American History](https://drc.lib.uh.edu/current-and-past-projects/young-zarnow/). We use a PostgreSQL as our data store.

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

### Content Managed via Strapi
Content on pages such as the home, this CMS is used. The data behind the text of each page can be found in content-nameOfPage.

Please follow the general [Strapi developer documentation](https://docs.strapi.io/).

Here is an [intro video to Strapi content managment](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html)

### Import of Excel/Tabular Data into DB
Excel data can be uploaded by using scripts inside the /data_import folder.

Excel/Tabular data's api is handled in api/participants.
