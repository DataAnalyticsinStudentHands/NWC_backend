const CSVToJSON = require("csvtojson");
const { startsWith } = require("lodash");
const _sth = require("./utility.js");

const fs = require("fs");
var participants = JSON.parse(fs.readFileSync("participants.json", "utf-8"));

async function education_and_career() {
    try{
        const csvData = await CSVToJSON().fromFile(
			"./data/Ed & Career.csv"
		);
        let education_data = []; let career_data = []; let spouse_profession_data = [];
        let participant_data = [];
        
        csvData.forEach((e) => {
            let keys = Object.keys(e);
            keys.forEach((key) => {
                if(key === "ID" || key === "Name" || startsWith(key, "Notes") || e[key] == "NA"){
                } else if (startsWith(key, "College: Undergrad institution")) {
                    education_data.push(_sth.removeNullUndefined({
                        participant_id: parseInt(e.ID),
                        degree: e['College: Undergrad degree (if more than one, list all but create new row for each)'] == 'NA' ? null : e['College: Undergrad degree (if more than one, list all but create new row for each)'],
                        year: e['College: Undergrad year of graduation (if more than one, list all but create new row for each)'] == 'NA'? null : parseInt(e['College: Undergrad year of graduation (if more than one, list all but create new row for each)']),
                        college: e['College: Undergrad institution (if more than one, list all but create new row for each)']
                    }))
                } else if (startsWith(key, "College: Graduate/ Professional institution")) {
                    education_data.push(_sth.removeNullUndefined({
                        participant_id: parseInt(e.ID),
                        degree: e['College: Graduate/ Professional degree (if more than one, list all but create new row for each)'] == 'NA' ? null : e['College: Graduate/ Professional degree (if more than one, list all but create new row for each)'],
                        year: e['College: Graduate/ Professional year of graduation (if more than one, list all but create new row for each)'] == 'NA'? null : parseInt(e['College: Graduate/ Professional year of graduation (if more than one, list all but create new row for each)']),
                        college: e['College: Graduate/ Professional institution (if more than one, list all but create new row for each)']
                    }))
                } else if (startsWith(key, "Job/ Profession")) {
                    career_data.push(_sth.removeNullUndefined({
                        participant_id: parseInt(e.ID),
                        job_profession: e['Job/ Profession (if more than one, list all but create new row for each)'],
                        category_of_employment:e['Category of Employment'] == 'NA'? null : e['Category of Employment']
                    }))
                } else if (startsWith(key, "Spouse's")) {
                    spouse_profession_data.push(_sth.removeNullUndefined({
                        participant_id: parseInt(e.ID),
                        spouse_profession: e["Spouse's Profession (if more than one, list all but create new row for each)"],
                    }))
                } else if(!startsWith(key, "Category") && !startsWith(key, "College")) {
                    participant_data.push({
                        participant_id: parseInt(e.ID),
                        arrtibute: key,
                        value:e[key]
                    }
                    )
                }
            })
        })

        participants = _sth.handleComponent(education_data, participants ,Object.keys(participants.data)[17])
        participants = _sth.pushComonent(education_data, participants, "education")

        participants = _sth.handleComponent(career_data,participants ,Object.keys(participants.data)[16])
        participants = _sth.pushComonent(career_data, participants, "career")

        participants = _sth.handleComponent(spouse_profession_data,participants ,Object.keys(participants.data)[15])
        participants = _sth.pushComonent(spouse_profession_data, participants, "spouse_profession")

        participant_data.forEach((e) => {
            switch (true) {
                case startsWith(e.arrtibute, "High School"):
                    participants.data[Object.keys(participants.data)[0]][`${e.participant_id}`]['high_school'] = e.value; break;
                case startsWith(e.arrtibute, "Highest"):
                    participants.data[Object.keys(participants.data)[0]][`${e.participant_id}`]['heighest_level_of_education'] = e.value; break;
                case startsWith(e.arrtibute, "Income"):
                    participants.data[Object.keys(participants.data)[0]][`${e.participant_id}`]['income_level'] = e.value; break;
                case startsWith(e.arrtibute, "Military"):
                    e.value= 'yes'? participants.data[Object.keys(participants.data)[0]][`${e.participant_id}`]['military_service'] = true : null; break;
                case startsWith(e.arrtibute, "Union Member"):
                    e.value= 'yes'? participants.data[Object.keys(participants.data)[0]][`${e.participant_id}`]['union_member'] = true : null; break;
                case startsWith(e.arrtibute, "Optional"):
                    participants.data[Object.keys(participants.data)[0]][`${e.participant_id}`]['specific_dollar'] = parseInt(e.value); break;
            }
        })
        var jsonContent = JSON.stringify(participants);
        fs.writeFile("participants.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("participants.json has been saved.");
        });

    } catch (error) {
        console.log(error);
    }
}

education_and_career()