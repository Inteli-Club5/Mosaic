const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const WALRUS_AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const WALRUS_PUBLISHER = "https://publisher.walrus-testnet.walrus.space";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !RPC_URL) {
    console.error("Error: CONTRACT_ADDRESS or PRIVATE_KEY not defined in environment variables. Check your .env file.");
    process.exit(1); 
}

const CONTRACT_ABI = process.env.CONTRACT_ABI;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const aiAccessMarketplace = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Mosaic AI Agent Marketplace API is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({
        version: '1.0.0',
        endpoints: {
            walrusStoreBlob: '/api/walrus/blobs (POST)',
            walrusReadBlob: '/api/walrus/blobs/:blobId (GET)',
            publishNFTMetadata: '/api/nft/publish (POST)'
        }
    });
});

async function storeWalrusBlob(data) {
    try {
        const response = await fetch(`${WALRUS_PUBLISHER}/v1/blobs`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain' 
            },
            body: data
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            throw new Error(`HTTP error during publishing: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();

        if (result.newlyCreated && result.newlyCreated.blobObject) {
            return result.newlyCreated.blobObject.blobId;
        } else if (result.alreadyCertified) {
            return result.alreadyCertified.blobId;
        } else {
            throw new Error("Unexpected response from Walrus Publisher.");
        }

    } catch (error) {
        console.error("Error in storeWalrusBlob:", error.message);
        throw error; 
    }
}

async function readWalrusBlob(blobId) {
    try {
        const response = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error during reading: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.text();
        return data;

    } catch (error) {
        console.error("Error in readWalrusBlob:", error.message);
        throw error; 
    }
}

app.post('/api/walrus/blobs', async (req, res, next) => {
    try {
        const { data } = req.body;

        if (typeof data !== 'string' || data.trim() === '') {
            return res.status(400).json({ error: 'Invalid input: "data" field must be a non-empty string.' });
        }

        console.log(`Attempting to store data: "${data.substring(0, 50)}..."`);
        const blobId = await storeWalrusBlob(data);
        console.log(`Blob stored, ID: ${blobId}`);

        res.status(201).json({
            message: 'Blob stored successfully',
            blobId: blobId,
            storedDataPreview: data.substring(0, 100) + (data.length > 100 ? '...' : '') 
        });
    } catch (error) {
        next(error);
    }
});

app.get('/api/walrus/blobs/:blobId', async (req, res, next) => {
    try {
        const { blobId } = req.params;

        if (!blobId || typeof blobId !== 'string') {
            return res.status(400).json({ error: 'Invalid input: blobId must be provided in the URL.' });
        }

        console.log(`Attempting to read blob with ID: ${blobId}`);
        const blobContent = await readWalrusBlob(blobId);
        console.log(`Blob content retrieved for ID ${blobId}: "${blobContent.substring(0, 100)}..."`);
        res.status(200).set('Content-Type', 'text/plain').send(blobContent);

    } catch (error) {
        next(error); 
    }
});

app.post('/api/nft/publish', async (req, res, next) => {
    try {
        const { tokenId, metadata } = req.body;
        const blobId = await storeWalrusBlob(metadata);
        console.log(`NFT metadata stored on Walrus, Blob ID: ${blobId}`);
        
        const tx = await aiAccessMarketplace.setTokenMetadataURI(tokenId, blobId);
        await tx.wait(); 
        console.log(`Token metadata URI set on smart contract for tokenId ${tokenId}. Transaction hash: ${tx.hash}`);

        res.status(201).json({
            message: 'NFT metadata published and linked to smart contract successfully',
            tokenId: tokenId,
            walrusBlobId: blobId,
            contractTxHash: tx.hash
        });

    } catch (error) {
        console.error("Error in /api/nft/publish:", error);
        next(error);
    }
});



app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message 
    });
});

app.listen(PORT, () => {
    console.log(`Mosaic API server running on port ${PORT}`);
});

module.exports = app;