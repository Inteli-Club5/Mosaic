const fetch = require('node-fetch');

const WALRUS_AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const WALRUS_PUBLISHER = "https://publisher.walrus-testnet.walrus.space";

class WalrusService {
    async storeBlob(data) {
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
            console.error("Error in storeBlob:", error.message);
            throw error; 
        }
    }

    async readBlob(blobId) {
        try {
            const response = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error during reading: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.text();
            return data;

        } catch (error) {
            console.error("Error in readBlob:", error.message);
            throw error; 
        }
    }

    async publishNFTMetadata(tokenId, metadata) {
        try {
            const blobId = await this.storeBlob(metadata);
            console.log(`NFT metadata stored on Walrus, Blob ID: ${blobId}`);
            return blobId;
        } catch (error) {
            console.error("Error publishing NFT metadata:", error);
            throw error;
        }
    }
}

module.exports = new WalrusService(); 