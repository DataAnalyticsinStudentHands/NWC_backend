import { Button } from '@strapi/design-system/Button';
import Upload from '@strapi/icons/Upload';
import React, { useState } from 'react';
import { preFlightFile } from '../../utils/data_import';
export const ImportButton = ({data}) => {

  function handleImport() {
    preFlightFile(data);

    // Still working in Process ...
  }

  return (
    <>
      <Button startIcon={<Upload />} onClick={handleImport}>
        Import Data
      </Button>
    </>
  );
};
