import React from "react";
import {
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
import { isObject } from "lodash";
export const ReportTable = ({ data }) => {
  return (
    <TabGroup label="DataTypeCheck" id="CheckFormat" variant="simple">
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
                      <Typography variant="sigma">Participant ID</Typography>
                    </Th>
                    {values[0].errorType && (
                      <Th>
                        <Typography variant="sigma">Error</Typography>
                      </Th>
                    )}
                    <Th>
                      <Typography variant="sigma">
                        Master <br />
                        Sheet
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
                        {value.errorType && (
                          <Td>
                            <Typography textColor="neutral800">
                              {value.errorType}
                            </Typography>
                          </Td>
                        )}
                        <Td>
                          <Typography textColor="neutral800">
                            {value.master}
                            <br />
                            {isObject(value.error)
                              ? Object.entries(value.error).map(
                                  ([key, value], index) => {
                                    return (
                                      <Typography
                                        textColor="neutral800"
                                        key={index}
                                      >
                                        {key}: {value}
                                      </Typography>
                                    );
                                  }
                                )
                              : value.error}
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
  );
};
