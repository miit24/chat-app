import { useEffect, useState, useReducer, useContext } from 'react'
import { Store } from '../Store'
import { toast } from 'react-toastify'
import axios from 'axios'
import { getError } from '../util'
import { Box, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from './ChatLoading'
import GroupChatModal from './GroupChatModal'


function MyChats() {
  const { state, selectedChat, setSelectedChat, chats, setChats,fetchAgain, setFetchAgain } = useContext(Store)
  const [loggedUser, setLoggedUser] = useState()
  const { userInfo } = state

  const getSender = (logUser, users) => {
    return users[0]._id === userInfo._id ? users[1].name : users[0].name
  }

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(`api/chats`, {
          headers: { authorization: `Bearer ${userInfo.token}` }
        })
        setChats(data)
      } catch (err) {
        toast.error(getError(err))
      }
    }
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  }, [fetchAgain])

  return (
    <Box
      style={{ display: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        style={{ display: "flex" }}
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            style={{ display: "flex" }}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        style={{ display: "flex" }}
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats
