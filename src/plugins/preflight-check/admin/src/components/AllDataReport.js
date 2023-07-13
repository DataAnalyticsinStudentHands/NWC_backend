import React from "react";
import {
  Box,
  Typography,
  Flex,
} from "@strapi/design-system";

import _ from "lodash";

import { ReportTable } from "./ReportTable";
import { ReportList } from "./ReportList";

const AllDataReport = (props) => {
  const { reportData } = props;
  return (
    <>
      <Flex direction="column" gap={6} alignItems="start">
        {reportData?.sheetNameErrs?.length > 0 && (
          <Box>
            <Typography variant="beta">
              Lists all sheets in the uploaded Excel file that don't match the
              template <br />
              (missing, spelled differently, or additional)
            </Typography>
            <ReportList data={reportData.sheetNameErrs} />
          </Box>
        )}
        {reportData?.formatData && Object.keys(reportData?.formatData).length > 0 && (
          <Box>
            <Typography variant="beta">
              Lists all columns in the uploaded Excel file that are missing from
              the template <br />
              (missing, spelled differently, or additional)
            </Typography>
            <ReportList data={reportData.formatData} />
          </Box>
        )}

        {reportData?.participantsNameErrs && Object.keys(reportData?.participantsNameErrs).length > 0 && (
          <Box>
            <Typography variant="beta">
              Lists all values in the uploaded Excel file that are not match with Master Sheet<br />
              (missing, spelled differently, or additional)
            </Typography>
            <ReportTable data={reportData.participantsNameErrs} />
          </Box>
        )}

        {reportData?.isNumberData && Object.keys(reportData?.isNumberData).length > 0 && (
          <Box>
            <Typography variant="beta">
              Lists all issues with entries where a number is expected (e.g
              "year of graduation")
            </Typography>
            <ReportTable data={reportData.isNumberData} />
          </Box>
        )}
      </Flex>
    </>
  );
};

export default AllDataReport;
