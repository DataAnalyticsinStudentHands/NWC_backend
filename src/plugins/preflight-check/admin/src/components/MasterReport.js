import React from "react";
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


const MasterReport = (props) => {
  const {data} = props;
  console.log(data);
  return (
    <Box background="neutral0">
      {data && Object.keys(data).length > 0 && (
        <>
          <Typography variant="beta">
            Lists all discrepancies between the mastersheet and the uploaded file
          </Typography>
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
                  <Typography variant="sigma">Attribute</Typography>
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
                      <Typography textColor="neutral800">{entry.id}</Typography>
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
        </>
      )}
    </Box>
  );
};

export default MasterReport;
