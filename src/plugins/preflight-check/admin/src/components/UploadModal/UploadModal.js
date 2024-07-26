import './style.css';

import { Flex } from '@strapi/design-system/Flex';
import { ModalBody, ModalHeader, ModalLayout } from '@strapi/design-system/ModalLayout';
import { Portal } from '@strapi/design-system/Portal';
import { Typography } from '@strapi/design-system/Typography';
import IconFile from '@strapi/icons/File';
import React, { useState } from 'react';
import * as xlsx from "xlsx";

export const UploadModal = ({ onClose,  setSheets, setFile}) => {

  const [labelClassNames, setLabelClassNames] = useState('plugin-ie-import_modal_input-label');

  const onReadFile = (e) => {
    const file = e.target.files[0];
    readFile(file);
    setFile(file);
  };


  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = xlsx.read(data, { type: "array" });
      const sheets = workbook.SheetNames.reduce((acc, sheetName) => {
          acc[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
          return acc;
      }, {});

      setSheets(JSON.stringify(sheets, null, '\t'))
      onClose();
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLabelClassNames([labelClassNames, 'plugin-ie-import_modal_input-label--dragged-over'].join(' '));
  };

  const handleDragLeave = () => {
    setLabelClassNames(labelClassNames.replaceAll('plugin-ie-import_modal_input-label--dragged-over', ''));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragLeave();
    const file = e.dataTransfer.files[0];
    readFile(file);
  };

  return (
    <Portal>
      <ModalLayout onClose={onClose} labelledBy="title">
        <ModalHeader>
          <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
            Select a file to upload
          </Typography>
        </ModalHeader>
        <ModalBody className="plugin-ie-import_modal_body">
            <Flex>
              <label className={labelClassNames} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
                <span style={{ fontSize: 80 }}>
                  <IconFile />
                </span>
                <Typography style={{ fontSize: '1rem', fontWeight: 500 }} textColor="neutral600" as="p">
                  drag-drop-file
                </Typography>
                <input type="file" accept=".xlsx" hidden="" onChange={onReadFile} />
              </label>
            </Flex>
        </ModalBody>
      </ModalLayout>
    </Portal>
  );
};
