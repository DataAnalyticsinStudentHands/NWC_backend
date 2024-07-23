import React from "react";
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


const MasterReport = (props) => {
  const {data} = props;
  return (
    <Box background="neutral0">
        <Box padding={4}>
          <Flex direction="column" alignItems="start" gap={2}>
            <Typography variant="beta">
              IDs are checked against collection data-idc-master
            </Typography>
          </Flex>
        </Box>
      {data && Object.keys(data).length > 0 && (
          <Table colCount={4} rowCount={10}>
            <Thead>
            <Tr>
                <Th>
                  <Typography variant="sigma">Participant ID</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Sheet</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">column name</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Master !== Sheet</Typography>
                </Th>
            </Tr>
            </Thead>
            <Tbody>
              {data && Object.entries(data).map(([id, entry]) => {
                return (
                  <Tr key={id}>
                    <Td>
                      <Typography textColor="neutral800">{entry.id || 'ID is missing'}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{entry.sheetName}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {entry.key}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {entry.masterValue} !== {entry.sheetValue}
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

export default MasterReport;
