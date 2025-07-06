import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { cn } from '../lib/utils';
import { InteractiveGridPattern } from '../components/magicui/interactive-grid-pattern';
import HeaderPrivy from '../components/HeaderPrivy';
import Footer from '../components/Footer';
import walrusService from '../services/walrusService';
import blockchainService from '../services/blockchainService';
import agentStatsService from '../services/agentStatsService';
import ReviewSystem from '../components/ReviewSystem';

const AgentDetailPage = () => {
  const { id: blobId } = useParams();
  const navigate = useNavigate();
  const { user, linkWallet, connectWallet } = usePrivy();
  const { wallets } = useWallets();
  const [activeTab, setActiveTab] = useState('overview');
  const [showChatDemo, setShowChatDemo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [purchasedAgents, setPurchasedAgents] = useState(new Set());
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Reviews are now handled by the ReviewSystem component
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [agentStats, setAgentStats] = useState(null);
  const [formattedStats, setFormattedStats] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Fetch agent data from Walrus
  useEffect(() => {
    const fetchAgent = async () => {
      if (!blobId) return;
      
      try {
        setLoading(true);
        setError(null);
        const agentData = await walrusService.getAgentData(blobId);
        setAgent({ ...agentData, blobId });
        setEditForm(agentData);
      } catch (err) {
        console.error('Error fetching agent from Walrus:', err);
        setError('Failed to load agent data');
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [blobId]);

  // Reviews are now handled by the ReviewSystem component

  // Load and track agent stats
  useEffect(() => {
    if (blobId) {
      // Record a view when the page loads
      agentStatsService.recordView(blobId);
      
      // Load current stats
      const stats = agentStatsService.getAgentStats(blobId);
      const formatted = agentStatsService.getFormattedStats(blobId);
      
      setAgentStats(stats);
      setFormattedStats(formatted);
    }
  }, [blobId]);

  // Update stats when reviews change - handled by ReviewSystem component
  // useEffect(() => {
  //   if (blobId && reviews.length > 0) {
  //     agentStatsService.updateReviewStats(blobId, reviews);
  //     
  //     // Refresh formatted stats
  //     const formatted = agentStatsService.getFormattedStats(blobId);
  //     setFormattedStats(formatted);
  //   }
  // }, [blobId, reviews]);

  // Submit new review
  // Review submission is now handled by the ReviewSystem component
  
  // Check if current user owns this agent
  const isOwner = user && agent && (
    user.id === agent.createdBy || 
    user.wallet?.address === agent.ownerWallet ||
    user.email?.address === agent.ownerEmail
  );
  const isPurchased = purchasedAgents.has(agent?.blobId);

  // Check wallet connection and balance
  useEffect(() => {
    const checkWalletStatus = async () => {
      if (wallets.length > 0 && user) {
        try {
          const primaryWallet = wallets[0];
          await blockchainService.initializeWallet(primaryWallet);
          const balance = await blockchainService.getWalletBalance(primaryWallet.address);
          setWalletBalance(balance);
          
          // Check if user already has access to this agent
          const hasAccess = await blockchainService.checkAgentAccess(primaryWallet.address, agent?.blobId);
          if (hasAccess) {
            setPurchasedAgents(prev => new Set([...prev, agent?.blobId]));
          }
        } catch (error) {
          console.error('Error checking wallet status:', error);
        }
      }
    };

    if (agent && wallets.length > 0) {
      checkWalletStatus();
    }
  }, [wallets, agent, user]);

  const handlePurchase = async () => {
    if (!user) {
      alert('Please login first to purchase agent access');
      return;
    }

    if (wallets.length === 0) {
      try {
        await connectWallet();
        return;
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
        return;
      }
    }

    if (!agent) return;

    setIsPurchasing(true);
    
    try {
      const primaryWallet = wallets[0];
      
      // Initialize blockchain service with the wallet
      await blockchainService.initializeWallet(primaryWallet);
      
      // Create NFT metadata for this purchase
      const nftMetadata = {
        name: `${agent.name} Access Pass`,
        description: `Access pass for ${agent.name} - ${agent.description}`,
        image: agent.avatar,
        attributes: [
          { trait_type: "Agent Category", value: agent.category },
          { trait_type: "Access Duration", value: "7 days" },
          { trait_type: "Price Paid", value: `${agent.price} USDC` },
          { trait_type: "Purchase Date", value: new Date().toISOString() }
        ],
        external_url: `walrus://blob/${agent.blobId}`,
        agentDataBlobId: agent.blobId
      };

      // Store NFT metadata on Walrus
      const metadataBlobId = await walrusService.storeNFTMetadata(nftMetadata);
      const metadataUri = `walrus://blob/${metadataBlobId}`;

      // Execute the blockchain purchase
      const purchaseResult = await blockchainService.purchaseAgentAccess(
        agent.blobId,
        agent.price,
        metadataUri
      );

      if (purchaseResult.success) {
        // Record purchase in stats
        agentStatsService.recordPurchase(agent.blobId, parseFloat(agent.price));
        
        // Update local state
        setPurchasedAgents(prev => new Set([...prev, agent.blobId]));
        
        // Refresh formatted stats
        const formatted = agentStatsService.getFormattedStats(agent.blobId);
        setFormattedStats(formatted);
        
        setChatMessages([
          { 
            id: 1, 
            sender: 'agent', 
            text: `Hello! I'm ${agent.name}. I'm ready to help you with ${agent.category.toLowerCase()} tasks. Your access pass NFT (Token ID: ${purchaseResult.tokenId}) has been minted successfully. What can I do for you today?` 
          }
        ]);
        setActiveTab('chat');
        
        // Store purchase in localStorage for persistence
        const purchases = JSON.parse(localStorage.getItem('purchasedAgents') || '[]');
        purchases.push({
          agentId: agent.blobId,
          tokenId: purchaseResult.tokenId,
          transactionHash: purchaseResult.transactionHash,
          purchaseDate: new Date().toISOString(),
          walletAddress: primaryWallet.address
        });
        localStorage.setItem('purchasedAgents', JSON.stringify(purchases));

        alert(`✅ Purchase successful! \n\nTransaction Hash: ${purchaseResult.transactionHash}\nNFT Token ID: ${purchaseResult.tokenId}\n\nYou now have 7 days of access to ${agent.name}!`);
      }
    } catch (error) {
      console.error('Error purchasing agent access:', error);
      
      if (error.message.includes('User rejected')) {
        alert('Transaction was cancelled by user.');
      } else if (error.message.includes('insufficient funds')) {
        alert('Insufficient funds in your wallet. Please add more ETH or USDC.');
      } else if (error.message.includes('Wallet not initialized')) {
        alert('Please connect your wallet first.');
      } else {
        alert(`Purchase failed: ${error.message}\n\nPlease try again or contact support.`);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && agent) {
      const userMessage = { 
        id: chatMessages.length + 1, 
        sender: 'user', 
        text: newMessage 
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      
      // Record response time start
      const responseStart = Date.now();
      
      // Simulate agent response
      setTimeout(() => {
        const responses = [
          `I understand you need help with "${newMessage}". Let me work on that for you.`,
          `Great question! Based on my expertise in ${agent.category.toLowerCase()}, I can help you with that.`,
          `I'm processing your request: "${newMessage}". Give me a moment to provide you with the best solution.`,
          `Perfect! That's exactly the kind of task I excel at. Let me assist you with that.`,
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setChatMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'agent',
          text: randomResponse
        }]);
        
        // Record response time
        const responseTime = Date.now() - responseStart;
        agentStatsService.recordResponseTime(agent.blobId, responseTime);
      }, 1000);
      
      setNewMessage('');
    }
  };

  // Start chat session when chat demo is opened
  const handleOpenChatDemo = () => {
    if (agent && blobId) {
      const sessionId = agentStatsService.startChatSession(blobId);
      setCurrentSessionId(sessionId);
      setShowChatDemo(true);
    }
  };

  // End chat session when chat demo is closed
  const handleCloseChatDemo = () => {
    if (currentSessionId && blobId) {
      // Determine if session was successful (if user sent at least one message)
      const successful = chatMessages.some(msg => msg.sender === 'user');
      agentStatsService.endChatSession(blobId, currentSessionId, successful);
      setCurrentSessionId(null);
    }
    setShowChatDemo(false);
  };

  if (loading) {
    return (
      <div className="agent-detail-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Loading agent from Walrus...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="agent-detail-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {error || 'Agent Not Found'}
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            {error ? 'Failed to load agent data from Walrus.' : 'The agent you\'re looking for doesn\'t exist.'}
          </p>
          <button
            onClick={() => navigate('/agents')}
            className="btn-primary"
          >
            Back to Agents
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }

    return stars;
  };

  const averageRating = agentStats?.averageRating || 5.0; // Get rating from stats service

  return (
    <div className="agent-detail-page">
      <HeaderPrivy />

      {/* Main Content */}
      <div className="agent-detail-content">
        <div className="container">
          {/* Back Button */}
          <button
            onClick={() => navigate('/agents')}
            className="back-button"
          >
            ← Back to Agents
          </button>

          {/* Agent Header */}
          <div className="agent-header-card">
            <div className="agent-header-content">
              <div className="agent-header-main">
                <div className="agent-header-info">
                  <div className="agent-avatar-large">
                    {agent.avatar}
                  </div>
                  <div className="agent-main-details">
                    <div className="agent-title-row">
                      <h1 className="agent-title">{agent.name}</h1>
                    </div>
                    <div className="agent-meta-row">
                      <span className="agent-category-badge">
                        {agent.category}
                      </span>
                      <div className="agent-rating-display">
                        {renderStars(averageRating)}
                        <span className="rating-text">({averageRating.toFixed(1)})</span>
                      </div>
                    </div>
                    <p className="agent-description-large">{agent.description}</p>
                    <div className="agent-skills-grid">
                      {agent.specialties && agent.specialties.length > 0 ? (
                        agent.specialties.map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="skill-tag">General Assistant</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="agent-action-panel">
                  {isOwner ? (
                    <div className="pricing-card">
                      <div className="price-display">
                        USDC {agent.price || '0'}
                      </div>
                      <div className="price-unit">per hour</div>
                      
                      {/* Agent Stats */}
                      {formattedStats && (
                        <div className="agent-stats">
                          <div className="stat-item">
                            <span className="stat-label">Total Earnings</span>
                            <span className="stat-value">{formattedStats.revenue}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Total Views</span>
                            <span className="stat-value">{formattedStats.views}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Sessions</span>
                            <span className="stat-value">{formattedStats.sessions}</span>
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={() => setActiveTab('edit')}
                        className="btn-primary btn-full"
                      >
                        Edit Agent
                      </button>
                      <button
                        onClick={() => {
                          // Handle pause/unpause agent
                          console.log('Toggle agent status');
                        }}
                        className="btn-secondary btn-full"
                      >
                        Pause Agent
                      </button>
                    </div>
                  ) : (
                    <div className="pricing-card">
                      <div className="price-display">
                        USDC {agent.price || '0'}
                      </div>
                      <div className="price-unit">per hour</div>
                      {!user ? (
                        <button
                          onClick={() => navigate('/login')}
                          className="btn-primary btn-full"
                        >
                          Login to Purchase
                        </button>
                      ) : wallets.length === 0 ? (
                        <button
                          onClick={handlePurchase}
                          className="btn-primary btn-full"
                          disabled={isPurchasing}
                        >
                          {isPurchasing ? 'Connecting...' : 'Connect Wallet to Buy'}
                        </button>
                      ) : (
                        <div className="wallet-purchase-section">
                          {walletBalance && (
                            <div className="wallet-info">
                              <p className="wallet-address">
                                {wallets[0]?.address?.slice(0, 6)}...{wallets[0]?.address?.slice(-4)}
                              </p>
                              <p className="wallet-balance">
                                Balance: {parseFloat(walletBalance).toFixed(4)} ETH
                              </p>
                            </div>
                          )}
                          <button
                            onClick={handlePurchase}
                            className="btn-primary btn-full"
                            disabled={isPurchased || isPurchasing}
                          >
                            {isPurchasing 
                              ? 'Processing Payment...' 
                              : isPurchased 
                                ? '✅ Access Purchased' 
                                : `Buy Access for ${agent.price} USDC`
                            }
                          </button>
                        </div>
                      )}
                      <button className="btn-secondary btn-full">
                        Add to Favorites
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="agent-tabs-container">
            <div className="agent-tabs-header">
              <nav className="agent-tabs-nav">
                {(isOwner 
                  ? ['overview', 'reviews', 'stats', 'edit'] 
                  : isPurchased 
                    ? ['overview', 'reviews', 'chat']
                    : ['overview', 'reviews']
                ).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`agent-tab-button ${activeTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="agent-tabs-content">
              {activeTab === 'overview' && (
                <div className="tab-content-overview">
                  <div className="overview-section">
                    <h3 className="section-title">About This Agent</h3>
                    <p className="section-description">{agent.description}</p>
                  </div>
                  
                  {agent.keyFeatures && (
                    <div className="overview-section">
                      <h3 className="section-title">Key Features & Capabilities</h3>
                      <div className="simple-features-list">
                        <div className="simple-feature-item">
                          <h4 className="simple-feature-title">Key Features</h4>
                          <p className="section-description">{agent.keyFeatures}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {agent.specialties && agent.specialties.length > 0 && (
                    <div className="overview-section">
                      <h3 className="section-title">Specialties</h3>
                      <div className="agent-skills-grid">
                        {agent.specialties.map((specialty, index) => (
                          <span key={index} className="skill-tag">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="tab-content-reviews">
                  <ReviewSystem 
                    agentId={blobId}
                    agentName={agent.name}
                    isOwner={isOwner}
                  />
                </div>
              )}

              {activeTab === 'chat' && isPurchased && !isOwner && (
                <div className="tab-content-chat">
                  <div className="chat-section">
                    {/* Modern Chat Container */}
                    <div className="modern-chat-container">
                      {/* Header */}
                      <div className="modern-chat-header">
                        <div className="chat-header-content">
                          <div className="chat-agent-info">
                            <div className="chat-avatar">
                              {agent.avatar}
                            </div>
                            <div className="chat-agent-details">
                              <h3>{agent.name}</h3>
                              <p>{agent.category} • Available Now</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Messages Area */}
                      <div className="modern-chat-messages">
                        <div className="messages-container">
                          {chatMessages.map(message => (
                            <div key={message.id} className={`message-wrapper ${message.sender}`}>
                              <div className={`message-bubble ${message.sender}`}>
                                <p className="message-text">{message.text}</p>
                                <div className={`message-meta ${message.sender}`}>
                                  {message.sender === 'user' ? 'You' : agent.name} • now
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Input Area */}
                      <div className="modern-chat-input">
                        <div className="chat-input-container">
                          <div className="chat-input-wrapper">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder={`Ask ${agent.name} anything...`}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              className="chat-input-field"
                            />
                          </div>
                          <button 
                            onClick={handleSendMessage}
                            className="chat-send-button"
                            disabled={!newMessage.trim()}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stats' && isOwner && formattedStats && (
                <div className="tab-content-stats">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <h3 className="stat-title">Revenue</h3>
                      <div className="stat-value large">{formattedStats.revenue}</div>
                      <div className="stat-change positive">{formattedStats.revenueChange}</div>
                    </div>
                    <div className="stat-card">
                      <h3 className="stat-title">Sessions</h3>
                      <div className="stat-value large">{formattedStats.sessions}</div>
                      <div className="stat-change positive">{formattedStats.sessionsChange}</div>
                    </div>
                    <div className="stat-card">
                      <h3 className="stat-title">Avg. Session</h3>
                      <div className="stat-value large">{formattedStats.averageSession}</div>
                      <div className="stat-change neutral">
                        {formattedStats.sessions > 0 ? 'Active sessions' : 'No sessions yet'}
                      </div>
                    </div>
                    <div className="stat-card">
                      <h3 className="stat-title">Success Rate</h3>
                      <div className="stat-value large">{formattedStats.successRate}</div>
                      <div className="stat-change positive">
                        {formattedStats.completedTasks} completed tasks
                      </div>
                    </div>
                  </div>
                  
                  <div className="performance-section">
                    <h3 className="section-title">Performance Metrics</h3>
                    <div className="metrics-list">
                      <div className="metric-item">
                        <span className="metric-label">Response Time</span>
                        <span className="metric-value">{formattedStats.averageResponseTime} avg</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Uptime</span>
                        <span className="metric-value">{formattedStats.uptime}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Customer Satisfaction</span>
                        <span className="metric-value">{formattedStats.customerSatisfaction}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Total Views</span>
                        <span className="metric-value">{formattedStats.views}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Total Purchases</span>
                        <span className="metric-value">{formattedStats.purchases}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'edit' && isOwner && (
                <div className="tab-content-edit">
                  <div className="edit-form">
                    <h3 className="section-title">Edit Agent Information</h3>
                    
                    <div className="form-group">
                      <label htmlFor="agent-name">Agent Name</label>
                      <input
                        type="text"
                        id="agent-name"
                        defaultValue={agent.name}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="agent-description">Description</label>
                      <textarea
                        id="agent-description"
                        defaultValue={agent.description}
                        className="form-textarea"
                        rows="3"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="agent-key-features">Key Features</label>
                      <textarea
                        id="agent-key-features"
                        defaultValue={agent.keyFeatures || ''}
                        className="form-textarea"
                        rows="3"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="agent-price">Price (USDC per hour)</label>
                      <input
                        type="number"
                        id="agent-price"
                        defaultValue={agent.price || '1'}
                        className="form-input"
                        step="0.01"
                        min="0.01"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="agent-category">Category</label>
                      <select
                        id="agent-category"
                        defaultValue={agent.category}
                        className="form-select"
                      >
                        <option value="AI Assistant">AI Assistant</option>
                        <option value="Data Analysis">Data Analysis</option>
                        <option value="Content Creation">Content Creation</option>
                        <option value="Customer Support">Customer Support</option>
                        <option value="Code Assistant">Code Assistant</option>
                        <option value="Research">Research</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="agent-specialties">Specialties (comma-separated)</label>
                      <input
                        type="text"
                        id="agent-specialties"
                        defaultValue={agent.specialties?.join(', ') || ''}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          // Handle save changes
                          console.log('Saving agent changes');
                          alert('Agent updated successfully!');
                        }}
                      >
                        Save Changes
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => setActiveTab('overview')}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>

      {/* Chat Demo Modal */}
      {showChatDemo && (
        <div className="chat-modal-overlay">
          <div className="chat-modal">
            <div className="chat-modal-header">
              <h3 className="chat-modal-title">Chat with {agent.name}</h3>
              <button
                onClick={handleCloseChatDemo}
                className="chat-modal-close"
              >
                ×
              </button>
            </div>
            <div className="chat-modal-content">
              <div className="chat-message-demo">
                <div className="chat-message-agent">
                  <div className="chat-avatar-small">
                    {agent.avatar}
                  </div>
                  <div className="chat-message-text">
                    <p>
                      Hello! I'm {agent.name}. I specialize in {agent.category.toLowerCase()} and I'm here to help you with your project. How can I assist you today?
                    </p>
                  </div>
                </div>
              </div>
              <div className="chat-input-area">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="chat-input-demo"
                />
                <button className="btn-primary chat-send-demo">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AgentDetailPage; 