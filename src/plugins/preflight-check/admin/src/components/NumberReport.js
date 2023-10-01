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


const NumberReport = (props) => {
  const {reportData} = props;
  return (
    <Box background="neutral0">
      {reportData?.isNumberData && Object.keys(reportData.isNumberData).length > 0 && (
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
                  <Typography variant="sigma">Row</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Attribute</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Value</Typography>
                </Th>
            </Tr>
            </Thead>
            <Tbody>
              {reportData?.isNumberData && Object.entries(reportData.isNumberData).map(([id, entry]) => {
                return (
                  <Tr key={id}>
                    <Td>
                      <Typography textColor="neutral800">{entry.sheetName}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{entry.rowIndex}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {entry.key}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {entry.errorMessage.split(": ")[1]}
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

export default NumberReport;
