import React, { useState, useContext, useEffect } from 'react'
import { Box, IconButton, useDisclosure } from '@chakra-ui/react';
import { Icon, ViewIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { Button } from '@chakra-ui/react';
import { Store } from '../Store';
import { toast } from 'react-toastify'
import UserBadge from './UserBadge'
import { FormControl } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import axios from 'axios'
import { getError } from '../util';
import UserListItem from './UserListItem';

function UpdateGroupChatModal({ fetchChat }) {
    const { state, dispatch: ctxDispatch, selectedChat, setSelectedChat, chats, setChats, fetchAgain, setFetchAgain } = useContext(Store);
    const { userInfo } = state;
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [admin, setAdmin] = useState(false);

    const handleDelete = async (u) => {
        if (window.confirm(`Do you want to remove ${u.name}`)) {
            try {
                setLoading(true)
                const { data } = await axios.put(`/api/chats/groupremove`, {
                    chatId: selectedChat._id,
                    userId: u._id
                }, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                })
                setLoading(false)
                setSelectedChat(data)
                setFetchAgain(!fetchAgain)
            } catch (err) {
                toast.error(getError(err))
            }
        }
    }

    const handleRename = async () => {
        if (!groupChatName) {
            toast.error("Field is empty")
            return
        }

        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            }
            const { data } = await axios.put(`/api/chats/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)
            setRenameLoading(false)
            setSelectedChat(data)
            setGroupChatName("")
            setFetchAgain(!fetchAgain)// for useEffect
        } catch (err) {
            toast.error(getError(err))
        }
    }


    const handleSearch = async (query) => {
        setSearch(query)
        // console.log(query) eg:ii
        // console.log(search) this would be only i
        if (!query) {
            return
        }
        try {
            setLoading(true)
            const { data } = await axios.get(`api/users?search=${search}`, {
                headers: { authorization: `Bearer ${userInfo.token}` }
            })
            setLoading(false)
            setSearchResult(data)
        } catch (err) {
            toast.error(err)
        }
    }

    const handleRemove = async (user) => {
        if (window.confirm("If you leave the group, than you won't be able to access the chat!")) {
            try {
                setLoading(true)
                const { data } = await axios.put(`/api/chats/groupremove`, {
                    chatId: selectedChat._id,
                    userId: user._id
                }, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                })
                setLoading(false)
                setSelectedChat("")
                setFetchAgain(!fetchAgain)
                fetchChat()
            } catch (err) {
                toast.error(getError(err))
            }
        }
    }

    const handleGroup = async (user) => {
        if (!selectedChat.users.find(c => c._id === user._id)) {
            try {
                setLoading(true)
                const { data } = await axios.put(`/api/chats/groupadd`, {
                    chatId: selectedChat._id,
                    userId: user._id
                }, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                setLoading(false);
                setSelectedChat({ ...selectedChat, users: [...selectedChat.users, user] })
                setFetchAgain(!fetchAgain)
            } catch (err) {
                toast.error(getError(err))
            }
        }
        else {
            toast.error("User Already Present")
        }
    }


    useEffect(() => {
        if (selectedChat.groupAdmin._id === userInfo._id) {
            setAdmin(true)
        }
        else {
            setAdmin(false)
        }
    }, [])

    return (
        <>
            <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <Box style={{ marginLeft: '5%' }}>
                        {
                            selectedChat.users.map(u => {
                                return <UserBadge
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                    admin={admin}
                                />
                            })
                        }
                    </Box>
                    {
                        admin && <ModalBody>
                            <FormControl style={{ display: 'flex' }}>
                                <Input
                                    placeholder="Chat Name"
                                    mb={3}
                                    value={groupChatName}
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                />
                                <Button
                                    variant="solid"
                                    colorScheme="teal"
                                    ml={1}
                                    isLoading={renameloading}
                                    onClick={handleRename}
                                >
                                    Update
                                </Button>
                            </FormControl>
                            <FormControl>
                                <Input
                                    placeholder="Add User to group"
                                    mb={1}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                {
                                    loading ? <ChatLoading num={2} /> : (
                                        searchResult?.slice(0, 2).map(user => {
                                            return (<UserListItem
                                                key={user._id}
                                                user={user}
                                                handleFunction={() => handleGroup(user)}
                                            />)
                                        })
                                    )
                                }
                            </FormControl>
                        </ModalBody>
                        // : ({})
                    }

                    <ModalFooter>
                        <Button onClick={() => handleRemove(userInfo)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal
