import React, { useState, useContext } from 'react'
import { Store } from '../Store'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';
import { Text } from '@chakra-ui/react';

function ChatBox() {
  const { state, dispatch: ctxDispatch, selectedChat, setSelectedChat, chats, setChats } = useContext(Store);
  const { userInfo } = state;
  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {selectedChat ? <SingleChat /> : (
        <Box style={{display:"flex"}} alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}

    </Box>
  )
}

export default ChatBox
