import React, { useState, useContext, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Store } from '../Store';
import { getError } from '../util';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';


function VideoScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { id } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    if (!userInfo) {
      navigate('/')
    }
  }, [])
  
  const myMeeting = async (element) => {
    const appID = 1943191149;
    const serverSecret = "c1c5f6e4455c486dc3655d9190120fbf";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, id, userInfo._id, userInfo.name)
    const zc = ZegoUIKitPrebuilt.create(kitToken)
    zc.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: false,
      showPreJoinView:false,
      onLeaveRoom: (users)=>{
        const myWindow = window.open("/","_self")
        myWindow.close()
      }
    })
  }
  return (
    <div>
      <div ref={myMeeting} />
    </div>
  )
}

export default VideoScreen
