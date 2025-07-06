const express = require('express');
const cors = require('cors');
const path = require('path');
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
        version: '1.0.0',
        timestamp: new Date().toISOString(),
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

// Serve static files from frontend build in production
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '../frontend/dist');
    
    console.log('📁 Serving static files from:', frontendBuildPath);
    app.use(express.static(frontendBuildPath));
    
    // Catch-all handler for SPA routing
    app.get('*', (req, res) => {
        // If it's an API route, return 404
        if (req.path.startsWith('/api')) {
            res.status(404).json({
                error: 'API endpoint not found',
                path: req.originalUrl
            });
        } else {
            // Serve the React app's index.html for all other routes
            res.sendFile(path.join(frontendBuildPath, 'index.html'));
        }
    });
} else {
    // Development mode - only handle API routes
    app.use('*', (req, res) => {
        res.status(404).json({
            error: 'Endpoint not found',
            path: req.originalUrl,
            message: 'In development mode, frontend runs on separate port (5173)'
        });
    });
}

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