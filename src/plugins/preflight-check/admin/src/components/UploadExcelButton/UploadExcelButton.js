import { Button } from '@strapi/design-system/Button';
import Upload from '@strapi/icons/Upload';
import React, { useState } from 'react';
import { UploadModal } from '../UploadModal';

export const UploadExcelButton = ({ fullWidth = false,  setSheets, setFile}) => {

  const [importVisible, setImportVisible] = useState(false);

  const openImportModal = () => {
    setImportVisible(true);
  };

  const closeImportModal = () => {
    setImportVisible(false);
  };

  return (
    <>
      <Button startIcon={<Upload />} onClick={openImportModal} fullWidth={fullWidth} >
        Upload Excel File
      </Button>

      {importVisible && <UploadModal onClose={closeImportModal} setSheets={setSheets} setFile={setFile}/>}
    </>
  );
};
