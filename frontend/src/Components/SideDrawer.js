import { useState, useContext, useEffect, useReducer } from "react";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import ProfileModal from "./ProfileModal";
import { toast } from 'react-toastify';
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { getError } from '../util';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import UserListItem from "./UserListItem";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Store } from "../Store";
import ChatLoading from './ChatLoading'

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, searchResult: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "FETCH_CHAT":
      return { ...state, loadingChat: true };
    case "FETCH_CHAT_SUCCESS":
      return { ...state, loadingChat: false };
    default:
      return state;
  }
};

function SideDrawer() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();//chakra UI
  const { state, dispatch: ctxDispatch, selectedChat, setSelectedChat, chats, setChats } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, searchResult, error, loadingChat }, dispatch] = useReducer(reducer, {
    loading: true,
    searchResult: [],
    error: '',
    loadingChat: true,
  });

  const logOutHandler = () => {
    ctxDispatch({ type: 'USER_LOGOUT' })
    localStorage.removeItem('userInfo')
    setSelectedChat({})
    setChats([])
    toast.success("logout successfully")
    navigate('/')
  }

  const searchHandler = async () => {
    if (!search) {
      toast.error("Enter keywords")
      return
    }
    try {
      dispatch({ type: 'FETCH_REQUEST' })
      const { data } = await axios.get(`api/users?search=${search}`, {
        headers: { authorization: `Bearer ${userInfo.token}` }
      })
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      toast.error(error)
    }
  }

  const accessChat = async (userId) => {
    try {
      dispatch({ type: 'FETCH_CHAT' })
      const { data } = await axios.post(`api/chats`, {
        userId
      }, {
        'Content-type': 'application/json',
        headers: { authorization: `Bearer ${userInfo.token}` }
      })

      // console.log(data)
      // if the resultant chat is not found in our current chat than only we will append it
      if (!chats.find(c => c._id === data._id)) setChats([data,...chats])

      dispatch({ type: 'FETCH_CHAT_SUCCESS' })
      setSelectedChat(data)
      onClose() //closing the side drawer
    } catch (err) {
      toast.error(getError(err))
    }
  }

  return (
    <>
      <Box
        style={{ display: "flex", alignItem: "space-between", justifyContent: "space-between" }}
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end" style={{ alignItem: "center" }}>
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <div>
          {/* <div>
          {/* <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu> */}
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={userInfo.name}
                src={userInfo.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={userInfo}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logOutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box style={{ display: "flex" }} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={searchHandler}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {/* {loadingChat && <Spinner ml="auto" d="flex" />} */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer
