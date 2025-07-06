const express = require('express');
const router = express.Router();
const walrusService = require('../services/walrusService');
const hederaService = require('../services/hederaService');

router.post('/blobs', async (req, res, next) => {
    try {
        const { data } = req.body;

        if (typeof data !== 'string' || data.trim() === '') {
            return res.status(400).json({ error: 'Invalid input: "data" field must be a non-empty string.' });
        }

        console.log(`Attempting to store data: "${data.substring(0, 50)}..."`);
        const blobId = await walrusService.storeBlob(data);
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

router.get('/blobs/:blobId', async (req, res, next) => {
    try {
        const { blobId } = req.params;

        if (!blobId || typeof blobId !== 'string') {
            return res.status(400).json({ error: 'Invalid input: blobId must be provided in the URL.' });
        }

        console.log(`Attempting to read blob with ID: ${blobId}`);
        const blobContent = await walrusService.readBlob(blobId);
        console.log(`Blob content retrieved for ID ${blobId}: "${blobContent.substring(0, 100)}..."`);
        res.status(200).set('Content-Type', 'text/plain').send(blobContent);

    } catch (error) {
        next(error); 
    }
});

module.exports = router; 