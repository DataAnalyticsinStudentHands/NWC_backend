import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { request } from '@strapi/helper-plugin';
import axios from "axios";
import qs from "qs";
import * as xlsx from "xlsx";
import {
  BaseHeaderLayout,
  Box,
  Button,
  Flex,
  Typography,
  Field,
  FieldLabel,
  TwoColsLayout,
  FieldInput,
  EmptyStateLayout,
  TabGroup,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from "@strapi/design-system";
import * as _ from "lodash";
import * as master from "./master.json";
import AllDataReport from "../../components/AllDataReport";
import BasicDataReport from "../../components/BasicDataReport";
import OtherDataReport from "../../components/OtherDataReport";

const token = '53d96f599b1d291321c7e4691ca2f204be5e4ddd58b66be5674d77281ca2110d4affa23a09ca34678cfaf117f59dfceff074f13a55a0fef4a06500da5ad9b668ff86c630ae1742b32a9ed84ae67d6d4f8e4cdfda16e40b5b424f25f4e5dcfe11b8451de84e56250debbfa92584bcc10650fe22d217ec639cefdb6f1d3dd095a7'

const HomePage = () => {
  // const [upload, setUpload] = useState(false);
  const [sheets, setSheets] = useState(null);
  // const [fileName, setFileName] = useState(null);
  // const [errMessage, setErrMessage] = useState({
  //   columns:{},
  // });
  // const [report, setReport] = useState({});

  const [isPass, setIsPass] = useState({
    allDataReport: false,
    basicDataReport: false,
    otherDataReport: false,
  });

  const [jsonData, setJsonData] = useState(null);

  function handleFile(e) {
    e.preventDefault();
    // setUpload(false);
    // setReport({});
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
        // setUpload(true);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  useEffect(() => {
    setIsPass({
      allDataReport: false,
      basicDataReport: false,
      otherDataReport: false,
    });
  }, [sheets]);

  function handlePass(report) {
    setIsPass((prevState) => ({ ...prevState, ...report }));
  }
  async function handleDownload() {

    // console.log('Clicked');
    // console.log(sheets);
    const exportURL = "http://localhost:1337/api/import-export-entries/content/export/contentTypes";
    const params = {
      slug:"api::nwc-participant.nwc-participant",
      exportFormat:"json-v2",
      // relationsAsId:true,
      deepness:3
    };
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }

    const results = await axios.post(exportURL, params,header);
  
    console.log(JSON.parse(results.data.data));


    
    // // //Plan A

    // // //Download JSON file
    // var fileInput = document.getElementById("checkFile");

    // // Convert JSON object to string
    // var jsonStr = JSON.stringify(JSON.parse(results.data.data), null, 2);

    // // Create a Blob object with the JSON string
    // var blob = new Blob([results.data.data], { type: "application/json" });

    // // Create a link element
    // var link = document.createElement("a");
    
    // // Set the link's href attribute to the Blob URL
    // link.href = URL.createObjectURL(blob);

    // // Set the download attribute with desired filename
    // link.download = fileInput.files[0].name + ".json";

    // // Trigger a click event on the link element to initiate download
    // link.click();

    // // Clean up by revoking the URL object
    // URL.revokeObjectURL(link.href);
  }

  async function handleDirectImport(e) {
    e.preventDefault();
    // console.log(jsonData);

    const apiURL = "http://localhost:1337/api/import-export-entries/content/import";
    const dataContent = {
      "version":2,
      "data":{
        "api::nwc-role.nwc-role": {
          "5": {
            "id": 5,
            "role": "Other Role: chair, Texas Coordinating Committee for International Women's Year"
          },
          "6": {
            "id": 6,
            "role": "Other Role: vice chair, First Plenary Session, NWC"
          },
        }
      }
    }
    const data = {
      slug: "string",
      data: JSON.stringify(dataContent),
      format: "json"
    }
    axios.post(apiURL, data)


    
  }

  function handleJSONFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      console.log(data);
      setJsonData(data);
    };
    reader.readAsText(file);
  }

  return (
    <Box>
      <Box background="neutral100">
        <BaseHeaderLayout
          title="Pre-Flight Check"
          as="h1"
          primaryAction={
            isPass.allDataReport &&
            isPass.basicDataReport &&
            isPass.otherDataReport && (
              <Box padding={4} background="neutral100">
                <Button
                  variant="success"
                  onClick={(e) => handleDownload(e)}
                >
                  download
                </Button>
              </Box>
            )
          }
        />
      </Box>

      {/* <Box>
        <FieldInput
              type="file"
              id="testFile"
              name="testFile"
              accept=".json"
              onChange={handleJSONFile}
            />
        <Button
          variant="success"
          onClick={(e) => handleDirectImport(e)}
        >
          import
        </Button>
      </Box> */}

      <Box padding={4} background="neutral100">
        <Box>
          <Typography variant="beta">
            Before importing data to the database, a preflight report must be
            created. This generates a report validating the data file, checking
            for common errors and giving feedback on any changes necessary
            before import.
          </Typography>
          <Box>
            <FieldInput
              type="file"
              id="checkFile"
              name="checkFile"
              accept=".xlsx"
              onChange={handleFile}
            />
            <FieldLabel htmlFor='checkFile'>Upload your "Demographic Data" file. Note that this file must be in .xlsx format.</FieldLabel>
          </Box>
        </Box>
      </Box>

      {sheets && (
        <Box padding={4} background="primary100">
          <TabGroup id="reportTabs" label="reportTabs">
            <Tabs>
              <Tab>General Check</Tab>
              <Tab>Basic Data Sheet Check</Tab>
              <Tab>Other Sheets Check</Tab>
            </Tabs>
            <TabPanels>
              <TabPanel>
                <AllDataReport sheets={sheets} handlePass={handlePass} />
              </TabPanel>
              <TabPanel>
                <BasicDataReport
                  sheets={sheets}
                  master={master}
                  handlePass={handlePass}
                />
              </TabPanel>
              <TabPanel>
                <OtherDataReport
                  sheets={sheets}
                  master={master}
                  handlePass={handlePass}
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
