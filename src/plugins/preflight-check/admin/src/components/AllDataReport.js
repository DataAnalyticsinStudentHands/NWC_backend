import React, { useState, useEffect } from "react";
import {
  Box,
  TabGroup,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@strapi/design-system";

import config from "../config.json";
import _ from "lodash";
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

const AllDataReport = (props) => {
  const { sheets } = props;
  const [formatCheck, setFormatCheck] = useState({});
  const [numberColumns, setNumberColumns] = useState([]);

  useEffect(() => {
    setFormatCheck({});

    let obj = {};
    sheets
      ? Object.entries(config).forEach(([sheet, value]) => {
          let keys = [];
          sheets[sheet]?.forEach((row) => {
            Object.keys(row).forEach((key) => {
              if (_.startsWith(key, "Note")) return;
              keys.includes(key) ? null : keys.push(key);
            });
          });
          _.difference(keys, value.headings).length > 0
            ? (obj[sheet] = _.difference(keys, value.headings))
            : null;
        })
      : null;

    setFormatCheck(obj);
  }, [sheets]);

  useEffect(() => {
    setNumberColumns([]);
    let array = [];
    sheets
      ? Object.entries(sheets).forEach(([sheet, values]) => {
          values.forEach((row, index) => {
            Object.entries(row).forEach(([key, value]) => {
              _.isNumber(value)
                ? formatCheck[sheet] && formatCheck[sheet].includes(key)
                  ? null // if the heading is not follow the template, ignore the check
                  : !numberColumnsList.includes(key)
                  ? array.push({
                      sheet,
                      row: index + 2,
                      id: row["ID"],
                      errorIsNumber: {
                        [key]: value,
                      },
                    })
                  : null
                : numberColumnsList.includes(key)
                ? array.push({
                    sheet,
                    row: index + 2,
                    id: row["ID"],
                    errorNotNumber: {
                      [key]: value,
                    },
                  })
                : null;
            });
          });
        })
      : null;

    setNumberColumns(_.groupBy(array, "sheet"));
  }, [formatCheck]);

  return (
    <>
      <Box background="neutral0" padding={4}>
        <Typography variant="alpha">Column Name Check</Typography> <br />
        <Typography variant="epsilon">
          Lists all columns in the uploaded Excel file that don't match the
          template <br />
          (missing, spelled differently, or additional)
        </Typography>
        <Box background="neutral0" marginTop={4} >
          {formatCheck && Object.keys(formatCheck).length === 0 ? (
            <Typography variant="beta">No issues found</Typography>
          ) : (
            <TabGroup label="ColumnCheck" id="CheckFormat" variant="simple">
              <Tabs>
                {Object.keys(formatCheck).map((sheetName, index) => {
                  return <Tab key={index}>{sheetName}</Tab>;
                })}
              </Tabs>
              <TabPanels>
                {Object.values(formatCheck).map((sheet, index) => {
                  return (
                    <TabPanel key={index}>
                      <Box padding={4}>
                        <ul style={{ listStyle: "disc" }}>
                          {sheet.map((item, index) => {
                            return (
                              <li
                                key={index}
                                style={{
                                  marginBottom: "24px",
                                  marginLeft: "32px",
                                }}
                              >
                                {item}
                              </li>
                            );
                          })}
                        </ul>
                      </Box>
                    </TabPanel>
                  );
                })}
              </TabPanels>
            </TabGroup>
          )}
        </Box>
      </Box>

      <Box background="neutral0" padding={4}>
        <Typography variant="alpha">Data Type Checks</Typography>
        <br />
        <Typography variant="beta">
          Lists all issues with entries where a number is expected (e.g "year of
          graduation")
        </Typography>
        <Box background="neutral0" marginTop={4} >
          {numberColumns && Object.keys(numberColumns).length === 0 ? (
            <Typography variant="beta">No issues found</Typography>
          ) : (
            <TabGroup label="DataTypeCheck" id="CheckFormat" variant="simple">
              <Tabs>
                {Object.keys(numberColumns).map((sheetName, index) => {
                  return <Tab key={index}>{sheetName}</Tab>;
                })}
              </Tabs>
              <TabPanels>
                {Object.values(numberColumns).map((values, index) => {
                  return (
                    <TabPanel key={index}>
                      <Table colCount={4} rowCount={10}>
                        <Thead>
                          <Tr>
                            <Th>
                              <Typography variant="sigma">Row</Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">
                                Participant ID
                              </Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">Error</Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">
                                Column / Value
                              </Typography>
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {Object.entries(values).map(([key, value]) => {
                            return (
                              <Tr key={key}>
                                <Td>
                                  <Typography textColor="neutral800">
                                    {value.row}
                                  </Typography>
                                </Td>
                                <Td>
                                  <Typography textColor="neutral800">
                                    {value.id}
                                  </Typography>
                                </Td>
                                <Td>
                                  <Typography textColor="neutral800">
                                    {value.errorNotNumber
                                      ? "Not a number"
                                      : "Should be a number"}
                                  </Typography>
                                </Td>
                                <Td>
                                  <Typography textColor="neutral800">
                                    {value.errorNotNumber &&
                                      Object.entries(value.errorNotNumber).map(
                                        ([k, v]) => {
                                          return (
                                            <div key={k}>
                                              {k}: <br />
                                              {v}
                                            </div>
                                          );
                                        }
                                      )}
                                    {value.errorIsNumber &&
                                      Object.entries(value.errorIsNumber).map(
                                        ([k, v]) => {
                                          return (
                                            <div key={k}>
                                              {k}: <br />
                                              {v}
                                            </div>
                                          );
                                        }
                                      )}
                                  </Typography>
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TabPanel>
                  );
                })}
              </TabPanels>
            </TabGroup>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AllDataReport;