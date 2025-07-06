# Mosaic Backend API

## Overview

The Mosaic backend provides a RESTful API for the AI Agent Marketplace, integrating with Hedera blockchain and Walrus storage services.

## Project Structure

```
src/backend/
├── index.js              # Main application entry point
├── services/             # Business logic services
│   ├── hederaService.js  # Hedera blockchain interactions
│   └── walrusService.js  # Walrus storage operations
├── routes/               # API route handlers
│   ├── walrusRoutes.js   # Walrus-related endpoints
│   └── nftRoutes.js      # NFT-related endpoints
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Services

### HederaService (`services/hederaService.js`)

Handles all blockchain interactions with Hedera:

- **setTokenMetadataURI(tokenId, blobId)**: Links NFT metadata to Walrus blob
- **mintNFT(to, durationInSeconds)**: Creates new access tokens
- **useAgent(tokenId)**: Validates and uses agent access
- **getTokenExpiration(tokenId)**: Retrieves token expiration time
- **getTokenOwner(tokenId)**: Gets token owner address

### WalrusService (`services/walrusService.js`)

Manages decentralized storage operations:

- **storeBlob(data)**: Stores data on Walrus network
- **readBlob(blobId)**: Retrieves data from Walrus
- **publishNFTMetadata(tokenId, metadata)**: Publishes NFT metadata

## API Endpoints

### Health Check
- `GET /health` - API status and uptime

### Walrus Operations
- `POST /api/walrus/blobs` - Store data on Walrus
- `GET /api/walrus/blobs/:blobId` - Retrieve data from Walrus

### NFT Operations
- `POST /api/nft/publish` - Publish NFT metadata
- `POST /api/nft/mint` - Mint new access token
- `POST /api/nft/use/:tokenId` - Use agent with token
- `GET /api/nft/token/:tokenId` - Get token information

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
CONTRACT_ADDRESS=your_contract_address
PRIVATE_KEY=your_private_key
RPC_URL=your_hedera_rpc_url
CONTRACT_ABI=your_contract_abi
```

## Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The API will be available at http://localhost:3000
```

## API Response Examples

### Health Check
```json
{
  "status": "OK",
  "message": "Mosaic AI Agent Marketplace API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Store Blob
```json
{
  "message": "Blob stored successfully",
  "blobId": "abc123...",
  "storedDataPreview": "Data preview..."
}
```

### Mint NFT
```json
{
  "message": "NFT minted successfully",
  "to": "0x...",
  "durationInSeconds": 3600,
  "transactionHash": "0x..."
}
```

## Error Handling

All endpoints include proper error handling with:
- Input validation
- Try-catch blocks
- Consistent error response format
- Detailed logging

## Development

The codebase follows a modular architecture:
- **Separation of Concerns**: Business logic in services, routing in routes
- **Reusability**: Services can be imported and used across different routes
- **Maintainability**: Easy to add new features or modify existing ones
- **Testability**: Services can be unit tested independently

## Integration

This backend integrates with:
- **Hedera Hashgraph**: For blockchain operations
- **Walrus**: For decentralized storage
- **Frontend**: React application (port 3001)
- **Blockchain**: Smart contracts for access control 