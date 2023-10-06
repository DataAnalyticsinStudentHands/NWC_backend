import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
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
  const data = props?.reportData.formatData
  return (
    <Box background="neutral0">
      <Box padding={4}>
        <Flex direction="column" alignItems="start" gap={2}>
          <Typography variant="beta">
            This process will not check the sheets of 'Organizational & Political', 'Role at NWC' 
          </Typography>
          <Typography variant="beta">
            The suggestion section is only for reference. Please check the template.
          </Typography>
        </Flex>
      </Box>
      {data && Object.keys(data).length > 0 && (

          <Table colCount={4} rowCount={10}>
            <Thead>
            <Tr>
                <Th>
                  <Typography variant="sigma">Sheet</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">column name</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Suggestion</Typography>
                </Th>
            </Tr>
            </Thead>
            <Tbody>
              {data && Object.entries(data).map(([id, entry]) => {
                return (
                  <Tr key={id}>
                    <Td>
                      <Typography textColor="neutral800">{entry.sheetName}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{entry.attribute}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {entry.suggestion.length > 0
                        ? entry.suggestion.join(";\n")
                        : 'No suggestion can be provided'}
                      </Typography>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
      )}
    </Box>
  );
};

export default FormatReport;
