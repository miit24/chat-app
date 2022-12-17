import React, { useContext } from 'react'
import { Center, Box,} from '@chakra-ui/react';
import { Tabs,TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useState } from 'react';
import Login from '../Components/Login';
import Signup from '../Components/Signup';
import { Store } from '../Store';

function HomeScreen() {
  const {state} = useContext(Store)
  
  return (
      <Box>
        <Tabs variant='soft-rounded' colorScheme='blue'>
          <Center m={2}>
            <Tab >Login</Tab>
            <Tab >SignUp</Tab>
          </Center>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
  )
}

export default HomeScreen
