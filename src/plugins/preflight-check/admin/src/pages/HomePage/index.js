import React, { useEffect, useState } from "react";
import * as xlsx from "xlsx";
import {
  BaseHeaderLayout,
  Box,
  Button,
  Typography,
  FieldLabel,
  FieldInput,
  TabGroup,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@strapi/design-system";
// import * as _ from "lodash";
import * as master from "./master.json";
import AllDataReport from "../../components/AllDataReport";
import BasicDataReport from "../../components/BasicDataReport";
import OtherDataReport from "../../components/OtherDataReport";

import preflightRequests from "../../api/preflight";
import { preFlightFile } from "../../utils/data_import/index.js";

const HomePage = () => {
  const [sheets, setSheets] = useState(null);
  const [strapiData, setStrapiData] = useState(null);
  const [isPass, setIsPass] = useState({
    allDataReport: false,
    basicDataReport: false,
    otherDataReport: false,
  });
  const [isVisible, setIsVisible] = useState(false);

  const [importData, setImportData] = useState(null);

  function handleFile(e) {
    e.preventDefault();
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
  useEffect(async () => {
    let result = await preflightRequests.getData();
    setStrapiData(result);
  }, [importData]);

  function handlePass(report) {
    setIsPass((prevState) => ({ ...prevState, ...report }));
  }

  async function handleImportSummary() {
    let result = preFlightFile(sheets, strapiData);
    setImportData(result);

    setIsVisible((prev) => !prev);
  }

  return (
    <Box>
      <Box background="neutral100">
        <BaseHeaderLayout title="Pre-Flight Check" as="h1" />
      </Box>

      {isVisible && (
        <ModalLayout
          onClose={() => setIsVisible((prev) => !prev)}
          labelledBy="title"
        >
          <ModalHeader>
            <Typography
              fontWeight="bold"
              textColor="neutral800"
              as="h2"
              id="title"
            >
              Title
            </Typography>
          </ModalHeader>
          <ModalBody>
            {importData && (
              <Box>
                <Typography variant="alpha" as="h2">
                  The body of this module is still developing
                </Typography>
                {Object.entries(importData.data).map(([key, value], index) => {
                  if (Object.keys(value).length > 0) {
                    return (
                      <Box key={key + index}>
                        <Typography variant="beta" as="h4">
                          {key}
                        </Typography>
                      </Box>
                    );
                  }
                })}
              </Box>
            )}
          </ModalBody>
          <ModalFooter
            startActions={
              <Button
                onClick={() => setIsVisible((prev) => !prev)}
                variant="tertiary"
              >
                Cancel
              </Button>
            }
            endActions={
                <Button
                  onClick={() => {
                    preflightRequests.importData(importData);
                    setIsVisible((prev) => !prev);
                  }}
                >
                  Import
                </Button>
            }
          />
        </ModalLayout>
      )}

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
            <FieldLabel htmlFor="checkFile">
              Upload your "Demographic Data" file. Note that this file must be
              in .xlsx format.
            </FieldLabel>
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
          {isPass.allDataReport &&
            isPass.basicDataReport &&
            isPass.otherDataReport && (
              <Box padding={4} background="neutral100">
                <Button
                  variant="success"
                  // onClick={() => setIsVisible(prev => !prev)}
                  onClick={() => handleImportSummary()}
                >
                  Import Data
                </Button>
              </Box>
            )}
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
