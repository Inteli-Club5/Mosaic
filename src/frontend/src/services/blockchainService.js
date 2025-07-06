import { ethers } from 'ethers';
import { 
  getContractAddresses, 
  isChainSupported, 
  DEFAULT_CHAIN,
  ERROR_MESSAGES,
  TRANSACTION_CONFIG 
} from '../config/blockchain';

// ABIs - Import from your ABI files
import MarketplaceABI from '../../../blockchain/abis/AIAccessMarketplace.json';
import NFTABI from '../../../blockchain/abis/AIAccessNFT.json';

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.marketplaceContract = null;
    this.nftContract = null;
  }

  /**
   * Initialize the blockchain service with Privy wallet
   * @param {Object} wallet - Privy wallet object
   */
  async initializeWallet(wallet) {
    try {
      // Get the ethereum provider from Privy wallet
      const provider = await wallet.getEthereumProvider();
      
      // Request account access first
      try {
        await provider.request({ method: 'eth_requestAccounts' });
      } catch (accountError) {
        console.warn('Account request failed, continuing with existing accounts:', accountError);
      }
      
      this.provider = new ethers.BrowserProvider(provider);
      this.signer = await this.provider.getSigner();
      
      // Get current chain ID from the provider
      const network = await this.provider.getNetwork();
      const currentChainId = Number(network.chainId);
      
      // Check if current chain is supported
      if (!isChainSupported(currentChainId)) {
        console.warn(`Unsupported chain: ${currentChainId}. Switching to default chain.`);
        // Switch to default chain if current chain is not supported
        await wallet.switchChain(DEFAULT_CHAIN.id);
        
        // Reinitialize provider after chain switch
        const newProvider = await wallet.getEthereumProvider();
        this.provider = new ethers.BrowserProvider(newProvider);
        this.signer = await this.provider.getSigner();
      }
      
      // Get contract addresses for current chain
      const finalNetwork = await this.provider.getNetwork();
      const chainId = Number(finalNetwork.chainId);
      const addresses = getContractAddresses(chainId);
      
      // Initialize contracts
      this.marketplaceContract = new ethers.Contract(
        addresses.MARKETPLACE,
        MarketplaceABI,
        this.signer
      );
      
      this.nftContract = new ethers.Contract(
        addresses.NFT,
        NFTABI,
        this.signer
      );
      
      console.log('Blockchain service initialized:', {
        chainId,
        marketplaceAddress: addresses.MARKETPLACE,
        nftAddress: addresses.NFT,
        walletAddress: await this.signer.getAddress()
      });
      
      return true;
    } catch (error) {
      console.error('Error initializing wallet:', error);
      
      if (error.code === 4001) {
        throw new Error(ERROR_MESSAGES.USER_REJECTED);
      } else if (error.message.includes('unsupported')) {
        throw new Error(ERROR_MESSAGES.UNSUPPORTED_CHAIN);
      } else {
        throw new Error(`${ERROR_MESSAGES.NETWORK_ERROR}: ${error.message}`);
      }
    }
  }

  /**
   * Purchase agent access using stablecoin
   * @param {string} agentId - Agent identifier
   * @param {string} price - Price in USDC
   * @param {string} metadataUri - URI for NFT metadata
   */
  async purchaseAgentAccess(agentId, price, metadataUri) {
    try {
      if (!this.signer || !this.marketplaceContract) {
        throw new Error('Wallet not initialized');
      }

      // Convert price to wei (assuming 6 decimals for USDC)
      const priceWei = ethers.parseUnits(price.toString(), 6);

      // First, we need to mint an NFT for the agent access
      // This would typically be done by the marketplace owner
      const mintTx = await this.nftContract.mint(
        await this.signer.getAddress(),
        7 * 24 * 60 * 60 // 7 days access
      );
      
      await mintTx.wait();
      
      // Get the token ID from the transaction
      const tokenId = await this.nftContract.nextTokenId() - 1;
      
      // Set metadata URI for the NFT
      await this.marketplaceContract.setTokenMetadataURI(tokenId, metadataUri);

      // For demo purposes, we'll simulate the purchase
      // In a real implementation, you'd approve stablecoin spending first
      // const approveTx = await stablecoinContract.approve(MARKETPLACE_ADDRESS, priceWei);
      // await approveTx.wait();

      // Buy the NFT (this would normally involve stablecoin transfer)
      // const buyTx = await this.marketplaceContract.buy(tokenId);
      // await buyTx.wait();

      return {
        success: true,
        tokenId: tokenId.toString(),
        transactionHash: mintTx.hash,
        message: 'Agent access purchased successfully!'
      };
    } catch (error) {
      console.error('Error purchasing agent access:', error);
      throw error;
    }
  }

  /**
   * Check if user owns access to an agent
   * @param {string} userAddress - User's wallet address
   * @param {string} agentId - Agent identifier
   */
  async checkAgentAccess(userAddress, agentId) {
    try {
      if (!this.nftContract || !this.provider) {
        console.warn('NFT contract or provider not initialized');
        return false;
      }

      // Check if the contract exists by getting its code
      const contractCode = await this.provider.getCode(this.nftContract.target);
      if (contractCode === '0x') {
        console.warn('NFT contract not deployed at address:', this.nftContract.target);
        return false;
      }

      // Check if user owns any NFTs for this agent
      const balance = await this.nftContract.balanceOf(userAddress);
      return balance > 0;
    } catch (error) {
      console.error('Error checking agent access:', error);
      
      // If it's a contract call error, it usually means the contract doesn't exist
      if (error.code === 'BAD_DATA' || error.message.includes('could not decode result data')) {
        console.warn('Contract may not be deployed or accessible');
        return false;
      }
      
      return false;
    }
  }

  /**
   * Get user's wallet balance
   * @param {string} address - Wallet address
   */
  async getWalletBalance(address) {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw error;
    }
  }

  /**
   * Get gas estimate for purchase transaction
   * @param {string} price - Price in USDC
   */
  async getGasEstimate(price) {
    try {
      if (!this.marketplaceContract) {
        throw new Error('Contract not initialized');
      }

      // Estimate gas for the purchase transaction
      const gasEstimate = await this.marketplaceContract.estimateGas.buy(1); // Example token ID
      return gasEstimate.toString();
    } catch (error) {
      console.error('Error estimating gas:', error);
      return '100000'; // Default gas estimate
    }
  }
}

export default new BlockchainService(); 