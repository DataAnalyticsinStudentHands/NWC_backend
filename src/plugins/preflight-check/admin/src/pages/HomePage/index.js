import React, {useState} from 'react';
import * as xlsx from 'xlsx';
import { 
  BaseHeaderLayout,
  Box, Button,
  Flex, Typography, 
  Field, FieldLabel, TwoColsLayout, FieldInput,
  EmptyStateLayout,
  TabGroup,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,

} from '@strapi/design-system';
import * as _ from 'lodash';
import * as master from './master.json';
import * as configData from './config.json';
import AllDataReport from '../../components/AllDataReport';
import BasicDataReport from '../../components/BasicDataReport';
import OtherDataReport from '../../components/OtherDataReport';

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

  return (
    <Box>
      <Box background="neutral100">
        <BaseHeaderLayout 
          title="Pre-Flight Check" 
          as="h1" 
          // primaryAction={
          //   <Button startIcon={<></>} onClick={()=>{
          //     // setSheets(null)
          //     // setUpload(false)
          //     // setReport({})
          //   }}>Clear</Button>
          // }
        />
        
      </Box>

      {
        sheets
        ? 
        <Box padding={4} background="primary100">
        <Box paddingBottom = {4}>
          <FieldLabel htmlFor='checkFile'>Upload your "Demographic Data" file. Note that this file must be in .xlsx format.</FieldLabel>
          <FieldInput type="file" id='checkFile' name='checkFile' accept='.xlsx' onChange={handleFile}/>
        </Box>
        <TabGroup id = 'reportTabs' label='reportTabs'>
          <Tabs>
            <Tab>General</Tab>
            <Tab>Basic Data Sheet</Tab>
            <Tab>Other Data Sheets</Tab>
          </Tabs>
          <TabPanels>
            <TabPanel>
              <AllDataReport sheets={sheets}/>
            </TabPanel>
            <TabPanel>
              <BasicDataReport sheets={sheets} master={master}/>
            </TabPanel>
            <TabPanel>
              <OtherDataReport sheets={sheets} master={master}/>
            </TabPanel>
          </TabPanels>

        </TabGroup>
      </Box>
        :       
          <Box padding={8} background="neutral100">
            <Box>
              <Typography variant="beta">
                Before importing data to the database, a preflight report must be created.
                This generates a report validating the data file, checking for common errors and giving feedback on any changes necessary before import.
              </Typography>
            </Box>
              <EmptyStateLayout 
                icon={<></>} 
                content='Upload your "Demographic Data" file. Note that this file must be in .xlsx format.'
                action={
                  <Box>
                    <FieldInput type="file" id='checkFile' name='checkFile' accept='.xlsx' onChange={handleFile}/>
                  </Box>
                } 
              />
            </Box>
        }

      
      {/* <Box padding={4} background="primary100">
        <Box paddingBottom = {4}>
          <FieldInput type="file" id='checkFile' name='checkFile' accept='.xlsx' onChange={handleFile}/>
        </Box>
        <TabGroup id = 'reportTabs' label='reportTabs'>
          <Tabs>
            <Tab>General</Tab>
            <Tab>Basic Data Sheet</Tab>
            <Tab>Other Data Sheets</Tab>
          </Tabs>
          <TabPanels>
            <TabPanel>
              <AllDataReport sheets={sheets}/>
            </TabPanel>
            <TabPanel>
              <BasicDataReport sheets={sheets} master={master}/>
            </TabPanel>
            <TabPanel>
              <OtherDataReport sheets={sheets} master={master}/>
            </TabPanel>


          </TabPanels>

        </TabGroup>
      </Box> */}

{/* <Box padding={8}>
  <AllDataReport sheets={sheets}/>
  <BasicDataReport sheets={sheets} master={master}/>
  <OtherDataReport sheets={sheets} master={master}/>
</Box>  */}

    </Box>
  );
};

export default HomePage;
