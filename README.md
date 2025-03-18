# Sharing Stories 1977 Backend

This repository contains the code for a [Strapi](https://strapi.io/) based backend for the [Sharing Stories from 1977: The National Women’s Conference as a Window into Recent American History](https://drc.lib.uh.edu/current-and-past-projects/young-zarnow/). We use a PostgreSQL as our data store.

## Description
Content on pages such as Home can be found in content-nameOfPage.

Please follow the general [Strapi developer documentation](https://docs.strapi.io/).

Here is an [intro video to Strapi content managment](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html)

### Import of Demographic Data into DB
Is done through the Demographic data plugin

## Getting Started

Clone from GitHub
```
git clone https://github.com/DataAnalyticsinStudentHands/NWC_backend.git
```

Change into the directory and install packages
```
npm install
```
Create the proper .env file in the root folder of the project to setup connection with DB (see .env.example)

Run in development mode
```
npm run develop
```
    
## Production/Deployment

First built the admin interface and then start up the backend.
```
npm run build --clean
npm start
```

We recommend using [PM2](https://pm2.keymetrics.io/) as process manager. For configuration see `ecosystem.config.js`.
