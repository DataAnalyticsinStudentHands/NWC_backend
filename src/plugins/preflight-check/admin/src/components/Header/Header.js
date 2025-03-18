import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import { BaseHeaderLayout } from '@strapi/design-system/Layout';
import React from 'react';

export const Header = () => {

  return (
    <Box background="neutral100">
      <BaseHeaderLayout
        title="Demographics Data Check"
        subtitle="Checks and imports after passing"
        as="h2"
      />
    </Box>
  );
};
