# ongendb branch

### How to Run:
    // grab from git
    git clone https://github.com/DataAnalyticsinStudentHands/NWC_backend.git
    // cd into the folder
    npm install
    // create the proper .env file in the root folder of the project
    // to run in development
    npm run develop

### The Organization:
This backend is split up into 2 main functionalities: managing excel/tabular data and managing stories for participants.

### Excel/Tabular Data:
Excel/Tabular data can be uploaded by running:

    // **need to run from root of project to use .env file**
    node methods/import_participants

Excel/Tabular data's api is handled in api/participants.

### Story Data:
Story data will be handled with more or less elementary Strapi functionality, with basic upload and find apis. [This 3-5 minute get-started page should detail thoroughly how to handle this aspect.](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html)