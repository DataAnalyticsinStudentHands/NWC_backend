# ongendb branch

### How to Run:
    // grab from git
    git clone https://github.com/DataAnalyticsinStudentHands/NWC_backend.git
    // cd into the folder
    npm install
    // create the proper .env file in the root folder of the project
    // to run in development
    npm run develop
    // to run for real
    npm start

### The Organization:
This backend is split up into 2 main functionalities: managing excel/tabular data and managing stories for participants.

### Excel/Tabular Data:
Excel/Tabular data can be uploaded by running the following:
    
    //this turns xlsx into csv
    python methods/getsheets.py data/sample.xlsx -f csv
    // **must put a copy of the .env file into methods/**
    cd methods
    node import_participants -b -a -e -p -r -l -o -s

Excel/Tabular data's api is handled in api/participants.

### Story Data:
Story data will be handled with more or less elementary Strapi functionality, with basic upload and find apis. [This 3-5 minute get-started page should detail thoroughly how to handle this aspect.](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html)


### Page Data:
For some content on pages such as the home, this CMS is used. The data behind the text of each page can be found in content-nameOfPage. This will be fetched from the other end by Axios and fed into the respective pages.

### Deleting / Creating Content Types:
The process of deleting/creating content types is more or less described by the link above.
However, the where of the data should be mentioned.
If I create some new data type, "x", it will create a new folder in api/x that includes the model, controllers, and etc.
In other words, data structures are stored locally, rather than on the database.
