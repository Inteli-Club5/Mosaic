const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class WalrusService {
    /**
     * Store agent data on Walrus
     * @param {Object} agentData - The agent data to store
     * @returns {Promise<string>} - The blob ID
     */
    async storeAgentData(agentData) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/walrus/blobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: JSON.stringify(agentData)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.blobId;
        } catch (error) {
            console.error('Error storing agent data on Walrus:', error);
            throw error;
        }
    }

    /**
     * Retrieve agent data from Walrus
     * @param {string} blobId - The blob ID to retrieve
     * @returns {Promise<Object>} - The agent data
     */
    async getAgentData(blobId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/walrus/blobs/${blobId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            return JSON.parse(data);
        } catch (error) {
            console.error('Error retrieving agent data from Walrus:', error);
            throw error;
        }
    }

    /**
     * Store NFT metadata on Walrus
     * @param {Object} metadata - The NFT metadata
     * @returns {Promise<string>} - The blob ID
     */
    async storeNFTMetadata(metadata) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/walrus/blobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: JSON.stringify(metadata)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.blobId;
        } catch (error) {
            console.error('Error storing NFT metadata on Walrus:', error);
            throw error;
        }
    }
}

export default new WalrusService(); 