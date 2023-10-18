import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TabGroup,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
} from "@strapi/design-system";
import { ContentLayout } from "@strapi/design-system/Layout";
import { LinkButton } from '@strapi/design-system/v2';
import MasterReport from "../../components/MasterReport";
import FormatReport from "../../components/FormatReport";
import NumberReport from "../../components/NumberReport";
import { Header } from "../../components/Header/Header";
import { InjectedImportButton } from '../../components/InjectedImportButton';
import { ImportButton } from "../../components/ImportButton";
import { checkFormat, checkWithMaser, checkIsNumber } from "../../utils/data_check";

const HomePage = () => {
  const [file, setFile] = useState({});
  const [sheets, setSheets] = useState(null);
  const [reportData, setReportData] = useState(null);
  useEffect(() => {
    setReportData(null);
    const sheetData = JSON.parse(sheets);

    let MasertCheckReport = checkWithMaser(sheetData);
    let formatReportData = checkFormat(sheetData);
    let isNumberReportData = checkIsNumber(sheetData, formatReportData);

    setReportData({
      masterCheck: MasertCheckReport,
      formatData: formatReportData,
      isNumberData: isNumberReportData,
    })
  }, [sheets]);

  const removeFile = () => {
    setFile({});
    setSheets(null);
    setReportData(null);
  };

const showReport = file.name && !_.isEqual(reportData, {
  formatData: [],
  isNumberData: [],
  masterCheck: [],
})
const showImport = file.name && _.isEqual(reportData, {
  formatData: [],
  isNumberData: [],
  masterCheck: [],
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
            { showImport && (
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
                      {
                        reportData?.masterCheck && Object.keys(reportData.masterCheck).length > 0 && (
                          <Tab>Master Check Report</Tab>
                        )
                      }
                      {
                        reportData?.formatData && Object.keys(reportData.formatData).length > 0 && (
                          <Tab>Format Check Report</Tab>
                        )
                      }
                      {
                        reportData?.isNumberData && Object.keys(reportData.isNumberData).length > 0 && (
                          <Tab>Number Check Report</Tab>
                        )
                      }
                    </Tabs>
                    <TabPanels>
                      {
                        reportData?.masterCheck && Object.keys(reportData.masterCheck).length > 0 && (
                          <TabPanel>
                            <MasterReport
                              data={reportData.masterCheck}
                            />
                          </TabPanel>
                        )
                      }
                      {
                        reportData?.formatData && Object.keys(reportData.formatData).length > 0 && (
                          <TabPanel>
                            <FormatReport
                              reportData={reportData}
                            />
                          </TabPanel>
                        )
                      }
                      {
                        reportData?.isNumberData && Object.keys(reportData.isNumberData).length > 0 && (
                          <TabPanel>
                            <NumberReport
                              reportData={reportData}
                            />
                          </TabPanel>
                        )
                      }
                    </TabPanels>
                  </TabGroup>
                </Box>
              )}
            <Box style={{ alignSelf: "stretch" }} background="neutral0" padding="32px" hasRadius={true}>
              <Flex direction="column" alignItems="start" gap={6}>
                <Typography variant="alpha">
                    Resources
                </Typography>
                <Box>
                  <Flex direction="column" alignItems="start" gap={4}>
                    <LinkButton variant="default" href="/uploads/template_8c478f67e9.xlsx">
                     Download Template  
                    </LinkButton>
                  </Flex>
                </Box>
              </Flex>
            </Box>
        </Flex>
    </ContentLayout>
    </>
  );
};

export default HomePage;
