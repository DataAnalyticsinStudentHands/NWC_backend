import { Button } from "@strapi/design-system/Button";
import React from "react";
import {
  TabGroup,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from "@strapi/design-system";
import { isArray, isObject } from "lodash";
export const ReportList = ({ data }) => {
  return (
    <>
      {isArray(data) ? (
        <ul style={{ listStyle: "disc" }}>
          {data.map((item, index) => {
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
      ) : (
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
                  <ul style={{ listStyle: "disc", marginTop:'24px' }} >
                    {values.map((item, index) => {
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
                </TabPanel>
              );
            })}
          </TabPanels>
        </TabGroup>
      )}
    </>
  );
};
