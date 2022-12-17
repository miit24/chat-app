import './App.css';
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useLocation, Link, Route, Routes, Router, useNavigate } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Store } from './Store';

function App() {
  return (
    <div className="App">
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>
      <Routes>
        <Route path='/' element={<HomeScreen />} />
        <Route path='/chat' element={<ChatScreen />} />
      </Routes>
    </div>
  );
}

export default App;
