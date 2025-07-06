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
     * @param {Object} metadata - NFT metadata object
     * @returns {Promise<string>} Blob ID
     */
    async storeNFTMetadata(metadata) {
        try {
            const metadataString = JSON.stringify(metadata, null, 2);
            const blobId = await this.storeData(metadataString);
            return blobId;
        } catch (error) {
            console.error('Error storing NFT metadata:', error);
            throw error;
        }
    }

    /**
     * Get the global agent registry or create one if it doesn't exist
     * @returns {Promise<Object>} Global registry object
     */
    async getGlobalAgentRegistry() {
        try {
            // Try to get the current registry blob ID from localStorage (this tracks the latest version)
            let currentRegistryBlobId = localStorage.getItem('currentGlobalRegistryBlobId');
            
            // Also check for any existing registry blob IDs that other users might have shared
            const knownRegistryBlobIds = JSON.parse(localStorage.getItem('knownGlobalRegistryBlobIds') || '[]');
            
            // Try to load from the current registry first
            if (currentRegistryBlobId) {
                try {
                    const registryData = await this.getData(currentRegistryBlobId);
                    const registry = JSON.parse(registryData);
                    console.log('Loaded existing global registry:', registry);
                    return registry;
                } catch (error) {
                    console.warn('Could not load current registry, trying known registries:', error);
                    currentRegistryBlobId = null;
                }
            }
            
            // Try to load from known registry blob IDs
            for (const blobId of knownRegistryBlobIds) {
                try {
                    const registryData = await this.getData(blobId);
                    const registry = JSON.parse(registryData);
                    console.log('Loaded registry from known blob ID:', blobId, registry);
                    
                    // Update current registry to this one
                    localStorage.setItem('currentGlobalRegistryBlobId', blobId);
                    return registry;
                } catch (error) {
                    console.warn(`Could not load registry from blob ID ${blobId}:`, error);
                }
            }
            
            // Create new registry if none exists
            const newRegistry = {
                version: '1.0.0',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                agents: [], // Array of agent blob IDs
                totalAgents: 0,
                description: 'Global Mosaic Agent Registry'
            };
            
            console.log('Created new global registry:', newRegistry);
            return newRegistry;
        } catch (error) {
            console.error('Error getting global agent registry:', error);
            // Return empty registry as fallback
            return {
                version: '1.0.0',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                agents: [],
                totalAgents: 0,
                description: 'Global Mosaic Agent Registry (Fallback)'
            };
        }
    }

    /**
     * Add an agent to the global registry
     * @param {string} agentBlobId - The blob ID of the agent to add
     * @returns {Promise<void>}
     */
    async addAgentToGlobalRegistry(agentBlobId) {
        try {
            // Get current registry
            const registry = await this.getGlobalAgentRegistry();
            
            // Check if agent already exists in registry
            if (!registry.agents.includes(agentBlobId)) {
                registry.agents.push(agentBlobId);
                registry.totalAgents = registry.agents.length;
                registry.lastUpdated = new Date().toISOString();
                
                // Store updated registry
                const registryString = JSON.stringify(registry, null, 2);
                const newRegistryBlobId = await this.storeData(registryString);
                
                // Update the current registry blob ID
                localStorage.setItem('currentGlobalRegistryBlobId', newRegistryBlobId);
                
                // Add this blob ID to known registries so other users can discover it
                const knownRegistryBlobIds = JSON.parse(localStorage.getItem('knownGlobalRegistryBlobIds') || '[]');
                if (!knownRegistryBlobIds.includes(newRegistryBlobId)) {
                    knownRegistryBlobIds.push(newRegistryBlobId);
                    localStorage.setItem('knownGlobalRegistryBlobIds', JSON.stringify(knownRegistryBlobIds));
                }
                
                console.log(`Added agent ${agentBlobId} to global registry. New registry blob ID: ${newRegistryBlobId}`);
                console.log('Registry now contains agents:', registry.agents);
                
                // Share the registry blob ID in console for other users to discover
                console.log(`🌍 SHARE THIS REGISTRY BLOB ID WITH OTHER USERS: ${newRegistryBlobId}`);
            }
        } catch (error) {
            console.error('Error adding agent to global registry:', error);
            // Don't throw error here to prevent agent creation from failing
        }
    }

    /**
     * Get all agent blob IDs from the global registry
     * @returns {Promise<string[]>} Array of agent blob IDs
     */
    async getAllAgentBlobIds() {
        try {
            const registry = await this.getGlobalAgentRegistry();
            return registry.agents || [];
        } catch (error) {
            console.error('Error getting all agent blob IDs:', error);
            return [];
        }
    }

    /**
     * Add a shared registry blob ID from another user
     * @param {string} registryBlobId - The blob ID of a registry shared by another user
     * @returns {Promise<boolean>} True if successfully added and valid
     */
    async addSharedRegistry(registryBlobId) {
        try {
            // Verify the blob ID points to a valid registry
            const registryData = await this.getData(registryBlobId);
            const registry = JSON.parse(registryData);
            
            // Validate registry structure
            if (!registry.agents || !Array.isArray(registry.agents)) {
                throw new Error('Invalid registry structure');
            }
            
            // Add to known registries
            const knownRegistryBlobIds = JSON.parse(localStorage.getItem('knownGlobalRegistryBlobIds') || '[]');
            if (!knownRegistryBlobIds.includes(registryBlobId)) {
                knownRegistryBlobIds.push(registryBlobId);
                localStorage.setItem('knownGlobalRegistryBlobIds', JSON.stringify(knownRegistryBlobIds));
                
                // Update current registry to use this one if it has more agents
                const currentRegistry = await this.getGlobalAgentRegistry();
                if (registry.agents.length > currentRegistry.agents.length) {
                    localStorage.setItem('currentGlobalRegistryBlobId', registryBlobId);
                }
                
                console.log(`Added shared registry ${registryBlobId} with ${registry.agents.length} agents`);
                return true;
            }
            
            return false; // Already known
        } catch (error) {
            console.error('Error adding shared registry:', error);
            return false;
        }
    }

    /**
     * Get registry sharing information for the user
     * @returns {Promise<Object>} Registry sharing info
     */
    async getRegistrySharingInfo() {
        try {
            const currentRegistryBlobId = localStorage.getItem('currentGlobalRegistryBlobId');
            const knownRegistryBlobIds = JSON.parse(localStorage.getItem('knownGlobalRegistryBlobIds') || '[]');
            const registry = await this.getGlobalAgentRegistry();
            
            return {
                currentRegistryBlobId,
                knownRegistryBlobIds,
                totalAgents: registry.agents.length,
                lastUpdated: registry.lastUpdated
            };
        } catch (error) {
            console.error('Error getting registry sharing info:', error);
            return {
                currentRegistryBlobId: null,
                knownRegistryBlobIds: [],
                totalAgents: 0,
                lastUpdated: null
            };
        }
    }
}

export default new WalrusService(); 