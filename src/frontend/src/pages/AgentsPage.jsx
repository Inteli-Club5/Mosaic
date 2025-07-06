import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { cn } from '../lib/utils';
import { InteractiveGridPattern } from '../components/magicui/interactive-grid-pattern';
import Footer from '../components/Footer';
import { usePrivy, useWallets } from "@privy-io/react-auth";
import HeaderPrivy from '../components/HeaderPrivy';
import walrusService from '../services/walrusService';


const AgentsPage = () => {

    const { user } = usePrivy();
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'orchestrator', text: 'Hello! I am the orchestrator agent. Tell me what is your problem and I can recomend you a (or more) AI agent that could help you.' }
    ]);
    
    const [newMessage, setNewMessage] = useState('');
    const [showAgents, setShowAgents] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        sortBy: 'recent'
    });
    const [userFilters, setUserFilters] = useState({
        category: '',
        sortBy: 'recent'
    });

    const [agents, setAgents] = useState([]);
    const [agentBlobIds, setAgentBlobIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPageOther, setCurrentPageOther] = useState(1);
    const [currentPageUser, setCurrentPageUser] = useState(1);
    const [agentsPerPage] = useState(6); // Number of agents per page

    const navigate = useNavigate();
    const { user } = usePrivy();
    const { wallets } = useWallets();

    // Global registry sharing state
    const [registryInfo, setRegistryInfo] = useState(null);
    const [newRegistryBlobId, setNewRegistryBlobId] = useState('');
    const [showRegistrySharing, setShowRegistrySharing] = useState(false);

    // Load agent blob IDs from global registry and fetch agent data
    useEffect(() => {
        const loadAgents = async () => {
            try {
                setLoading(true);
                
                // Get all agent blob IDs from the global registry (visible to all users)
                const globalBlobIds = await walrusService.getAllAgentBlobIds();
                console.log('Global agent blob IDs:', globalBlobIds);
                setAgentBlobIds(globalBlobIds);

                // Fetch agent data from Walrus for each blob ID
                const agentPromises = globalBlobIds.map(async (blobId) => {
                    try {
                        const agentData = await walrusService.getAgentData(blobId);
                        return { ...agentData, blobId };
                    } catch (error) {
                        console.error(`Error fetching agent with blob ID ${blobId}:`, error);
                        return null;
                    }
                });

                const agentResults = await Promise.all(agentPromises);
                const validAgents = agentResults.filter(agent => agent !== null);
                console.log('Loaded agents from global registry:', validAgents);
                setAgents(validAgents);
            } catch (error) {
                setError('Failed to load agents');
                console.error('Error loading agents:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAgents();
    }, []);

    // Load registry sharing info
    useEffect(() => {
        const loadRegistryInfo = async () => {
            const info = await walrusService.getRegistrySharingInfo();
            setRegistryInfo(info);
        };
        loadRegistryInfo();
    }, [agents]);

    // Handle adding a shared registry
    const handleAddSharedRegistry = async () => {
        if (!newRegistryBlobId.trim()) {
            alert('Please enter a valid registry blob ID');
            return;
        }

        const success = await walrusService.addSharedRegistry(newRegistryBlobId.trim());
        if (success) {
            alert('Registry added successfully! Refreshing agents...');
            setNewRegistryBlobId('');
            
            // Refresh agents from the updated registry
            const globalBlobIds = await walrusService.getAllAgentBlobIds();
            setAgentBlobIds(globalBlobIds);
            
            const agentPromises = globalBlobIds.map(async (blobId) => {
                try {
                    const agentData = await walrusService.getAgentData(blobId);
                    return { ...agentData, blobId };
                } catch (error) {
                    console.error(`Error fetching agent with blob ID ${blobId}:`, error);
                    return null;
                }
            });
            
            const agentResults = await Promise.all(agentPromises);
            const validAgents = agentResults.filter(agent => agent !== null);
            setAgents(validAgents);
            
            // Update registry info
            const info = await walrusService.getRegistrySharingInfo();
            setRegistryInfo(info);
        } else {
            alert('Failed to add registry. Please check the blob ID and try again.');
        }
    };

    // Listen for new agents created and refresh from global registry
    useEffect(() => {
        const handleNewAgent = async (event) => {
            const { blobId } = event.detail;
            console.log('New agent created:', blobId);
            
            // Fetch the new agent data and add to current agents
            try {
                const agentData = await walrusService.getAgentData(blobId);
                const newAgent = { ...agentData, blobId };
                setAgents(prev => [...prev, newAgent]);
                console.log('Added new agent to current list:', newAgent);
            } catch (error) {
                console.error('Error fetching new agent data:', error);
                // If we can't fetch the specific agent, refresh all agents from global registry
                setTimeout(async () => {
                    const globalBlobIds = await walrusService.getAllAgentBlobIds();
                    setAgentBlobIds(globalBlobIds);
                    
                    const agentPromises = globalBlobIds.map(async (id) => {
                        try {
                            const data = await walrusService.getAgentData(id);
                            return { ...data, blobId: id };
                        } catch (err) {
                            console.error(`Error fetching agent ${id}:`, err);
                            return null;
                        }
                    });
                    
                    const agentResults = await Promise.all(agentPromises);
                    const validAgents = agentResults.filter(agent => agent !== null);
                    setAgents(validAgents);
                }, 1000);
            }
        };

        window.addEventListener('newAgentCreated', handleNewAgent);
        return () => window.removeEventListener('newAgentCreated', handleNewAgent);
    }, []);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
      
        const userMessage = newMessage; // captura valor atual
      
        // Adiciona mensagem do usuário à UI
        setChatMessages(prev => [
          ...prev,
          { id: prev.length + 1, sender: 'user', text: userMessage }
        ]);
      
        setNewMessage('');
      
        try {
          const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: userMessage,
              wallet: user?.wallet?.address // se usar Privy
            }),
          });
      
          if (!response.ok) throw new Error('Erro na resposta do servidor');
      
          const data = await response.json();
      
          setChatMessages(prev => [
            ...prev,
            { id: prev.length + 1, sender: 'orchestrator', text: data.message || data.reply }
          ]);
        } catch (error) {
          console.error('Erro:', error);
          setChatMessages(prev => [
            ...prev,
            { id: prev.length + 1, sender: 'orchestrator', text: 'Erro ao comunicar com o servidor.' }
          ]);
        }
      };
      
      
      

    // Helper function to check if agent is owned by current user
    const isAgentOwnedByUser = (agent) => {
        if (!user || !agent) return false;
        
        const userWallet = wallets.length > 0 ? wallets[0].address : null;
        
        return (
            agent.createdBy === user.id ||
            agent.ownerEmail === user.email?.address ||
            (userWallet && agent.ownerWallet === userWallet)
        );
    };

    // Separate agents into user-owned and others
    const userAgents = agents.filter(agent => isAgentOwnedByUser(agent));
    const otherAgents = agents.filter(agent => !isAgentOwnedByUser(agent));

    // Filter and sort other agents (first grid)
    const filteredOtherAgents = otherAgents.filter(agent => {
        const matchesSearch = !searchTerm || 
            agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filters.category || agent.category === filters.category;
        return matchesSearch && matchesCategory;
    });

    const sortedOtherAgents = [...filteredOtherAgents].sort((a, b) => {
        switch (filters.sortBy) {
            case 'price-low':
                return parseFloat(a.price) - parseFloat(b.price);
            case 'price-high':
                return parseFloat(b.price) - parseFloat(a.price);
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return new Date(b.createdAt) - new Date(a.createdAt); // Most recent first
        }
    });

    // Filter and sort user agents (second grid)
    const filteredUserAgents = userAgents.filter(agent => {
        const matchesSearch = !userSearchTerm || 
            agent.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            agent.description.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            agent.category.toLowerCase().includes(userSearchTerm.toLowerCase());
        const matchesCategory = !userFilters.category || agent.category === userFilters.category;
        return matchesSearch && matchesCategory;
    });

    const sortedUserAgents = [...filteredUserAgents].sort((a, b) => {
        switch (userFilters.sortBy) {
            case 'price-low':
                return parseFloat(a.price) - parseFloat(b.price);
            case 'price-high':
                return parseFloat(b.price) - parseFloat(a.price);
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return new Date(b.createdAt) - new Date(a.createdAt); // Most recent first
        }
    });

    // Pagination calculations
    const totalOtherAgents = sortedOtherAgents.length;
    const totalUserAgents = sortedUserAgents.length;
    const totalPagesOther = Math.ceil(totalOtherAgents / agentsPerPage);
    const totalPagesUser = Math.ceil(totalUserAgents / agentsPerPage);

    // Get current page agents
    const indexOfLastOtherAgent = currentPageOther * agentsPerPage;
    const indexOfFirstOtherAgent = indexOfLastOtherAgent - agentsPerPage;
    const currentOtherAgents = sortedOtherAgents.slice(indexOfFirstOtherAgent, indexOfLastOtherAgent);

    const indexOfLastUserAgent = currentPageUser * agentsPerPage;
    const indexOfFirstUserAgent = indexOfLastUserAgent - agentsPerPage;
    const currentUserAgents = sortedUserAgents.slice(indexOfFirstUserAgent, indexOfLastUserAgent);

    // Pagination handlers
    const handlePageChangeOther = (page) => {
        setCurrentPageOther(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageChangeUser = (page) => {
        setCurrentPageUser(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Generate page numbers for pagination
    const generatePageNumbers = (currentPage, totalPages) => {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        
        return pages;
    };

    // Reset pagination when filters change
    React.useEffect(() => {
        setCurrentPageOther(1);
    }, [filters, searchTerm]);

    React.useEffect(() => {
        setCurrentPageUser(1);
    }, [userFilters, userSearchTerm]);

    return (
        <div className="agents-page">
            <HeaderPrivy />
            <div className="container">
                <h1>AI Agents Marketplace</h1>
                
                {/* Global Registry Sharing Section */}
                <div className="registry-sharing-section">
                    <div className="registry-info">
                        <h3>🌍 Global Registry</h3>
                        <p>Total agents in global registry: <strong>{registryInfo?.totalAgents || 0}</strong></p>
                        <button 
                            className="btn-secondary" 
                            onClick={() => setShowRegistrySharing(!showRegistrySharing)}
                        >
                            {showRegistrySharing ? 'Hide' : 'Share'} Registry
                        </button>
                    </div>
                    
                    {showRegistrySharing && (
                        <div className="registry-sharing-form">
                            <div className="sharing-section">
                                <h4>Share Your Registry</h4>
                                <p>Share this blob ID with other users to let them see your agents:</p>
                                <div className="registry-blob-id">
                                    <input 
                                        type="text" 
                                        value={registryInfo?.currentRegistryBlobId || 'No registry created yet'} 
                                        readOnly 
                                        className="registry-input"
                                    />
                                    <button 
                                        className="btn-primary"
                                        onClick={() => {
                                            navigator.clipboard.writeText(registryInfo?.currentRegistryBlobId || '');
                                            alert('Registry blob ID copied to clipboard!');
                                        }}
                                        disabled={!registryInfo?.currentRegistryBlobId}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                            
                            <div className="adding-section">
                                <h4>Add Another User's Registry</h4>
                                <p>Enter a registry blob ID shared by another user:</p>
                                <div className="registry-blob-id">
                                    <input 
                                        type="text" 
                                        value={newRegistryBlobId}
                                        onChange={(e) => setNewRegistryBlobId(e.target.value)}
                                        placeholder="Enter registry blob ID here..."
                                        className="registry-input"
                                    />
                                    <button 
                                        className="btn-primary"
                                        onClick={handleAddSharedRegistry}
                                        disabled={!newRegistryBlobId.trim()}
                                    >
                                        Add Registry
                                    </button>
                                    {chatMessages.some(m => m.requiresNft) && (
                                        <div className="chat-followup-options">
                                            <button onClick={handleContinueWithAgent}>✅ Continue with Agent</button>
                                            <button onClick={handleExploreOthers}>🔁 Explore other options</button>
                                        </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters Section */}
                <section className={`agents-grid-section ${showAgents ? 'show' : ''}`}>
                    <div className="container bg-white rounded-t-3xl shadow-lg">
                        <div className="px-6 py-4">
                        <h2>Discover Agents</h2>
                        <br/>
                        {/* Search and Filters for Other Agents */}
                        <div className="filters-section">
                            <div className="filters-top">
                                <div className="search-input-container">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search agents..."
                                        className="filters-search-input"
                                    />
                                    <div className="search-icon">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                <select 
                                    value={filters.category} 
                                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                                >
                                    <option value="">All Categories</option>
                                    <option value="Data Analysis">Data Analysis</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Development">Development</option>
                                    <option value="Design">Design</option>
                                </select>
                                
                                <select 
                                    value={filters.sortBy} 
                                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="price-low">Lowest Price</option>
                                    <option value="price-high">Highest Price</option>
                                    <option value="name">Name A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Other Agents Grid */}
                        <div className="agents-grid">
                            {loading && (
                                <div className="loading-message">
                                    <div className="loading-spinner"></div>
                                    <p>Loading agents from Walrus...</p>
                                </div>
                            )}
                            
                            {error && (
                                <div className="error-message">
                                    <p>❌ {error}</p>
                                </div>
                            )}
                            
                            {!loading && !error && totalOtherAgents === 0 && (
                                <div className="empty-message">
                                    <p>No agents from other users found.</p>
                                </div>
                            )}

                            {!loading && !error && currentOtherAgents.map(agent => (
                                <div key={agent.blobId} className="agent-card">
                                    <div className="agent-card-header">
                                        <div className="agent-avatar">{agent.avatar}</div>
                                        <div className="agent-main-info">
                                            <h3 className="agent-name">
                                                {agent.name}
                                                <span className="verified-badge">✓</span>
                                            </h3>
                                            <div className="agent-category">{agent.category}</div>
                                        </div>
                                    </div>

                                    <p className="agent-description">{agent.description}</p>

                                    <div className="agent-footer">
                                        <div className="agent-price">USDC {agent.price}/hour</div>
                                        <div className="agent-created">
                                            {new Date(agent.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <button 
                                        className="btn-view-profile"
                                        onClick={() => navigate(`/agents/${agent.blobId}`)}
                                    >
                                        View Agent
                                    </button>
                                </div>
                            ))}
                        </div>
                        {/* Dynamic Pagination for Other Agents */}
                        {totalPagesOther > 1 && (
                            <div className="pagination">
                                <button 
                                    className="btn-page"
                                    onClick={() => handlePageChangeOther(currentPageOther - 1)}
                                    disabled={currentPageOther === 1}
                                >
                                    ←
                                </button>
                                
                                {generatePageNumbers(currentPageOther, totalPagesOther).map((page, index) => (
                                    <button
                                        key={index}
                                        className={`btn-page ${page === currentPageOther ? 'active' : ''}`}
                                        onClick={() => page !== '...' && handlePageChangeOther(page)}
                                        disabled={page === '...'}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button 
                                    className="btn-page"
                                    onClick={() => handlePageChangeOther(currentPageOther + 1)}
                                    disabled={currentPageOther === totalPagesOther}
                                >
                                    →
                                </button>
                            </div>
                        )}
                        
                        {/* Show pagination info */}
                        {totalOtherAgents > 0 && (
                            <div className="pagination-info">
                                <p>
                                    Showing {indexOfFirstOtherAgent + 1}-{Math.min(indexOfLastOtherAgent, totalOtherAgents)} of {totalOtherAgents} agents
                                </p>
                            </div>
                        )}
                        <br/>
                        <hr/>
                        <br/>
                        <h2>Your Agents</h2>
                        <br/>
                        
                        {/* Search and Filters for User Agents */}
                        <div className="filters-section">
                            <div className="filters-top">
                                <div className="search-input-container">
                                    <input
                                        type="text"
                                        value={userSearchTerm}
                                        onChange={(e) => setUserSearchTerm(e.target.value)}
                                        placeholder="Search your agents..."
                                        className="filters-search-input"
                                    />
                                    <div className="search-icon">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                <select 
                                    value={userFilters.category} 
                                    onChange={(e) => setUserFilters({...userFilters, category: e.target.value})}
                                >
                                    <option value="">All Categories</option>
                                    <option value="Data Analysis">Data Analysis</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Development">Development</option>
                                    <option value="Design">Design</option>
                                </select>
                                
                                <select 
                                    value={userFilters.sortBy} 
                                    onChange={(e) => setUserFilters({...userFilters, sortBy: e.target.value})}
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="price-low">Lowest Price</option>
                                    <option value="price-high">Highest Price</option>
                                    <option value="name">Name A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* User Agents Grid */}
                        <div className="agents-grid">
                            <div className="create-agent-card" onClick={() => navigate('/create')}>
                                <div className="plus-icon">+</div>
                                <p>Create Agent</p>
                            </div>
                            
                            {!loading && !error && totalUserAgents === 0 && (
                                <div className="empty-message">
                                    <p>You haven't created any agents yet. Create your first agent!</p>
                                </div>
                            )}

                            {!loading && !error && currentUserAgents.map(agent => (
                                                                <div key={agent.blobId} className="agent-card">
                                    <div className="agent-card-header">
                                        <div className="agent-avatar">{agent.avatar}</div>
                                        <div className="agent-main-info">
                                            <h3 className="agent-name">
                                                {agent.name}
                                                <span className="verified-badge">✓</span>
                                                <span className="owner-badge">Mine</span>
                                            </h3>
                                            <div className="agent-category">{agent.category}</div>
                                        </div>
                                    </div>

                                    <p className="agent-description">{agent.description}</p>

                                    <div className="agent-footer">
                                        <div className="agent-price">USDC {agent.price}/hour</div>
                                        <div className="agent-created">
                                            {new Date(agent.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="agent-actions">
                                        <button 
                                            className="btn-view-profile"
                                            onClick={() => navigate(`/agents/${agent.blobId}`)}
                                        >
                                            View Agent
                                        </button>
                                        <button 
                                            className="btn-edit-agent"
                                            onClick={() => navigate(`/edit-agent/${agent.blobId}`)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Dynamic Pagination for User Agents */}
                        {totalPagesUser > 1 && (
                            <div className="pagination">
                                <button 
                                    className="btn-page"
                                    onClick={() => handlePageChangeUser(currentPageUser - 1)}
                                    disabled={currentPageUser === 1}
                                >
                                    ←
                                </button>
                                
                                {generatePageNumbers(currentPageUser, totalPagesUser).map((page, index) => (
                                    <button
                                        key={index}
                                        className={`btn-page ${page === currentPageUser ? 'active' : ''}`}
                                        onClick={() => page !== '...' && handlePageChangeUser(page)}
                                        disabled={page === '...'}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button 
                                    className="btn-page"
                                    onClick={() => handlePageChangeUser(currentPageUser + 1)}
                                    disabled={currentPageUser === totalPagesUser}
                                >
                                    →
                                </button>
                            </div>
                        )}
                                
                        {/* Show pagination info */}
                                {totalUserAgents > 0 && (
                                    <div className="pagination-info">
                                        <p>
                                            Showing {indexOfFirstUserAgent + 1}-{Math.min(indexOfLastUserAgent, totalUserAgents)} of {totalUserAgents} agents
                                        </p>
                                    </div>
                                )}
                                <br/>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AgentsPage; 