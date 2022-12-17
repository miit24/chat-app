import React, { useState, useContext } from 'react'
import { Store } from '../Store'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

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
      <SingleChat/>
    </Box>
  )
}

export default ChatBox
