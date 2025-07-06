import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { AGENTS_DATA } from '../constants/agents';
import { cn } from '../lib/utils';
import { InteractiveGridPattern } from '../components/magicui/interactive-grid-pattern';
import HeaderPrivy from '../components/HeaderPrivy';
import Footer from '../components/Footer';

const AgentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = usePrivy();
  const [activeTab, setActiveTab] = useState('overview');
  const [showChatDemo, setShowChatDemo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [purchasedAgents, setPurchasedAgents] = useState(new Set());
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const agent = AGENTS_DATA.find(agent => agent.id === parseInt(id));
  
  // For demo purposes, consider the user owns agents with even IDs
  // In a real app, you'd check against the user's wallet address or user ID
  const isOwner = user && agent && (agent.id % 2 === 0);
  const isPurchased = purchasedAgents.has(agent?.id);

  const handlePurchase = () => {
    if (agent) {
      setPurchasedAgents(prev => new Set([...prev, agent.id]));
      setChatMessages([
        { id: 1, sender: 'agent', text: `Hello! I'm ${agent.name}. I'm ready to help you with ${agent.category.toLowerCase()} tasks. What can I do for you today?` }
      ]);
      setActiveTab('chat');
      console.log('Agent purchased:', agent.name);
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
      }, 1000);
      
      setNewMessage('');
    }
  };

  if (!agent) {
    return (
      <div className="agent-detail-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Agent Not Found</h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>The agent you're looking for doesn't exist.</p>
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

  const averageRating = agent.reviews.reduce((sum, review) => sum + review.rating, 0) / agent.reviews.length;

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
                        {renderStars(agent.rating)}
                        <span className="rating-text">({agent.rating})</span>
                      </div>
                    </div>
                    <p className="agent-description-large">{agent.description}</p>
                    <div className="agent-skills-grid">
                      {agent.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="agent-action-panel">
                  {isOwner ? (
                    <div className="pricing-card">
                      <div className="price-display">
                        USDC ${agent.price}
                      </div>
                      <div className="price-unit">per hour</div>
                      
                      {/* Agent Stats */}
                      <div className="agent-stats">
                        <div className="stat-item">
                          <span className="stat-label">Total Earnings</span>
                          <span className="stat-value">$2,456</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Active Sessions</span>
                          <span className="stat-value">12</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">This Month</span>
                          <span className="stat-value">$485</span>
                        </div>
                      </div>
                      
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
                        USDC ${agent.price}
                      </div>
                      <div className="price-unit">per hour</div>
                      <button
                        onClick={handlePurchase}
                        className="btn-primary btn-full"
                        disabled={isPurchased}
                      >
                        {isPurchased ? 'Access Purchased' : 'Buy Access'}
                      </button>
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
                    <p className="section-description">{agent.longDescription}</p>
                  </div>
                  
                  <div className="overview-section">
                    <h3 className="section-title">Key Features & Capabilities</h3>
                    <div className="simple-features-list">
                      {agent.features.map((feature, index) => (
                        <div key={index} className="simple-feature-item">
                          <h4 className="simple-feature-title">{feature}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="tab-content-reviews">
                  <div className="reviews-header">
                    <h3 className="section-title">Customer Reviews</h3>
                    <div className="reviews-summary">
                      <div className="rating-stars">
                        {renderStars(averageRating)}
                      </div>
                      <span className="rating-summary">
                        {averageRating.toFixed(1)} out of 5 ({agent.reviews.length} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="reviews-list">
                    {agent.reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              {review.user.charAt(0)}
                            </div>
                            <div className="reviewer-details">
                              <h4 className="reviewer-name">{review.user}</h4>
                              <div className="review-rating">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                          <span className="review-date">{review.date}</span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))}
                  </div>
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

              {activeTab === 'stats' && isOwner && (
                <div className="tab-content-stats">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <h3 className="stat-title">Revenue</h3>
                      <div className="stat-value large">$2,456</div>
                      <div className="stat-change positive">+12.5% from last month</div>
                    </div>
                    <div className="stat-card">
                      <h3 className="stat-title">Sessions</h3>
                      <div className="stat-value large">87</div>
                      <div className="stat-change positive">+8 this week</div>
                    </div>
                    <div className="stat-card">
                      <h3 className="stat-title">Avg. Session</h3>
                      <div className="stat-value large">2.4h</div>
                      <div className="stat-change neutral">Same as last month</div>
                    </div>
                    <div className="stat-card">
                      <h3 className="stat-title">Success Rate</h3>
                      <div className="stat-value large">94%</div>
                      <div className="stat-change positive">+2% improvement</div>
                    </div>
                  </div>
                  
                  <div className="performance-section">
                    <h3 className="section-title">Performance Metrics</h3>
                    <div className="metrics-list">
                      <div className="metric-item">
                        <span className="metric-label">Response Time</span>
                        <span className="metric-value">0.8s avg</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Uptime</span>
                        <span className="metric-value">99.2%</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Customer Satisfaction</span>
                        <span className="metric-value">{averageRating.toFixed(1)}/5.0</span>
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
                      <label htmlFor="agent-long-description">Detailed Description</label>
                      <textarea
                        id="agent-long-description"
                        defaultValue={agent.longDescription}
                        className="form-textarea"
                        rows="5"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="agent-price">Price (USDC per hour)</label>
                      <input
                        type="number"
                        id="agent-price"
                        defaultValue={agent.price}
                        className="form-input"
                        step="0.01"
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
                      <label htmlFor="agent-skills">Skills (comma-separated)</label>
                      <input
                        type="text"
                        id="agent-skills"
                        defaultValue={agent.skills.join(', ')}
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
                onClick={() => setShowChatDemo(false)}
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