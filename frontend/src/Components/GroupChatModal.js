import React, { useState, useContext } from 'react'
import { Store } from '../Store'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    Input,
    Box,
} from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import axios from 'axios'
import UserListItem from './UserListItem'
import UserBadge from './UserBadge'
import { getError } from '../util';

function GroupChatModal({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const { state, selectedChat, setSelectedChat, chats, setChats } = useContext(Store)
    const { userInfo } = state

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

    const handleGroup = (user) => {
        if (!selectedUsers.find(c => c._id === user._id)) {
            setSelectedUsers([user, ...selectedUsers])
        }
        else {
            toast.error("User Already Present")
        }
    }

    const deleteHandle = (user) => {
        setSelectedUsers(
            selectedUsers.filter(u=>u._id!==user._id)
        )
    }

    const handleSubmit = async () => {
        if(!groupChatName || !selectedUsers)
        {
            toast.error("Fill up the fields")
            return
        }

        try {
            const config = {
                headers : {
                    authorization: `Bearer ${userInfo.token}`
                }
            }

            const {data} = await axios.post(`/api/chats/group`,{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map(u=>u._id))
            },config)
            setChats([data,...chats])
            onClose()
            toast.success("Chat Created")
        } catch (err) {
            toast.error(getError(err))
        }
    }

    return (
        <div>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Input placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)} />
                            <Input placeholder='Add Users'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box w="100%" style={{display:'flex', flexWrap:'wrap'}}>
                            {
                                selectedUsers.map(user => {
                                    return <UserBadge
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => deleteHandle(user)}
                                        admin={TextTrackCueList}
                                    />
                                })
                            }
                        </Box>
                        {
                            loading ? <div>Loading...</div> : (
                                searchResult?.slice(0, 4).map(user => {
                                    return (<UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />)
                                })
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div >
    )
}

export default GroupChatModal
