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
import * as data from './MasterSheet.json'
const masterSheet = data.default;
const errLog= {
  match:{
    id: "ID is not exist in the master sheet",
    first_name: 'First Name Not Match',
    last_name: 'Last Name Not Match',
    state: 'State Not Match',
    name: 'Name Not Match',
  },
  dataType:{
    number: 'The field should be number',
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
      switch (sheetName) {
        case "Basic Data":
          sheets[sheetName].forEach((item, index)=>{
            if (!masterSheet[item.ID]) {
              errData.push({
                row_number: index + 2,
                id: item.ID,
                sheet_name: sheetName,
                error: errLog.match.id,
                file: `${item["Last Name"]}, ${item["First Name"]} ${item.State}`
              });
            } else {      
              item["Last Name"] !== masterSheet[item.ID].last_name && errData.push({
                row_number: index + 2,
                id: item.ID,
                sheet_name: sheetName,
                error: errLog.match.last_name,
                master: masterSheet[item.ID].last_name,
                file: `${item["Last Name"]}`
              });
              item["First Name"] !== masterSheet[item.ID].first_name && errData.push({
                row_number: index + 2,
                id: item.ID,
                sheet_name: sheetName,
                error: errLog.match.first_name,
                master: masterSheet[item.ID].first_name,
                file: `${item["First Name"]}`
              });
              item.State !== masterSheet[item.ID].state && errData.push({
                row_number: index + 2,
                id: item.ID,
                sheet_name: sheetName,
                error: errLog.match.state,
                master: masterSheet[item.ID].state,
                file: `${item.State}`
              });

              const numberColumns = [
                'Age in 1977',
                'Birthdate Day',
                'Birthdate Month',
                'Birthdate Year',
                'Deathdate Day',
                'Deathdate Month',
                'Deathdate Year',
                'Median Household Income of Place of Residence (check US Census)',
                'Total Population of Place of Residence (check US Census)',
                'Total Number of Children (born throughout lifetime)'
            ]
            numberColumns.forEach((column)=>{
              if (item[column] && isNaN(item[column])) {
                errData.push({
                  row_number: index + 2,
                  id: item.ID,
                  sheet_name: sheetName,
                  error: errLog.dataType.number,
                  master: column,
                  file: `${item[column]}`
                });
              }
            })


            }
          })
          break;
        default:
          sheets[sheetName].forEach((item, index)=>{
            if (!masterSheet[item.ID]) {
              errData.push({
                row_number: index + 2,
                id: item.ID,
                sheet_name: sheetName,
                error: errLog.match.id,
                master: "",
                file: `${item["Last Name"]}, ${item["First Name"]}`
              });
            } else {
              item.Name !== `${masterSheet[item.ID].last_name}, ${masterSheet[item.ID].first_name}` && errData.push({
                row_number: index + 2,
                id: item.ID,
                sheet_name: sheetName,
                error: errLog.match.name,
                master: `${masterSheet[item.ID].last_name}, ${masterSheet[item.ID].first_name} (master sheet)`,
                file: `${item.Name} (file)`
              });

              const numberColumns = [
                'College: Graduate/ Professional year of graduation (if more than one, list all but create new row for each)',
                'College: Undergrad year of graduation (if more than one, list all but create new row for each)',
                'Votes Received at State Meeting for NWC Delegate/Alternate',
              ]
              numberColumns.forEach((column)=>{
                if (item[column] && isNaN(item[column])) {
                  errData.push({
                    row_number: index + 2,
                    id: item.ID,
                    sheet_name: sheetName,
                    error: errLog.dataType.number,
                    master: column,
                    file: `${item[column]}`
                  });
                }
              })
            }
          })
      }
    })
    let errorData = groupBy(errData, "sheet_name")
    // setReport(errorData);

    const newErrorData = Object.keys(errorData).reduce((acc, sheetName) => {
      const sheetErrors = errorData[sheetName].reduce((errorsAcc, item) => {
        if (errorsAcc[item.id]) {
          errorsAcc[item.id].errors[item.error]
            ? errorsAcc[item.id].errors[item.error].push(item.row_number)
            :  errorsAcc[item.id].errors[item.error] = [item.row_number];
        } else {
          errorsAcc[item.id] = {
            id: item.id,
            master: item.master,
            file: item.file,
            errors: {
              [item.error]: [item.row_number],
            },
            sheet_name: item.sheet_name,
          };
        }
        return errorsAcc;
      }, {});
      return {
        ...acc,
        [sheetName]: sheetErrors,
      };
    }, {});
  
    setReport(newErrorData);


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
                    </Tab>
                  )
                })}
              </Tabs>

              <TabPanels>
                {Object.keys(report).map((sheetName, index)=>{
                  return (
                    <TabPanel key={index + sheetName}>
                      <Box padding={4} background="neutral0">
                        <Table colCount={6} rowCount={10}>
                          <Thead>
                            <Tr>
                              {/* <Th>Row #</Th> */}
                              <Th>ID</Th>
                              <Th>Data</Th>
                              <Th>Error</Th>
                              <Th>Rows in the file</Th>
                            </Tr>
                          </Thead>
                          <Tbody key = {index + sheetName + 'tbody'}>
                          {Object.values(report[sheetName]).map((item)=>{
                            return (
                              <Tr key={item.sheet_name+ Math.random()}>
                                <Td>{item.id}</Td>
                                <Td>
                                  {item.master ? item.master : ""}
                                  <br/>
                                  <br/>
                                  {item.file ? item.file : ""}
                                </Td>
                                <Td>{
                                    Object.entries(item.errors).map((error, index)=>{
                                      return(
                                        <Typography key={index} as="span" color="neutral600" fontSize="m" marginRight={2} style={{color:"red"}}>
                                          {error[0]}
                                        </Typography>
                                      )
                                    })
                                  }</Td>
                                <Td>
                                  {
                                    Object.entries(item.errors).map((error, index)=>{
                                      return(
                                        <Typography key={index} as="span" color="neutral600" fontSize="m" marginRight={2} style={{color:"red"}}>
                                          {error[1].join(", ")}
                                        </Typography>
                                      )
                                    })
                                  }
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
