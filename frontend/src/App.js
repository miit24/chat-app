import './App.css';
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useLocation, Link, Route, Routes, Router, useNavigate } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpScreen from './screens/OtpScreen';
import QrModal from './Components/QrModal';
import Scanner from './Components/Scanner';
import VideoScreen from './screens/VideoScreen';

function App() {

  return (
    <div className="App">
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>
      <Routes>
        <Route path='/' element={<HomeScreen />} />
        <Route path='/chat' element={<ChatScreen />} />
        <Route path='/otp' element={<OtpScreen />} />
        <Route path='/linkdevice' element={<QrModal />} />
        <Route path='/scanner' element={<Scanner />} />
        <Route path='/video/:id' element={<VideoScreen />} />
      </Routes>
    </div>
  );
}

export default App;
