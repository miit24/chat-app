import { Box, FormControl, Input, Text } from '@chakra-ui/react';
import React, { useState, useContext, useEffect } from 'react'
import { Store } from '../Store';
import { Spinner } from "@chakra-ui/react";
import ProfileModal from "./ProfileModal"
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from 'axios'
import { toast } from 'react-toastify';
import { getError } from '../util';
import '../index.css'
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import { Avatar } from '@chakra-ui/react';
import { WrapItem } from '@chakra-ui/react';
import audio from '../recieve.mpeg'
import { useRef } from 'react';
import audio1 from '../send.mpeg'
import audio2 from '../notify.mpeg'
import EmojiPicker from 'emoji-picker-react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { Button } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';

const ENDPOINT = "http://localhost:5001"
let socket, compareChat


function SingleChat() {
    const { state, selectedChat, setSelectedChat, chats, setChats } = useContext(Store);
    const { userInfo } = state;
    const [message, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessages] = useState('')
    const sendMessageMusic = new Audio(audio1)
    const [socketConnected, setSocketConnected] = useState(false)
    const recieveMessageMusic = new Audio(audio)
    const notificationMusic = new Audio(audio2)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", userInfo)
        socket.on("connected", () => {
            setSocketConnected(true)
        })
    }, [])

    const fetchChat = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    "authorization": `Bearer ${userInfo.token}`
                }
            }
            setLoading(true)
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
            setMessages(data)
            setLoading(false)
            socket.emit("join-chat", selectedChat._id)

        } catch (error) {
            toast.error(getError(error))
        }
    }

    useEffect(() => {
        fetchChat()
        compareChat = selectedChat._id
    }, [selectedChat])

    const getSender = (users) => {
        if (users) return users[0]._id === userInfo._id ? users[1].name : users[0].name
    }
    const getUserAll = (users) => {
        if (users) return users[0]._id === userInfo._id ? users[1] : users[0]
    }

    const emojiData = (event, emojiObject) => {
        let m = `${newMessage}${event.emoji}`
        setNewMessages(m)
    }

    const handleChange = (e) => {
        setNewMessages(e.target.value);
    };


    const sendChat = async (e) => {
        e.preventDefault();
        if (e.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${userInfo.token}`
                    }
                }

                sendMessageMusic.play()
                setNewMessages("");
                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)
                setMessages([...message, data])
                setChats((prev) => {
                    let old = [...prev]
                    old.forEach(o => {
                        if (o._id === data.chat._id) {
                            o.latestMessage = data
                        }
                    })
                    return [...old];
                })
                socket.emit("send-message", data)

            } catch (error) {
                toast.error(getError(error))
            }
        }
    }

    const sendImage = async (e) => {
        console.log("here0");
        let file = e.target.files[0]
        if (file.size > 75000) {
            toast.error("Image size less than 75KB")
            return
        }
        // if(file.type!=="image.*"){
        //     toast.error("Select Image")
        // }
        // else{
        let reader = new FileReader()
        reader.addEventListener("load", () => {
            console.log("here");
            setNewMessages(reader.result)
        }, false)
        if (file) {

            reader.readAsDataURL(file)
            console.log("here1")
        }
        // }
    }

    useEffect(() => {
        socket.on("receive-message", (data) => {
            if (data.chat._id === compareChat) {
                recieveMessageMusic.play()
                setMessages((prev) => {
                    let old = [...prev]
                    let flag = false;
                    old.forEach(o => {
                        if (o._id === data._id) {
                            flag = true;
                        }
                    })
                    if (!flag) {
                        old.push(data);
                    }
                    return old;
                })
                setChats((prev) => {
                    let old = [...prev]
                    old.forEach(o => {
                        if (o._id === data.chat._id) {
                            o.latestMessage = data
                        }
                    })
                    return [...old];
                })
            } else {
                //notification
                notificationMusic.play()
                setChats((prev) => {
                    let old = [...prev]
                    let c = {}
                    for (let i = 0; i < old.length; i++) {
                        if (old[i]._id === data.chat._id) {
                            old[i].latestMessage = data;
                            c = old[i];
                            break;
                        }
                    }
                    old = old.filter(o => {
                        return o._id != data.chat._id
                    })

                    if (selectedChat._id !== data.chat._id) {
                        c.extra = 1
                    }

                    return [c, ...old]
                })

            }
        })
    },[socket])


    return (
        <Box style={{ height: '100%' }}>
            {
                !!selectedChat ? (
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
                                selectedChat && !selectedChat.isGroupChat ? (
                                    <>
                                        <WrapItem>
                                            <Avatar
                                                name='Prosper Otemuyiwa'
                                                src={getUserAll(selectedChat.users).pic}
                                            />{' '}
                                            <Text
                                                marginLeft="20px"
                                                marginTop="10px"
                                            >
                                                {getSender(selectedChat.users)}
                                            </Text>
                                            <ProfileModal
                                                user={getUserAll(selectedChat.users)}
                                            />
                                        </WrapItem>
                                    </>
                                ) : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal
                                            fetchChat={fetchChat}
                                        />
                                    </>
                                )
                            }
                        </Text>
                        <Box
                            style={{ display: 'flex' }}
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="90%"
                            borderRadius="lg"
                            overflowY="hidden">
                            {loading ? (<Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                                color='green'
                            />) : (
                                <div className='messages'>
                                    <ScrollableChat message={message} />
                                </div>
                            )}
                            <FormControl onKeyPress={(e) => e.key === 'Enter' && sendChat(e)}mt={2}>
                                {
                                    newMessage.length > 0 &&
                                     newMessage.indexOf("base64") !== -1 ?
                                        <Input
                                            type="text"
                                            variant="filled"
                                            bg="#E0E0E0"
                                            placeholder="Enter a message.."
                                            onChange={handleChange}
                                            value={newMessage}
                                        />
                                        :
                                        <Input
                                            type="text"
                                            variant="filled"
                                            bg="#E0E0E0"
                                            placeholder="Enter a message.."
                                            onChange={handleChange}
                                            value={newMessage}
                                        />
                                }
                                <Button onClick={onOpen}>Emoji</Button>
                                <Button onClick={() => {
                                    document.getElementById('imgSel').click()
                                }}>
                                    Upload
                                    <input
                                        type="file"
                                        accept='image/*'
                                        id="imgSel"
                                        onChange={sendImage}
                                        style={{ display: "none" }} />
                                </Button>
                                <Modal isOpen={isOpen} onClose={onClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Emoji</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <div>
                                                <EmojiPicker
                                                    onEmojiClick={emojiData}
                                                />
                                            </div>
                                        </ModalBody>
                                    </ModalContent>
                                </Modal>
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <></>
                )
            }

        </Box>
    )
}

export default SingleChat
