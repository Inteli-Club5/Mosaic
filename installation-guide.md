# 9. Installation Guide

## 9.1. Prerequisites

Before setting up Mosaic locally, ensure you have the following installed on your system:

**Required Software:**
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

**Development Environment:**
- **VS Code** (recommended) with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Solidity (for smart contract development)
  - GitLens (for Git integration)

**Blockchain Setup:**
- **Hedera Testnet Account** - [Create here](https://portal.hedera.com/)
- **MetaMask** or compatible Web3 wallet - [Download here](https://metamask.io/)

**Optional but Recommended:**
- **Docker** - For containerized deployment
- **Postman** - For API testing

## 9.2. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/mosaic.git
cd mosaic

# Verify the project structure
ls -la
```

## 9.3. Additional Steps

### Frontend Setup

```bash
# Navigate to frontend directory
cd src/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure environment variables
echo "VITE_API_BASE_URL=http://localhost:3001" >> .env.local
echo "VITE_HEDERA_NETWORK=testnet" >> .env.local

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend directory (in a new terminal)
cd src/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
echo "PORT=3001" >> .env
echo "HEDERA_ACCOUNT_ID=your_account_id" >> .env
echo "HEDERA_PRIVATE_KEY=your_private_key" >> .env
echo "WALRUS_ENDPOINT=https://walrus-testnet.sui.io" >> .env

# Start backend server
npm start
```

The backend API will be available at `http://localhost:3001`

### Blockchain Setup

```bash
# Navigate to blockchain directory
cd src/blockchain

# Install dependencies
npm install

# Compile smart contracts
npx hardhat compile

# Deploy to testnet
npx hardhat run scripts/deploy.js --network testnet

# Run tests
npx hardhat test
```

### AI Service Setup

```bash
# Navigate to AI directory
cd src/ai

# Install dependencies
npm install

# Create environment file
echo "OPENAI_API_KEY=your_openai_api_key" >> .env

# Start AI service
npm start
``` 