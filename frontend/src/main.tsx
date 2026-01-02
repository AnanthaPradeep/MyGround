import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import i18n, { initializeLanguage } from './config/i18n' // Initialize i18n
import './index.css'

// Initialize language before rendering app
initializeLanguage().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}).catch((error) => {
  console.error('Failed to initialize language:', error)
  // Render app anyway with default language
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})

