// Blockchain Configuration for Privy Integration

// Network Configuration
export const SUPPORTED_CHAINS = {
  HEDERA_TESTNET: {
    id: 296, // Hedera Testnet Chain ID
    name: 'Hedera Testnet',
    network: 'hedera-testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'HBAR',
      symbol: 'HBAR',
    },
    rpcUrls: {
      default: {
        http: ['https://testnet.hashio.io/api'],
      },
      public: {
        http: ['https://testnet.hashio.io/api'],
      },
    },
    blockExplorers: {
      default: { name: 'HashScan', url: 'https://hashscan.io/testnet' },
    },
    testnet: true,
  },
  SEPOLIA: {
    id: 11155111,
    name: 'Sepolia',
    network: 'sepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'Ethereum',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.sepolia.org'],
      },
      public: {
        http: ['https://rpc.sepolia.org'],
      },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    },
    testnet: true,
  }
};

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  [SUPPORTED_CHAINS.HEDERA_TESTNET.id]: {
    MARKETPLACE: '0xF74d6d202ebF8d4497d21F52Aca2A759c317305B',
    NFT: '0xcAeFEc77F848504C2559801180d8284B5dBcD86E',
    STABLECOIN: '0x0000000000000000000000000000000000000000', // Update with actual USDC address
  },
  [SUPPORTED_CHAINS.SEPOLIA.id]: {
    MARKETPLACE: '0x0000000000000000000000000000000000000000', // Update if deployed on Sepolia
    NFT: '0x0000000000000000000000000000000000000000', // Update if deployed on Sepolia
    STABLECOIN: '0x0000000000000000000000000000000000000000', // Update with USDC address on Sepolia
  }
};

// Default Chain Configuration
export const DEFAULT_CHAIN = SUPPORTED_CHAINS.HEDERA_TESTNET;

// Privy Configuration
export const PRIVY_CONFIG = {
  appId: import.meta.env.VITE_PRIVY_APP_ID || 'your-privy-app-id',
  config: {
    loginMethods: ['email', 'wallet'],
    appearance: {
      theme: 'dark',
      accentColor: '#676FFF',
      logo: '/logo.png',
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
      noPromptOnSignature: false,
    },
    defaultChain: DEFAULT_CHAIN,
    supportedChains: Object.values(SUPPORTED_CHAINS),
  }
};

// Transaction Configuration
export const TRANSACTION_CONFIG = {
  gasLimit: {
    purchase: '200000',
    mint: '150000',
    approve: '100000',
  },
  gasPrice: {
    slow: '1000000000', // 1 gwei
    standard: '2000000000', // 2 gwei
    fast: '5000000000', // 5 gwei
  }
};

// Token Configuration
export const TOKEN_CONFIG = {
  USDC: {
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  },
  HBAR: {
    decimals: 18,
    symbol: 'HBAR',
    name: 'Hedera Hashgraph',
  }
};

// Helper Functions
export const getContractAddresses = (chainId) => {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[DEFAULT_CHAIN.id];
};

export const getSupportedChain = (chainId) => {
  return Object.values(SUPPORTED_CHAINS).find(chain => chain.id === chainId) || DEFAULT_CHAIN;
};

export const isChainSupported = (chainId) => {
  return Object.values(SUPPORTED_CHAINS).some(chain => chain.id === chainId);
};

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  UNSUPPORTED_CHAIN: 'Please switch to a supported network',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  USER_REJECTED: 'Transaction was rejected by user',
  NETWORK_ERROR: 'Network error. Please check your connection.',
}; 