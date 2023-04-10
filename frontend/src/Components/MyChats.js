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
import io from 'socket.io-client'
import { Flex, Avatar, Badge } from '@chakra-ui/react'

const ENDPOINT = "http://localhost:5001"
let socket

function MyChats() {
  const { state, selectedChat, setSelectedChat, chats, setChats, fetchAgain, setFetchAgain } = useContext(Store)
  const [loggedUser, setLoggedUser] = useState()
  const { userInfo } = state

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", userInfo)
    socket.on("connected", () => {
    })
  }, [])

  const getSender = (logUser, users) => {
    if (users)
      return users[0]._id === userInfo._id ? users[1] : users[0]
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

  useEffect(() => {
    socket.off("new-chat").on("new-chat", (data, user) => {
      if (data.isGroupChat) {
        setChats([data, ...chats])
      } else {
        setChats([data, ...chats])
      }
    })
  },[socket])

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
                onClick={() => setSelectedChat((prev) => {
                  if (chat.extra) {
                    chat.extra = 0;
                  }
                  return chat
                })}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Flex>
                  <Avatar src={!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)?.pic
                    : chat.chatName} />
                  <Box ml='3'>
                    <Text fontWeight='bold'>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)?.name
                        : chat.chatName}
                      {chat.extra > 0 ? <Badge ml='1' colorScheme='green'>
                        New
                      </Badge> : (<></>)}
                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        {chat.isGroupChat ? <b>{chat.latestMessage.sender.name} </b> : (<></>)}
                        {chat.latestMessage.content.indexOf("base64") !== -1 ? <>
                          <p><i class="bi bi-image" style={{margin:"0 2px"}}></i>Photo</p>
                        </> : chat.latestMessage.content.length > 25
                          ? chat.latestMessage.content.substring(0, 20) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                </Flex>
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
