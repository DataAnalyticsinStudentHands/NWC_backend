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
  Flex,
} from "@strapi/design-system";
// import * as _ from "lodash";
import { ContentLayout } from "@strapi/design-system/Layout";

import * as master from "./master.json";
import AllDataReport from "../../components/AllDataReport";
import BasicDataReport from "../../components/BasicDataReport";
// import OtherDataReport from "../../components/OtherDataReport";

import { Header } from "../../components/Header/Header";
import { InjectedImportButton } from '../../components/InjectedImportButton';
import { ImportButton } from "../../components/ImportButton";
import * as masterSheet from "./master.json";
import * as headerSheet from "./sheetHeader.json";

function checkWithMaser(sheetData, master) {

  const basicRequired = {
    "Last Name": "last_name",
    "First Name": "first_name",
    'State': "represented_state",
  };
  const idCheckSheet = [
    "Race & Ethnicity--Reg Forms",
    "Race & Ethnicity--Expanded",
    "Ed & Career",
    "Electoral Politics",
    "Leadership in Org",
    "Organizational & Political",
    "Role at NWC",
    "Position on Planks",
  ];

  const obj = {};
  sheetData && sheetData["Basic Data"] && sheetData["Basic Data"].forEach((row, index) => {
    let id = null;
    master[row["ID"]] ? (id = row["ID"]) : null;
    id ? Object.entries(basicRequired).forEach(([key, value]) => {
        // trim strings
        row[key] = _.isString(row[key]) ? row[key].trim() : row[key];
        master[id][value] = _.isString(master[id][value])
          ? master[id][value].trim()
          : master[id][value];

        master[id][value] !== row[key] && (obj[index + 2] = {
              id: row["ID"],
              row: index + 2,
              master: {
                ...obj[row["ID"]]?.master,
                [value]: master[id][value],
              },
              error: {
                ...obj[row["ID"]]?.error,
                [value]: row[key],
              },
              errorType: "Not match with Master Sheet",
            });
      })
    : (obj[index + 2] = {
        id: row["ID"],
        row: index + 2,
        master: {
          err: "ID not found in master",
        },
        error: {
          id: row["ID"],
        },
      });
  });

  let errorArray = [], array = [];

  sheetData && idCheckSheet.forEach((sheet) => {
      ! Object.keys(sheetData).includes(sheet) &&
        errorArray.push(`${sheet} sheet is not found`);
    })
  sheetData && Object.entries(sheetData).forEach(([sheet, values]) => {

    idCheckSheet.includes(sheet) && values.forEach((row, index) => {
      if (!row["Name"]) return;
      let lastName = row["Name"].split(",")[0];

      master[row["ID"]] && master[row["ID"]].last_name !== lastName && array.push({
            sheet,
            row: index + 2,
            id: row["ID"],
            master: `${master[row["ID"]]?.last_name}`,
            error: lastName,
            errorType: "last_name not match",
          });
    });
  });
  return {
    basicData: obj,
    sheetNameErrs: errorArray,
    participantsNameErrs: _.groupBy(array, "sheet"),
  };

}
function checkFormat(sheetData) {
  const obj = {};
  sheetData && Object.entries(headerSheet).forEach(([sheet, value]) => {
    let keys = [];
    sheetData[sheet]?.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (_.startsWith(key, "Note")) return;
        !keys.includes(key) && keys.push(key);
      });
    });
    _.difference(keys, value.headings).length > 0 && (obj[sheet] = _.difference(keys, value.headings));
  });
  return obj;
}
function checkIsNumber(sheetData, formatCheck) {
  const numberColumnsList = [
    "ID",
    "Birthdate Month",
    "Birthdate Day",
    "Birthdate Year",
    "Age in 1977",
    "Deathdate Month",
    "Deathdate Day",
    "Deathdate Year",
    "Total Population of Place of Residence (check US Census)",
    "Median Household Income of Place of Residence (check US Census)",
    "Total Number of Children (born throughout lifetime)",
    "College: Undergrad year of graduation (if more than one, list all but create new row for each)",
    "College: Graduate/ Professional year of graduation (if more than one, list all but create new row for each)",
    "Start Year for Political Office",
    "End Year for Political Office (if office is still held leave this column blank)",
    "Year of Race that was Lost ",
    "Start Year for Spouse/Partner’s Political Office",
    "End Year for Spouse/Partner’s Political Office (if office is still held leave this column blank)",
    "Votes Received at State Meeting for NWC Delegate/Alternate",
  ];
  let array = [];
  sheetData && Object.entries(sheetData).forEach(([sheet, value]) => {
    if(sheet === "Sources" || sheet === "Questions") return;
    value.forEach((row, index) => {
      Object.entries(row).forEach(([key, value]) => {
        _.isNumber(value)
          ? formatCheck[sheet] && formatCheck[sheet].includes(key)
            ? null // if the heading is not follow the template, ignore the check
            : !numberColumnsList.includes(key)
            ? array.push({
                sheet,
                row: index + 2,
                id: row["ID"],
                error: {
                  [key]: value,
                },
                errorType:" Is Number"
              })
            : null
          : numberColumnsList.includes(key)
          ? array.push({
              sheet,
              row: index + 2,
              id: row["ID"],
              error: {
                [key]: value,
              },
              errorType: "Not Number"
            })
          : null;
      });
    });
  });
  // console.log(array);
  return _.groupBy(array, "sheet");

}


const HomePage = () => {
  const [file, setFile] = useState({});
  const [sheets, setSheets] = useState(null);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const sheetData = JSON.parse(sheets);

    let basicReportData = checkWithMaser(sheetData, masterSheet);
    let formatReportData = checkFormat(sheetData);
    let isNumberReportData = checkIsNumber(sheetData, formatReportData);

    setReportData({
      ...basicReportData,
      formatData: formatReportData,
      isNumberData: isNumberReportData,
    })
  }, [sheets, file]);

  const removeFile = () => {
    setFile({});
    setSheets(null);
    setReportData(null);
  };

const showReport = file.name && !_.isEqual(reportData, {
  basicData: {},
  sheetNameErrs: [],
  participantsNameErrs: {},
  formatData: {},
  isNumberData: {},
})
const showImport = file.name && _.isEqual(reportData, {
  basicData: {},
  sheetNameErrs: [],
  participantsNameErrs: {},
  formatData: {},
  isNumberData: {},
})

  return (
    <>
    <Header />
    <ContentLayout>
        <Flex direction="column" alignItems="start" gap={8}>
          <Box style={{ alignSelf: "stretch" }} background="neutral0" padding="32px" hasRadius={true}>
            <Flex direction="column" alignItems="start" gap={6}>
              <Typography variant="alpha">
                  Quick Actions
              </Typography>
              <Box>
                <Flex direction="column" alignItems="start" gap={4}>
                  <Flex gap={4}>
                    {!file?.name && <InjectedImportButton setSheets={setSheets} setFile={setFile}/>}
                    {
                      file?.name && <Button onClick={removeFile} variant="tertiary">
                        Remove File
                      </Button>
                    }
                    {showImport && <ImportButton data={sheets}/>}
                  </Flex>
                </Flex>
              </Box>
              { file?.name && (
                <Box style={{ display: 'flex', gap: 8 }} paddingTop={2} paddingBottom={2}>
                  <Typography fontWeight="bold" as="p">
                    File name :
                  </Typography>
                  <Typography as="p">{file?.name}</Typography>
                </Box>
              )}
            </Flex>
          </Box>
            {
              showImport && (
                <Box style={{ alignSelf: "stretch" }} background="neutral0" padding="32px" hasRadius={true}>
                  <Typography variant="alpha">
                      This File passed All the checks and ready to import
                  </Typography>
                </Box>
              )
            }
            {
              showReport && (
                <Box style={{ alignSelf: "stretch" }} background="neutral0" padding="32px" hasRadius={true}>
                  <TabGroup id="reportTabs" label="reportTabs">
                    <Tabs>
                      <Tab>General Check</Tab>
                      <Tab>Basic Data Sheet Check</Tab>
                    </Tabs>
                    <TabPanels>
                      <TabPanel>
                        <AllDataReport reportData={reportData} />
                      </TabPanel>
                      <TabPanel>
                        <BasicDataReport
                          reportData={reportData}
                        />
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </Box>
              )}

        </Flex>
    </ContentLayout>
    
    </>
  );
};

export default HomePage;
