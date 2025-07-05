import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'
import { PrivyProvider } from '@privy-io/react-auth';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PrivyProvider
      appId="cmcqhej89025fl40mnlf48y6z"
      onSuccess={(user) => console.log(`User ${user.id} logged in!`)}
      >
      <App />
      </PrivyProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
