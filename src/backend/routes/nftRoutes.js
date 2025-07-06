const express = require('express');
const router = express.Router();
const walrusService = require('../services/walrusService');
const hederaService = require('../services/hederaService');

router.post('/publish', async (req, res, next) => {
    try {
        const { tokenId, metadata } = req.body;
        
        if (!tokenId || !metadata) {
            return res.status(400).json({ error: 'tokenId and metadata are required' });
        }

        const blobId = await walrusService.publishNFTMetadata(tokenId, metadata);
        const txHash = await hederaService.setTokenMetadataURI(tokenId, blobId);

        res.status(201).json({
            message: 'NFT metadata published and linked to smart contract successfully',
            tokenId: tokenId,
            walrusBlobId: blobId,
            contractTxHash: txHash
        });

    } catch (error) {
        console.error("Error in /api/nft/publish:", error);
        next(error);
    }
});

router.post('/mint', async (req, res, next) => {
    try {
        const { to, durationInSeconds } = req.body;
        
        if (!to || !durationInSeconds) {
            return res.status(400).json({ error: 'to address and durationInSeconds are required' });
        }

        const txHash = await hederaService.mintNFT(to, durationInSeconds);

        res.status(201).json({
            message: 'NFT minted successfully',
            to: to,
            durationInSeconds: durationInSeconds,
            transactionHash: txHash
        });

    } catch (error) {
        console.error("Error in /api/nft/mint:", error);
        next(error);
    }
});

router.post('/use/:tokenId', async (req, res, next) => {
    try {
        const { tokenId } = req.params;
        
        if (!tokenId) {
            return res.status(400).json({ error: 'tokenId is required' });
        }

        const txHash = await hederaService.useAgent(tokenId);

        res.status(200).json({
            message: 'Agent used successfully',
            tokenId: tokenId,
            transactionHash: txHash
        });

    } catch (error) {
        console.error("Error in /api/nft/use:", error);
        next(error);
    }
});

router.get('/token/:tokenId', async (req, res, next) => {
    try {
        const { tokenId } = req.params;
        
        if (!tokenId) {
            return res.status(400).json({ error: 'tokenId is required' });
        }

        const [owner, expirationTime] = await Promise.all([
            hederaService.getTokenOwner(tokenId),
            hederaService.getTokenExpiration(tokenId)
        ]);

        res.status(200).json({
            tokenId: tokenId,
            owner: owner,
            expirationTime: expirationTime,
            isExpired: Date.now() > parseInt(expirationTime) * 1000
        });

    } catch (error) {
        console.error("Error in /api/nft/token:", error);
        next(error);
    }
});

module.exports = router; 