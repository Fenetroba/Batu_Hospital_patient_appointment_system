import { StrictMode } from 'react'
import React from "react";  
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './Context/LanguageContext'
import { Provider } from 'react-redux'
import store from './Stores/Store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
