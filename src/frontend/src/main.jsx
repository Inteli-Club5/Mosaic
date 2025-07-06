import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'
import { PrivyProvider } from '@privy-io/react-auth';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <PrivyProvider
      appId="cmcqhej89025fl40mnlf48y6z"
      onSuccess={(user) => console.log(`User ${user.id} logged in!`)}
      config={{
        // Prevent duplicate WalletConnect initialization
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        },
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF'
        },
        // Add error handling
        rpcConfig: {
          rpcUrls: {
            296: 'https://testnet.hashio.io/api', // Hedera Testnet
            11155111: 'https://rpc.sepolia.org'  // Sepolia
          }
        }
      }}
    >
      <App />
    </PrivyProvider>
  </BrowserRouter>,
)
