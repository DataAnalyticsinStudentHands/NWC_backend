import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TabGroup,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from "@strapi/design-system";
import _ from "lodash";

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
const BasicDataReport = (props) => {
  const { sheets, master } = props;
  const [data, setData] = useState({});
  const [error, setError] = useState([]);

  useEffect(() => {
    setData({});
    setError([]);
    let array = [],
      errorArray = [];

    sheets
      ? idCheckSheet.forEach((sheet) => {
          Object.keys(sheets).includes(sheet)
            ? null
            : errorArray.push(`${sheet} sheet is not found in the sheets`);
        })
      : null;

    sheets
      ? Object.entries(sheets).forEach(([sheet, values]) => {
          idCheckSheet.includes(sheet) && !values[0]["Name"]
            ? errorArray.push(`${sheet} does not have a Name column`)
            : null;

          idCheckSheet.includes(sheet)
            ? values.forEach((row, index) => {
                if (!row["Name"]) return;
                let lastName = row["Name"].split(",")[0];

                master[row["ID"]] && master[row["ID"]].last_name === lastName
                  ? null
                  : array.push({
                      sheet,
                      row: index + 2,
                      id: row["ID"],
                      master: `${master[row["ID"]]?.last_name}`,
                      error_name: lastName,
                    });
              })
            : null;
        })
      : null;
    setError(errorArray);
    setData(_.groupBy(array, "sheet"));
  }, [sheets]);

  return (
    <Box>
      <Typography variant="alpha">ID - Name Check</Typography> <br />
      <Typography variant="beta">
        Lists all entries where the ID or/and the Name field do not match
        according to the mastersheet
      </Typography>
      {error.length === 0 && Object.keys(data).length === 0 ? (
        <Typography variant="beta">No errors found</Typography>
      ) : (
        <Box>
          <Box padding={4}>
            <ul style={{ listStyle: "disc" }}>
              {error.map((item, index) => {
                return (
                  <li
                    key={index}
                    style={{ marginBottom: "24px", marginLeft: "32px" }}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </Box>

          <TabGroup label="CheckFormat" id="CheckFormat" variant="simple">
            <Tabs>
              {Object.keys(data).map((sheetName, index) => {
                return <Tab key={index}>{sheetName}</Tab>;
              })}
            </Tabs>
            <TabPanels>
              {Object.values(data).map((values, index) => {
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
                            <Typography variant="sigma">Master</Typography>
                          </Th>
                          <Th>
                            <Typography variant="sigma">Sheet</Typography>
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
                                  {value.master}
                                </Typography>
                              </Td>
                              <Td>
                                <Typography textColor="neutral800">
                                  {value.error_name}
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
        </Box>
      )}
    </Box>
  );
};

export default BasicDataReport;
