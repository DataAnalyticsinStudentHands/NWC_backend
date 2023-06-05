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

const basicRequired = {
  "Last Name": "last_name",
  "First Name": "first_name",
  State: "represented_state",
};
const BasicDataReport = (props) => {
  const { sheets, master, handlePass } = props;
  const [data, setData] = useState({});

  useEffect(() => {
    setData({});

    const obj = {};
    sheets
      ? sheets["Basic Data"].forEach((row, index) => {
          let id = null;
          master[row["ID"]] ? (id = row["ID"]) : null;
          id
            ? Object.entries(basicRequired).forEach(([key, value]) => {
                // trim strings
                row[key] = _.isString(row[key]) ? row[key].trim() : row[key];
                master[id][value] = _.isString(master[id][value])
                  ? master[id][value].trim()
                  : master[id][value];

                master[id][value] === row[key]
                  ? null
                  : (obj[index + 2] = {
                      id: row["ID"],
                      master: {
                        ...obj[row["ID"]]?.master,
                        [value]: master[id][value],
                      },
                      error: {
                        ...obj[row["ID"]]?.error,
                        [value]: row[key],
                      },
                    });
              })
            : (obj[index + 2] = {
                id: row["ID"],
                master: {
                  err: "ID not found in master",
                },
                error: {
                  id: row["ID"],
                },
              });
        })
      : null;

    setData(obj);
  }, [sheets]);

  useEffect(() => {
    Object.keys(data).length === 0 ? handlePass({'basicDataReport':true}) :handlePass({'basicDataReport':false});
  }, [data]);

  return (
    <Box background="neutral0" padding={4}>
      <Typography variant="alpha">Basic Data Tab Checks</Typography> <br />
      <Typography variant="epsilon">
        Lists all discrepancies between the mastersheet and the columns
        "Participant ID", "Last Name", "First Name", "State"
      </Typography>
      <Box background="neutral0" marginTop={4}>
        {Object.keys(data).length === 0 ? (
          <Typography variant="beta">No errors found</Typography>
        ) : (
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
              {Object.entries(data).map(([row, entry]) => {
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
        )}
      </Box>
    </Box>
  );
};

export default BasicDataReport;
