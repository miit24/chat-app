import axios from 'axios';
import React from 'react'
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { Box } from '@chakra-ui/layout'
import SideDrawer from '../Components/SideDrawer';
import MyChats from '../Components/MyChats';
import ChatBox from '../Components/ChatBox';
import { Helmet } from "react-helmet-async";


function ChatScreen() {
    
    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state


    useEffect(() => {
        if (!userInfo) {
            navigate('/')
        }
    }, [userInfo])

    return (
        <div style={{ width: "100%" }}>
            <Helmet>
                <title>ChatPage</title>
            </Helmet>
            {userInfo && <SideDrawer />}
            <Box style={{ display: "flex", alignItem: "space-between", justifyContent: "space-between" }}
                w='100%'
                h='91.5vh'
                p="10px"
            >
                {userInfo && <MyChats />}
                {userInfo && <ChatBox />}
            </Box>
        </div>
    )
}

export default ChatScreen
