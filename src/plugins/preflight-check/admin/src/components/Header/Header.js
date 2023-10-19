import { Box } from '@strapi/design-system/Box';
import { BaseHeaderLayout } from '@strapi/design-system/Layout';
import React from 'react';

export const Header = () => {

  return (
    <Box background="neutral100">
      <BaseHeaderLayout
        title="Demographics Data Check"
        subtitle="Based on Master Sheet: IDCodeRangesMaster_V1_NBY_2023-02-27"
        as="h2"
      />
    </Box>
  );
};
