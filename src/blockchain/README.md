# Mosaic AI Agent Marketplace - Blockchain Layer

## Overview

Mosaic is a decentralized AI Agent Marketplace that enables users to access, purchase, and utilize AI agents through blockchain-based access control. The platform integrates with **Hedera Hashgraph** for high-performance blockchain operations, **Privy** for seamless wallet authentication, and **Walrus** for enhanced user experience and wallet management.

## Architecture

The blockchain layer consists of smart contracts deployed on Hedera Hashgraph that manage:
- **Access Control**: NFT-based access tokens for AI agents
- **Time-based Permissions**: Expiring access tokens with automatic cleanup
- **User Authentication**: Integration with Privy for wallet management
- **Marketplace Operations**: Secure transactions and agent usage tracking

## Smart Contracts

### AIAccessNFT.sol

**Purpose**: Manages access control to AI agents through time-limited NFT tokens.

**Key Features**:
- **ERC721 Standard**: Implements the standard NFT interface for compatibility
- **Time-based Access**: Each NFT has an expiration timestamp
- **Automatic Cleanup**: Expired NFTs are automatically burned
- **Owner-controlled Minting**: Only the contract owner can mint new access tokens
- **Usage Tracking**: Events emitted for agent usage and expiration

**Core Functions**:

```solidity
// Mint a new access token for a user
function mint(address to, uint256 durationInSeconds) external onlyOwner

// Use an AI agent (validates ownership and expiration)
function useAgent(uint256 tokenId) external
```

**State Variables**:
- `nextTokenId`: Auto-incrementing token ID counter
- `expirationTime`: Mapping of token ID to expiration timestamp

**Events**:
- `AgentUsed(uint256 indexed tokenId, address indexed user)`: Emitted when an agent is successfully used
- `AgentExpiredAndBurned(uint256 indexed tokenId, address indexed user)`: Emitted when an expired token is burned

## Testing

### Test Coverage

The `AIAccessNFT.js` test suite covers:

1. **NFT Minting**: Verifies correct token creation with expiration times
2. **Access Control**: Ensures only token owners can use agents
3. **Expiration Handling**: Tests automatic token burning after expiration
4. **Event Emission**: Validates proper event emission for usage tracking
5. **Security**: Prevents unauthorized access to other users' tokens

### Test Scenarios

```javascript
// Mint NFT with expiration
await nft.mint(user.address, 1000);

// Use agent before expiration
await nft.connect(user).useAgent(0);

// Handle expired tokens
await ethers.provider.send("evm_increaseTime", [2]);
await nft.connect(user).useAgent(0); // Should burn token
```

## Integration Stack

### Hedera Hashgraph
- **High Performance**: Sub-second finality and 10,000+ TPS
- **Low Cost**: Predictable gas fees and cost-effective operations
- **Enterprise Grade**: Built for production applications
- **Consensus**: Asynchronous Byzantine Fault Tolerance (aBFT)

### Privy Integration
- **Wallet Authentication**: Seamless user onboarding
- **Multi-chain Support**: Works across different blockchain networks
- **User Experience**: Simplified wallet management
- **Security**: Enterprise-grade authentication protocols

### Walrus Integration
- **Enhanced UX**: Improved wallet interaction flows
- **Transaction Management**: Better handling of complex transactions
- **Error Handling**: Robust error recovery mechanisms
- **Analytics**: Transaction monitoring and user behavior insights

## Development Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Hardhat development environment

### Installation
```bash
cd src/blockchain
npm install
```

### Compilation
```bash
npx hardhat compile
```

### Testing
```bash
npx hardhat test
```

### Deployment
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## Contract Deployment

The smart contracts are designed to be deployed on Hedera Hashgraph networks:

1. **Testnet**: For development and testing
2. **Mainnet**: For production deployment

### Deployment Configuration
- **Solidity Version**: 0.8.28
- **OpenZeppelin**: Latest version for security and standards
- **Hardhat**: Development and deployment framework

## Security Considerations

### Access Control
- Only contract owner can mint new access tokens
- Users can only use tokens they own
- Automatic token burning prevents expired access

### Gas Optimization
- Efficient storage patterns for expiration times
- Minimal state changes during agent usage
- Optimized event emission

### Audit Trail
- All agent usage is logged via events
- Expiration events provide clear audit trail
- Immutable transaction history on Hedera

## Future Enhancements

### Planned Features
- **Agent Marketplace Contract**: Direct agent purchasing
- **Revenue Sharing**: Automatic payment distribution
- **Agent Rating System**: Community-driven quality assessment
- **Subscription Models**: Recurring access patterns
- **Multi-agent Bundles**: Package deals for multiple agents

### Scalability
- **Layer 2 Integration**: For high-volume operations
- **Batch Operations**: Efficient bulk token management
- **Cross-chain Bridges**: Multi-chain agent access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details

---

**Note**: This blockchain layer is specifically designed for integration with the Mosaic AI Agent Marketplace frontend and backend services. The contracts are optimized for Hedera Hashgraph's unique characteristics and designed to work seamlessly with Privy and Walrus for enhanced user experience.
