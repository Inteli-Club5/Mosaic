const express = require('express');
const cors = require('cors');
require('dotenv').config();

const hederaService = require('./services/hederaService');
const walrusService = require('./services/walrusService');

const walrusRoutes = require('./routes/walrusRoutes');
const nftRoutes = require('./routes/nftRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
    res.json({
        status: 'OK', 
        message: 'Mosaic AI Agent Marketplace API is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Mosaic AI Agent Marketplace API',
        version: '1.0.0',
        endpoints: {
            walrus: {
                storeBlob: '/api/walrus/blobs (POST)',
                readBlob: '/api/walrus/blobs/:blobId (GET)'
            },
            nft: {
                publish: '/api/nft/publish (POST)',
                mint: '/api/nft/mint (POST)',
                use: '/api/nft/use/:tokenId (POST)',
                getToken: '/api/nft/token/:tokenId (GET)'
            }
        }
    });
});

app.use('/api/walrus', walrusRoutes);
app.use('/api/nft', nftRoutes);

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

module.exports = app;