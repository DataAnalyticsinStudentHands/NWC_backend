import { Button } from '@strapi/design-system/Button';
import Upload from '@strapi/icons/Upload';
import React from 'react';
import { importDemographicData } from '../../utils/data_import';
export const ImportButton = ({data}) => {

  function handleImport() {
    if (confirm("Do you want to proceed with the import?") == true) {
      importDemographicData(data);
    }
  }

  return (
    <>
      <Button startIcon={<Upload />} onClick={handleImport}>
        Import Data
      </Button>
    </>
  );
};
