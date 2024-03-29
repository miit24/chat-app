import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { StoreProvider } from './Store';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <HelmetProvider>
      <BrowserRouter>
        <StoreProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </StoreProvider>
      </BrowserRouter>
    </HelmetProvider>
);


