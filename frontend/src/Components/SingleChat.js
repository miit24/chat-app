import { Box, Text } from '@chakra-ui/react';
import React, { useState, useContext } from 'react'
import { Store } from '../Store';
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal"
import UpdateGroupChatModal from './UpdateGroupChatModal';



function SingleChat() {
    const { state, dispatch: ctxDispatch, selectedChat, setSelectedChat, chats, setChats } = useContext(Store);
    const { userInfo } = state;
    const getSender = (users) => {
        if(users)
            return users[0]._id === userInfo._id ? users[1].name : users[0].name  
    }
    const getUserAll = (users) =>{
        return users[0]._id === userInfo._id ? users[1] : users[0]
    }

    return (
        <Box style={{height:'100%'}}>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Work sans"
                            d="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            {
                                !selectedChat.isGroupChat ? (
                                    <>
                                        {getSender(selectedChat.users)}
                                        <ProfileModal
                                            user={getUserAll(selectedChat.users)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal/>
                                    </>
                                )
                            }
                        </Text>
                        <Box
                            style={{display:'flex'}}
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="90%"
                            borderRadius="lg"
                            overflowY="hidden">
                            {/* Messages */}
                        </Box>
                    </>
                ) : (
                    <Box style={{ display: 'flex' }} alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </Box>
    )
}

export default SingleChat
