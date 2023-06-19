import { Box } from '@strapi/design-system/Box';
import { BaseHeaderLayout } from '@strapi/design-system/Layout';
import React from 'react';

export const Header = () => {

  return (
    <Box background="neutral100">
      <BaseHeaderLayout
        title="Pre-Flight Check"
        subtitle="Import Excel data into Strapi"
        as="h2"
      />
    </Box>
  );
};
