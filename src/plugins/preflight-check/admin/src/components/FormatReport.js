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


const FormatReport = (props) => {
  const {reportData} = props;
  return (
    <Box background="neutral0">
      {reportData?.formatData && Object.keys(reportData.formatData).length > 0 && (
        <>
          {/* <Typography variant="beta">
            Lists all discrepancies between the mastersheet and the uploaded file
          </Typography> */}
          <Table colCount={4} rowCount={10}>
            <Thead>
            <Tr>
                <Th>
                  <Typography variant="sigma">Sheet</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Attribute</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Suggestion</Typography>
                </Th>
            </Tr>
            </Thead>
            <Tbody>
              {reportData?.formatData && Object.entries(reportData.formatData).map(([id, entry]) => {
                return (
                  <Tr key={id}>
                    <Td>
                      <Typography textColor="neutral800">{entry.sheetName}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{entry.key}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {entry?.suggestion}
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

export default FormatReport;
