import { Box } from '@strapi/design-system/Box';
import { Tab, TabGroup, TabPanel, TabPanels, Tabs } from '@strapi/design-system/Tabs';
import { Typography } from '@strapi/design-system/Typography';
import React from 'react';
import { Editor } from '../../../Editor/Editor';

export const ImportEditor = ({file, data, onDataChanged }) => {

  return (
    <>
      <TabGroup label="Import editor" variant="simple">
        <Tabs>
          <Tab>Preview</Tab>
        </Tabs>

        <TabPanels>
          <TabPanel>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 8 }} color="neutral800" paddingTop={4} paddingBottom={4} background="neutral0">
              <Box style={{ display: 'flex', gap: 8 }} paddingTop={2} paddingBottom={2}>
                <Typography fontWeight="bold" as="p">
                  File name :
                </Typography>
                <Typography as="p">{file?.name}</Typography>
              </Box>
              <Editor content={data} onChange={onDataChanged} />
            </Box>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
};
