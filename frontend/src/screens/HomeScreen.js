import React, { useContext } from 'react'
import { Center, Box,} from '@chakra-ui/react';
import { Tabs,TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import Login from '../Components/Login';
import Signup from '../Components/Signup';
import { Store } from '../Store';
import Scanner from '../Components/Scanner';

function HomeScreen() {
  const {state} = useContext(Store)
  
  return (
      <Box>
        <Tabs variant='soft-rounded' colorScheme='blue'>
          <Center m={2}>
            <Tab >Login</Tab>
            <Tab >SignUp</Tab>
            <Tab >Link Device</Tab>
          </Center>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
            <TabPanel>
              <Scanner/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
  )
}

export default HomeScreen
