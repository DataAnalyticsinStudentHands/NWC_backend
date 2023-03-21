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
import masterSheet from './master';

const groupBy = (arr, key) => arr.reduce((acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc), {});

const HomePage = () => {

  // const [file, setFile] = useState(null);
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
            // console.log(worksheets);
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
            console.log(item["First Name"].length, masterSheet[item["ID"]].first_name.length);
            
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
    console.log(groupBy(errData, "sheet_name"));
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
