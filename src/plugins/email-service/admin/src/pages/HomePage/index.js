import React, { memo, useState, useEffect } from 'react';
import {
  Layout, 
  BaseHeaderLayout,
  ContentLayout,
} from "@strapi/design-system/Layout";
import { Stack } from '@strapi/design-system/Stack';
// import pluginId from '../../pluginId';
import { Field, FieldLabel, FieldInput, 
  // FieldHint, FieldError, FieldAction 
} from '@strapi/design-system/Field';
import { Textarea } from '@strapi/design-system/Textarea';
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { Tabs, Tab, TabGroup, TabPanels, TabPanel } from '@strapi/design-system/Tabs';

import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import emailRequests from '../../api/emailservice';
const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [tagInt, setTagInt] = useState(0)
  const [emailFrom, setEmailFrom] = useState("")
  const [emailTo, setEmailTo] = useState("")
  const [emailCC, setEmailCC] = useState("")
  const [emailBCC, setEmailBCC] = useState("")

  const [emailCorrectionsSubject, setEmailCorrectionsSubject] = useState("")
  const [emailCorrectionsText, setEmailCorrectionsText] = useState("")
  const [emailContactUsSubject, setEmailContactUsSubject] = useState("")
  const [emailContactUsText, setEmailContactUsText] = useState("")
  const [emailMoreIdeasSubject, setEmailMoreIdeasSubject] = useState("")
  const [emailMoreIdeasText, setEmailMoreIdeasText] = useState("")
  

  const fetchData = async () =>{
    if (isLoading === false ) setIsLoading(true)

    const emailData = await emailRequests.findEmail()
    setEmailFrom(emailData.data.attributes.emailFrom)
    setEmailTo(emailData.data.attributes.emailTo)
    setEmailCC(emailData.data.attributes.emailCC)
    setEmailBCC(emailData.data.attributes.emailBCC)

    setEmailCorrectionsSubject(emailData.data.attributes.emailCorrectionsSubject)
    setEmailCorrectionsText(emailData.data.attributes.emailCorrectionsText)
    setEmailContactUsSubject(emailData.data.attributes.emailContactUsSubject)
    setEmailContactUsText(emailData.data.attributes.emailContactUsText)
    setEmailMoreIdeasSubject(emailData.data.attributes.emailMoreIdeasSubject)
    setEmailMoreIdeasText(emailData.data.attributes.emailMoreIdeasText)

    setIsLoading(false)
  }

  useEffect(async ()=>{
    await fetchData();
  },[])

  async function updateEmail(data){
    await emailRequests.updateEmail(data);
    await fetchData();
  }

  async function testSend(){
    await emailRequests.sendEmail();
  }

  if(isLoading) return <LoadingIndicatorPage/>;
  return (
    <Layout>
      <BaseHeaderLayout title='Emails' subtitle='Email configuration' as='h2'/>
      <ContentLayout>
      <Stack spacing={4} padding={3}>
        <Box>
        <Field name="emailFrom">
          <Stack spacing={1}>
            <FieldLabel>From</FieldLabel>
            <FieldInput type="text" value={emailFrom} disabled={true}/>
          </Stack>
        </Field>
        <Field name="emailTo">
          <Stack spacing={1}>
            <FieldLabel>To - Test use only </FieldLabel>
            <FieldInput type="text" value={emailTo} onChange={(e)=>{setEmailTo(e.target.value)}}/>
          </Stack>
        </Field>
        <Field name="emailCC">
          <Stack spacing={1}>
            <FieldLabel>CC - Optional</FieldLabel>
            <FieldInput type="text" value={emailCC} onChange={(e)=>{setEmailCC(e.target.value)}}/>
          </Stack>
        </Field>
        <Field name="emailBCC">
          <Stack spacing={1}>
            <FieldLabel>BCC</FieldLabel>
            <FieldInput type="text" value={emailBCC} onChange={(e)=>{setEmailBCC(e.target.value)}}/>
          </Stack>
        </Field>


        <Box paddingTop={5}>
          <TabGroup label="Some stuff for the label" id="tabs" onTabChange={selected =>setTagInt(selected)} initialSelectedTabIndex={tagInt}>
            <Tabs>
              <Tab>Corrections</Tab>
              <Tab>Contact Us</Tab>
              <Tab>Have More Ideas?</Tab>
            </Tabs>
            <TabPanels>
            <TabPanel>
                <Box color="neutral800" padding={4} background="neutral0">
                  <Field name="emailCorrectionsSubject">
                    <Stack spacing={1}>
                      <FieldLabel>Subject</FieldLabel>
                      <FieldInput type="text" value={emailCorrectionsSubject} onChange={(e)=>{setEmailCorrectionsSubject(e.target.value)}}/>
                    </Stack>
                  </Field>
                  <Textarea label="Text" name="emailCorrectionsText" value={emailCorrectionsText} onChange={(e) => {setEmailCorrectionsText(e.target.value)}} />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box color="neutral800" padding={4} background="neutral0">
                  <Field name="emailContactUsSubject">
                    <Stack spacing={1}>
                      <FieldLabel>Subject</FieldLabel>
                      <FieldInput type="text" value={emailContactUsSubject} onChange={(e)=>{setEmailContactUsSubject(e.target.value)}}/>
                    </Stack>
                  </Field>
                  <Textarea label="Text" name="emailContactUsText" value={emailContactUsText} onChange={(e) => {setEmailContactUsText(e.target.value)}} />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box color="neutral800" padding={4} background="neutral0">
                  <Field name="emailMoreIdeasSubject">
                    <Stack spacing={1}>
                      <FieldLabel>Subject</FieldLabel>
                      <FieldInput type="text" value={emailMoreIdeasSubject} onChange={(e)=>{setEmailMoreIdeasSubject(e.target.value)}}/>
                    </Stack>
                  </Field>
                  <Textarea label="Text" name="emailMoreIdeasText" value={emailMoreIdeasText} onChange={(e) => {setEmailMoreIdeasText(e.target.value)}} />
                </Box>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Box>

        </Box>
        <Box>
          <Button variant='default'
            onClick={()=>{
              let data = {}
              data.emailTo = emailTo
              data.emailCC = emailCC
              data.emailBCC = emailBCC
              data.emailCorrectionsSubject = emailCorrectionsSubject
              data.emailCorrectionsText = emailCorrectionsText
              data.emailContactUsSubject = emailContactUsSubject
              data.emailContactUsText = emailContactUsText
              data.emailMoreIdeasSubject = emailMoreIdeasSubject
              data.emailMoreIdeasText = emailMoreIdeasText

              updateEmail(data)
            }}>Save</Button>
        </Box>
        <Box>
          <Button variant='default'
              onClick={()=>testSend()}>Send Test Email</Button>
          </Box>
        </Stack>
      </ContentLayout>
    </Layout>
  );
};

export default memo(HomePage);

