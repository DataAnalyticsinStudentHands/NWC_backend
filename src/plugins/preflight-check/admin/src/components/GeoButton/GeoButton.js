import { Button } from '@strapi/design-system/Button';
import { Globe } from '@strapi/icons';
import React from 'react';
import getGeoLocation from '../../utils/data_import/utils/getGeoLocation';

export const GeoButton = ({ disabled = false }) => {

  function handleGeo() {
    if (confirm("Do you want to proceed with the geo coding?") == true) {
      getGeoLocation();
    }
  }

  return (
    <>
      <Button
        startIcon={<Globe />}
        onClick={handleGeo}
        disabled={disabled}
      >
        Run Geo Coding
      </Button>
    </>
  );
};
