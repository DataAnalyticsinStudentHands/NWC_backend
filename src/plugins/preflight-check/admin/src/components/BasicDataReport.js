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
} from "@strapi/design-system";
import _ from "lodash";

import { ReportTable } from "./ReportTable";

const basicRequired = {
  "Last Name": "last_name",
  "First Name": "first_name",
  State: "represented_state",
};
const BasicDataReport = (props) => {
  const {reportData} = props;
  return (
    <Box background="neutral0">

        {reportData?.basicData && Object.keys(reportData.basicData).length !== 0 && (
          <>
                <Typography variant="beta">
        Lists all discrepancies between the mastersheet and the columns
        "Participant ID", "Last Name", "First Name", "State"
      </Typography>
          <Table colCount={4} rowCount={10}>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">Row</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Participant ID</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Column</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Data</Typography>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {reportData?.basicData && Object.entries(reportData.basicData).map(([row, entry]) => {
                return (
                  <Tr key={row}>
                    <Td>
                      <Typography textColor="neutral800">{row}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{entry.id}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {Object.keys(entry.master).map((k) => {
                          return <div key={k + "k"}>{k}</div>;
                        })}
                      </Typography>
                    </Td>
                    <Td>

                      <Typography textColor="neutral800">
                        {Object.values(entry.master).map((v) => {
                          return <div key={v + "m"}>{v} [master]</div>;
                        })}
                      </Typography>
                      <Typography textColor="neutral800">
                        {Object.values(entry.error).map((v) => {
                          return <div key={v + "s"}>{v} [sheet]</div>;
                        })}
                      </Typography>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          </>
        )}
    </Box>
  );
};

export default BasicDataReport;
