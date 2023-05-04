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
import * as _ from 'lodash';
const groupBy = (arr, key) => arr.reduce((acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc), {});

import * as master from './masterAnalyst.json';
import * as configData from './config.json';

const errLog= {
  match:{
    participant: 'participant info does not match',
    id: "This ID doesnt belong to this State",
    name: 'Name is not Match with ID',
  },
  dataType:{
    number: 'The field should be number',
  },
  err:{
    state: 'This Sheet inclded more than one state',
  }
}
const HomePage = () => {

  const [upload, setUpload] = useState(false);
  const [sheets, setSheets] = useState(null);
  const [errMessage, setErrMessage] = useState({
    columns:{},
  });
  const [report, setReport] = useState({});

  function handleFile(e){
    e.preventDefault();
    setUpload(false);
    setReport({});
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = xlsx.read(data, { type: "array" });
            const worksheets = workbook.SheetNames.reduce((acc, sheetName) => {
              acc[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
              return acc;
          }, {});
            setSheets(worksheets);
            setUpload(true);
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  async function handleReport(e){
    e.preventDefault();
    let config = configData.default;
    let headingCheck = {}
    Object.entries(config).forEach(([sheet, value]) => {
        let keys = [];
        sheets[sheet].forEach(row => {
            Object.keys(row).forEach(key => {
              if(_.startsWith(key,'Note')) return
                keys.includes(key) ? null : keys.push(key);
            })
        })
        headingCheck[sheet] = _.difference(keys, value.headings);
    });
    setErrMessage({
      ...errMessage,
      columns: headingCheck,
    });



    let errData = [];

    // Object.keys(sheets).forEach((sheetName)=>{

    //   switch (sheetName) {
    //     case "Basic Data":
    //       sheets[sheetName].forEach((item, index)=>{
    //         // if(! master[item.State].ids.includes(item.ID)){
    //         //   errData.push({
    //         //     row_number: index + 2,
    //         //     id: item.ID,
    //         //     sheet_name: sheetName,
    //         //     error: errLog.match.id,
    //         //     master: 'File Data',
    //         //     file: `${item.ID} - ${item.State}`
    //         //   });
    //         //   return;
    //         // }

    //         // const masterObj = master[item.State].data[item.ID];
            
    //         // `${item['Last Name']}, ${item['First Name']}` !== `${masterObj.last_name}, ${masterObj.first_name}` && errData.push({
    //         //   row_number: index + 2,
    //         //   id: item.ID,
    //         //   sheet_name: sheetName,
    //         //   error: errLog.match.participant,
    //         //   master: `${masterObj.last_name}, ${masterObj.first_name} (master sheet)`,
    //         //   file: `${item['Last Name']}, ${item['First Name']} (file)`
    //         // });

    //         // // Check the number fields
    //         // [
    //         //   'Age in 1977',
    //         //   'Birthdate Day',
    //         //   'Birthdate Month',
    //         //   'Birthdate Year',
    //         //   'Deathdate Day',
    //         //   'Deathdate Month',
    //         //   'Deathdate Year',
    //         //   'Median Household Income of Place of Residence (check US Census)',
    //         //   'Total Population of Place of Residence (check US Census)',
    //         //   'Total Number of Children (born throughout lifetime)'
    //         // ].forEach((column)=>{
    //         //   if (item[column] && isNaN(item[column])) {
    //         //     errData.push({
    //         //       row_number: index + 2,
    //         //       id: item.ID,
    //         //       sheet_name: sheetName,
    //         //       error: errLog.dataType.number,
    //         //       master: column,
    //         //       file: `${item[column]}`
    //         //     });
    //         //   }
    //         // })

            
    //       })
    //       break;
    //     default:
    //       // sheets[sheetName].forEach((item, index)=>{
    //       //   if( sheetName === 'Sources' || sheetName === 'Questions') return

    //       //   if(Object.keys(analysisData.state).length > 1){
    //       //     errData.push({
    //       //       row_number: '',
    //       //       id: '',
    //       //       sheet_name: sheetName,
    //       //       error: errLog.err.state,
    //       //       master: '',
    //       //       file: ``
    //       //     });
    //       //     return;
    //       //   }

    //       //   // const stateValues = Object.keys(analysisData.state)[0];
    //       //   const masterObj = master[Object.keys(analysisData.state)[0]].data[item.ID];
    //       //     item.Name.split(',')[0] !== `${masterObj.last_name}` && errData.push({
    //       //       row_number: index + 2,
    //       //       id: item.ID,
    //       //       sheet_name: sheetName,
    //       //       error: errLog.match.name,
    //       //       master: `${masterObj.last_name}, ${masterObj.first_name} (master sheet)`,
    //       //       file: `${item.Name} (file)`
    //       //     });         


    //       //     // Check the number fields
    //       //     const numberCloumns = [
    //       //       'Start Year for Political Office',
    //       //       'End Year for Political Office (if office is still held leave this column blank)',
    //       //       'Year of Race that was Lost ',
    //       //       'College: Graduate/ Professional year of graduation (if more than one, list all but create new row for each)',
    //       //       'College: Undergrad year of graduation (if more than one, list all but create new row for each)',
    //       //       'Votes Received at State Meeting for NWC Delegate/Alternate'
    //       //     ]
    //       //     numberCloumns.forEach((column)=>{
    //       //       if (item[column] && isNaN(item[column])) {
    //       //         errData.push({
    //       //           row_number: index + 2,
    //       //           id: item.ID,
    //       //           sheet_name: sheetName,
    //       //           error: errLog.dataType.number,
    //       //           master: column,
    //       //           file: `${item[column]}`
    //       //         });
    //       //       }
    //       //     })
            
    //       // })
    //   }

    // })
    // let errorData = groupBy(errData, "sheet_name")

    // const newErrorData = Object.keys(errorData).reduce((acc, sheetName) => {
    //   const sheetErrors = errorData[sheetName].reduce((errorsAcc, item) => {
    //     if (errorsAcc[item.id]) {
    //       errorsAcc[item.id].errors[item.error]
    //         ? errorsAcc[item.id].errors[item.error].push(item.row_number)
    //         :  errorsAcc[item.id].errors[item.error] = [item.row_number];
    //     } else {
    //       errorsAcc[item.id] = {
    //         id: item.id,
    //         master: item.master,
    //         file: item.file,
    //         errors: {
    //           [item.error]: [item.row_number],
    //         },
    //         sheet_name: item.sheet_name,
    //       };
    //     }
    //     return errorsAcc;
    //   }, {});
    //   return {
    //     ...acc,
    //     [sheetName]: sheetErrors,
    //   };
    // }, {});
    // setReport(newErrorData);

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
        // startCol={
        //   Object.keys(report).length > 0
        //   ? 
        //     <TabGroup label="Some stuff for the label" id="tabs">
        //       <Tabs>
        //         {Object.keys(report).map((sheetName, index)=>{
        //           return (
        //             <Tab key={index}>
        //               {sheetName}
        //             </Tab>
        //           )
        //         })}
        //       </Tabs>

        //       <TabPanels>
        //         {Object.keys(report).map((sheetName, index)=>{
        //           return (
        //             <TabPanel key={index + sheetName}>
        //               <Box padding={4} background="neutral0">
        //                 <Table colCount={6} rowCount={10}>
        //                   <Thead>
        //                     <Tr>
        //                       {/* <Th>Row #</Th> */}
        //                       <Th>ID</Th>
        //                       <Th>Data</Th>
        //                       <Th>Error</Th>
        //                       <Th>Rows in the file</Th>
        //                     </Tr>
        //                   </Thead>
        //                   <Tbody key = {index + sheetName + 'tbody'}>
        //                   {Object.values(report[sheetName]).map((item)=>{
        //                     return (
        //                       <Tr key={item.sheet_name+ Math.random()}>
        //                         <Td>{item.id}</Td>
        //                         <Td>
        //                           {item.master ? item.master : ""}
        //                           <br/>
        //                           <br/>
        //                           {item.file ? item.file : ""}
        //                         </Td>
        //                         <Td>{
        //                             Object.entries(item.errors).map((error, index)=>{
        //                               return(
        //                                 <Typography key={index} as="span" color="neutral600" fontSize="m" marginRight={2} style={{color:"red"}}>
        //                                   {error[0]}
        //                                 </Typography>
        //                               )
        //                             })
        //                           }</Td>
        //                         <Td>
        //                           {
        //                             Object.entries(item.errors).map((error, index)=>{
        //                               return(
        //                                 <Typography key={index} as="span" color="neutral600" fontSize="m" marginRight={2} style={{color:"red"}}>
        //                                   {error[1].join(", ")}
        //                                 </Typography>
        //                               )
        //                             })
        //                           }
        //                         </Td>

        //                       </Tr>
        //                     )
        //                   })}
        //                   </Tbody>
        //                 </Table>
        //               </Box>
        //             </TabPanel>
        //           )
        //         })
        //         }
        //       </TabPanels>
        //     </TabGroup>
        //   : 
        //     <Box padding={8} background="neutral100">
        //       <EmptyStateLayout icon={<></>} content="Please Upload .csv or .xlsx file to generate the report" />
        //     </Box>
        // }
        startCol={
          Object.keys(errMessage.columns).length > 0
          ?
            <TabGroup label="">
              <Tabs>
                 {Object.keys(errMessage.columns).map((sheetName, index)=>{
                  return (
                    <Tab key={index}>
                      {sheetName}
                    </Tab>
                  )
                })}
              </Tabs>
              <TabPanels>
                {Object.entries(errMessage.columns).map(([sheet, value] )=>{
                  // console.log(sheet);
                  return(
                    <TabPanel key={sheet}>
                                            <Box padding={4} background="neutral0">
                      <Typography fontSize="L" marginRight={2}>The column name is not match with the template</Typography>
</Box>

                      <Box padding={4} background="neutral0">
                        {value.map((item, index)=>{
                          return(

                            <Typography key={index} as="div" color="neutral600" fontSize="m" marginRight={2} style={{color:"red"}}>
                              {item}
                            </Typography>
                          )
                        })}
                      </Box>

                    </TabPanel>
                  )
                })}
              </TabPanels>
            </TabGroup>

          :
          <Box padding={4}>
            <Box padding={2}>
              <Typography variant="omega">
                </Typography>
            </Box>
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

            <Box>
              <Typography variant="omega"> 
                {/* {master[Object.keys(analysis.state)[0]]?.sum === analysis?.state[Object.keys(analysis.state)[0]]?.sum ? `All the participants from ${Object.keys(analysis.state)[0]} are presented`: `Some participants from ${Object.keys(analysis.state)[0]} are missing`} */}

              </Typography>

            </Box>
          </Box>
        } />
    </Box>
    </div>
  );
};

export default HomePage;
