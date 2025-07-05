const { ethers } = require('ethers');
require('dotenv').config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ABI = process.env.CONTRACT_ABI;

if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !RPC_URL) {
    console.error("Error: CONTRACT_ADDRESS or PRIVATE_KEY not defined in environment variables. Check your .env file.");
    process.exit(1); 
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const aiAccessMarketplace = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

class HederaService {
    constructor() {
        this.provider = provider;
        this.signer = signer;
        this.contract = aiAccessMarketplace;
    }

    async setTokenMetadataURI(tokenId, blobId) {
        try {
            const tx = await this.contract.setTokenMetadataURI(tokenId, blobId);
            await tx.wait();
            console.log(`Token metadata URI set on smart contract for tokenId ${tokenId}. Transaction hash: ${tx.hash}`);
            return tx.hash;
        } catch (error) {
            console.error("Error setting token metadata URI:", error);
            throw error;
        }
    }

    async mintNFT(to, durationInSeconds) {
        try {
            const tx = await this.contract.mint(to, durationInSeconds);
            await tx.wait();
            console.log(`NFT minted for address ${to} with duration ${durationInSeconds} seconds. Transaction hash: ${tx.hash}`);
            return tx.hash;
        } catch (error) {
            console.error("Error minting NFT:", error);
            throw error;
        }
    }

    async useAgent(tokenId) {
        try {
            const tx = await this.contract.useAgent(tokenId);
            await tx.wait();
            console.log(`Agent used for tokenId ${tokenId}. Transaction hash: ${tx.hash}`);
            return tx.hash;
        } catch (error) {
            console.error("Error using agent:", error);
            throw error;
        }
    }

    async getTokenExpiration(tokenId) {
        try {
            const expirationTime = await this.contract.expirationTime(tokenId);
            return expirationTime.toString();
        } catch (error) {
            console.error("Error getting token expiration:", error);
            throw error;
        }
    }

    async getTokenOwner(tokenId) {
        try {
            const owner = await this.contract.ownerOf(tokenId);
            return owner;
        } catch (error) {
            console.error("Error getting token owner:", error);
            throw error;
        }
    }
}

module.exports = new HederaService(); 