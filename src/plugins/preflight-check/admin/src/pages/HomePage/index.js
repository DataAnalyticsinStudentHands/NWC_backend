import React, {useState} from 'react';
import * as xlsx from 'xlsx';
import { 
  BaseHeaderLayout,
  Box, Button,
  Flex, Typography, 
  Field, FieldLabel, TwoColsLayout, FieldInput,
  Table, Thead, Tbody, Tr, Td, Th,
  EmptyStateLayout,
  Tabs, Tab, TabGroup, TabPanels, TabPanel,
} from '@strapi/design-system';
const groupBy = (arr, key) => arr.reduce((acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc), {});
const masterSheet = {
  "1": {
      "last_name": "Anderson",
      "first_name": "Betty",
      "state": "TX"
  },
  "2": {
      "last_name": "Anderson",
      "first_name": "Linda",
      "state": "TX"
  },
  "3": {
      "last_name": "Anderson",
      "first_name": "Owanah",
      "state": "TX"
  },
  "4": {
      "last_name": "Anguiano",
      "first_name": "Lupe",
      "state": "TX"
  },
  "5": {
      "last_name": "Armstrong",
      "first_name": "Deane",
      "state": "TX"
  },
  "6": {
      "last_name": "Bebon",
      "first_name": "Cynthia",
      "state": "TX"
  },
  "7": {
      "last_name": "Becnel",
      "first_name": "Melva",
      "state": "TX"
  },
  "8": {
      "last_name": "Biggs",
      "first_name": "Linda",
      "state": "TX"
  },
  "9": {
      "last_name": "Brandon",
      "first_name": "Peggy",
      "state": "TX"
  },
  "10": {
      "last_name": "Brown",
      "first_name": "Geraldine",
      "state": "TX"
  },
  "11": {
      "last_name": "Brown",
      "first_name": "Penny",
      "state": "TX"
  },
  "12": {
      "last_name": "Castillo",
      "first_name": "Mary",
      "state": "TX"
  },
  "13": {
      "last_name": "Cavazos",
      "first_name": "Maria",
      "state": "TX"
  },
  "14": {
      "last_name": "Cotera",
      "first_name": "Marta",
      "state": "TX"
  },
  "15": {
      "last_name": "Cuadra",
      "first_name": "Eva",
      "state": "TX"
  },
  "16": {
      "last_name": "Cunningham",
      "first_name": "Claire",
      "state": "TX"
  },
  "17": {
      "last_name": "Dixon",
      "first_name": "Hortense",
      "state": "TX"
  },
  "18": {
      "last_name": "Duke",
      "first_name": "Barbara",
      "state": "TX"
  },
  "19": {
      "last_name": "Flinn",
      "first_name": "Mary",
      "state": "TX"
  },
  "20": {
      "last_name": "Flores",
      "first_name": "Margie",
      "state": "TX"
  },
  "21": {
      "last_name": "Garcia",
      "first_name": "Sylvia",
      "state": "TX"
  },
  "22": {
      "last_name": "Glossbrenner",
      "first_name": "Ernestine",
      "state": "TX"
  },
  "23": {
      "last_name": "Gomez",
      "first_name": "Rita",
      "state": "TX"
  },
  "24": {
      "last_name": "Gutierrez",
      "first_name": "Ruby",
      "state": "TX"
  },
  "25": {
      "last_name": "Hatfield",
      "first_name": "Carol",
      "state": "TX"
  },
  "26": {
      "last_name": "Hickie",
      "first_name": "Naoma",
      "state": "TX"
  },
  "27": {
      "last_name": "Hightower",
      "first_name": "Nikki",
      "state": "TX"
  },
  "28": {
      "last_name": "Johnson",
      "first_name": "Eddie",
      "state": "TX"
  },
  "29": {
      "last_name": "Kirby",
      "first_name": "Ruth",
      "state": "TX"
  },
  "30": {
      "last_name": "Lesley",
      "first_name": "Bonnie",
      "state": "TX"
  },
  "31": {
      "last_name": "Macha",
      "first_name": "Sharon",
      "state": "TX"
  },
  "32": {
      "last_name": "Macon",
      "first_name": "Jane",
      "state": "TX"
  },
  "33": {
      "last_name": "Maloy",
      "first_name": "Minnie",
      "state": "TX"
  },
  "34": {
      "last_name": "McKnight",
      "first_name": "Mamie",
      "state": "TX"
  },
  "35": {
      "last_name": "McKool",
      "first_name": "Betty",
      "state": "TX"
  },
  "36": {
      "last_name": "Monte",
      "first_name": "Millie",
      "state": "TX"
  },
  "37": {
      "last_name": "Opiela",
      "first_name": "Elaine",
      "state": "TX"
  },
  "38": {
      "last_name": "Oser",
      "first_name": "Marie",
      "state": "TX"
  },
  "39": {
      "last_name": "Peden",
      "first_name": "Betty",
      "state": "TX"
  },
  "40": {
      "last_name": "Puente",
      "first_name": "Dolores",
      "state": "TX"
  },
  "41": {
      "last_name": "Rangel",
      "first_name": "Irma",
      "state": "TX"
  },
  "42": {
      "last_name": "Reagan",
      "first_name": "Barbara",
      "state": "TX"
  },
  "43": {
      "last_name": "Richards",
      "first_name": "Ann",
      "state": "TX"
  },
  "44": {
      "last_name": "Robinson",
      "first_name": "Janice",
      "state": "TX"
  },
  "45": {
      "last_name": "Rodriguez-Mendoza",
      "first_name": "Amalia",
      "state": "TX"
  },
  "46": {
      "last_name": "Rodriguez",
      "first_name": "Irene",
      "state": "TX"
  },
  "47": {
      "last_name": "Salinas",
      "first_name": "Estela",
      "state": "TX"
  },
  "48": {
      "last_name": "Sauceda",
      "first_name": "Teresa",
      "state": "TX"
  },
  "49": {
      "last_name": "Shandera",
      "first_name": "Dorothy",
      "state": "TX"
  },
  "50": {
      "last_name": "Shaw",
      "first_name": "Loretta",
      "state": "TX"
  },
  "51": {
      "last_name": "Smiley",
      "first_name": "Martha",
      "state": "TX"
  },
  "52": {
      "last_name": "Stafford",
      "first_name": "Sammye",
      "state": "TX"
  },
  "53": {
      "last_name": "Stewart",
      "first_name": "Josephine",
      "state": "TX"
  },
  "54": {
      "last_name": "Stravato",
      "first_name": "Claudia",
      "state": "TX"
  },
  "55": {
      "last_name": "Tobolowsky",
      "first_name": "Hermine",
      "state": "TX"
  },
  "56": {
      "last_name": "Vasquez",
      "first_name": "Patricia",
      "state": "TX"
  },
  "57": {
      "last_name": "Waddell",
      "first_name": "N.",
      "state": "TX"
  },
  "58": {
      "last_name": "Weddington",
      "first_name": "Sarah",
      "state": "TX"
  },
  "59": {
      "last_name": "Williams",
      "first_name": "Arthur",
      "state": "TX"
  },
  "60": {
      "last_name": "Willrich",
      "first_name": "Penny",
      "state": "TX"
  },
  "61": {
      "last_name": "Wright",
      "first_name": "Helen",
      "state": "TX"
  },
  "62": {
      "last_name": "Zumbrun",
      "first_name": "Janna",
      "state": "TX"
  },
  "917": {
      "last_name": "Gutierrez",
      "first_name": "Luz",
      "state": "TX"
  }
}
const HomePage = () => {

  const [upload, setUpload] = useState(false);
  const [sheets, setSheets] = useState(null);

  const [report, setReport] = useState({});

  function handleFile(e){
    e.preventDefault();
    setUpload(false);
    setReport({});
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            let data = e.target.result;
            let workbook = xlsx.read(data, { type: "array" });
            let worksheets = {};
            workbook.SheetNames.forEach((sheetName)=>{
              worksheets[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
            })
            setSheets(worksheets);
            setUpload(true);
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  async function handleReport(e){
    e.preventDefault();

    let errData = [];
    
    Object.keys(sheets).forEach((sheetName)=>{
      // Handle Basic Data sheet
      if (sheetName === "Basic Data"){
        sheets[sheetName].forEach((item, index)=>{
          // Check if ID in file is in master sheet
          if (!masterSheet[item["ID"]]){
            errData.push({
              row_number:index+2,
              id:item["ID"],
              sheet_name:sheetName,
              error:"ID not exist in master sheet",
              file: item["Last Name"] + ", " + item["First Name"] + " " + item["State"]
            })
          } 
          // Check if Ln Fn and State in file is match with master sheet
          else if (
            item["Last Name"] !== masterSheet[item["ID"]].last_name || 
            item["First Name"].replace(/ /g,'') !== masterSheet[item["ID"]].first_name || 
            item["State"] !== masterSheet[item["ID"]].state
          ){            
            errData.push({
              row_number:index+2,
              id:item["ID"],
              sheet_name:sheetName,
              error:"Name or State does not match with the master sheet",
              master: masterSheet[item["ID"]],
              file: item["Last Name"] + ", " + item["First Name"] + " " + item["State"]
            })
          }
        })
      } 
      // Handle Other Data sheet
      else {
        // Check if ID in file is in master sheet
        sheets[sheetName].forEach((item, index)=>{
          if (!masterSheet[item["ID"]]){
            errData.push({
              row_number:index+2,
              id:item["ID"],
              sheet_name:sheetName,
              error:"ID not exist in master sheet"
            })
          } 
          // Check if Name in file is match with master sheet
          else if (!item["Name"]){
            errData.push({
              row_number:index+2,
              id:item["ID"],
              sheet_name:sheetName,
              error:"First or Last name does not match with the master sheet",
            })
          } else {
            let ln = item["Name"].split(", ")[0];
            let fn = item["Name"].split(", ")[1].split(" ")[0];
            if (ln != masterSheet[item["ID"]].last_name || fn != masterSheet[item["ID"]].first_name){
              errData.push({
                row_number:index+2,
                id:item["ID"],
                sheet_name:sheetName,
                error:"Name NOT MATCH WITH PARTICIPANT INFO",
                master: masterSheet[item["ID"]],
                file: item["Name"]
              })
            }
          }
        })

      }
    })
    setReport(groupBy(errData, "sheet_name"));

  }

  return (
    <div>
      <Box background="neutral100">
        <BaseHeaderLayout 
          title="Pre-Flight Check" 
          as="h1" />
      </Box>

    <Box padding={8} background="neutral100">
      <TwoColsLayout 
        startCol={
          Object.keys(report).length > 0
          ? 
            <TabGroup label="Some stuff for the label" id="tabs" onTabChange={selected => console.log(selected)}>
              <Tabs>
                {Object.keys(report).map((sheetName, index)=>{
                  return (
                    <Tab key={index}>
                      {sheetName}
                      <Typography as="span" color="neutral600" fontSize="m" marginRight={2} style={{color:"red"}}>
                        {report[sheetName].length}</Typography>
                    </Tab>
                  )
                })}
              </Tabs>

              <TabPanels>
                {Object.keys(report).map((sheetName, index)=>{
                  return (
                    <TabPanel key={index}>
                      <Box padding={4} background="neutral0">
                        <Table colCount={6} rowCount={10}>
                          <Thead>
                            <Tr>
                              <Th>Row #</Th>
                              <Th>Error</Th>
                              <Th>ID</Th>
                              <Th>Difference</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                          {report[sheetName].map((item)=>{
                            return (
                              <Tr key={item.sheet_name+item.id+item.row_number}>
                                <Td>{item.row_number}</Td>
                                <Td>{item.error}</Td>
                                <Td>{item.id}</Td>
                                <Td>
                                  {item.master ? item.master.last_name + ", " + item.master.first_name : ""} (Master)
                                  <br/>
                                  <br/>
                                  {item.file ? item.file : ""} (File)
                                </Td>
                              </Tr>
                            )
                          })}
                          </Tbody>
                        </Table>
                      </Box>
                    </TabPanel>
                  )
                })
                }
              </TabPanels>
            </TabGroup>
          : 
            <Box padding={8} background="neutral100">
              <EmptyStateLayout icon={<></>} content="Please Upload .csv or .xlsx file to generate the report" />
            </Box>
        } 
        endCol={
          <Box padding={4}>
            <Box padding={2}>
              <Typography variant="omega">
                Before importing data to the database, a preflight report must be created. This generates a report validating the data file, checking for common errors and giving feedback on any changes necessary before import.
              </Typography>
            </Box>
            <Box padding={2}>
              <Typography variant="omega">
                Upload your "Coding Sheet" file containing Candidate and Letterwriter IDs, profile links, and other data. Note that only XLSX format is allowed and column names must be the same as the original template.
              </Typography>
            </Box>

            <Flex direction="column" gap={5}>
              <Field name="file" required={false}>
                <Flex direction="column" alignItems="flex-start" gap={1}>
                  <FieldLabel>Upload Coding Sheet</FieldLabel>
                  <FieldInput type="file" id='checkFile' name='checkFile' accept='.csv, .xlsx' onChange={handleFile}/>
                </Flex>
              </Field>
              <Flex direction="column" alignItems="flex-center">
                {upload && <Button size="L" onClick={handleReport} >Generate preflight report</Button>}
              </Flex>
            </Flex>
          </Box>
        } />
    </Box>
    </div>
  );
};

export default HomePage;
