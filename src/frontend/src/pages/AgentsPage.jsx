import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { AGENTS_DATA } from '../constants/agents';

const AgentsPage = () => {
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'orchestrator', text: 'Hello! I am the orchestrator agent. I can help you find the perfect agent for your needs. What are you looking for?' }
    ]);
    
    const [newMessage, setNewMessage] = useState('');
    const [showAgents, setShowAgents] = useState(false);
    
    const [filters, setFilters] = useState({
        category: '',
        minPrice: 0,
        maxPrice: 500,
        minRating: 0,
        sortBy: 'popularity'
    });



    const navigate = useNavigate();

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setChatMessages([...chatMessages, { 
                id: chatMessages.length + 1, 
                sender: 'user', 
                text: newMessage 
            }]);
            
            // Simulate orchestrator agent response
            setTimeout(() => {
                setChatMessages(prev => [...prev, {
                    id: prev.length + 1,
                    sender: 'orchestrator',
                    text: 'Based on your request, I found some agents that can help you. I will show the results below.'
                }]);
                setShowAgents(true);
            }, 1000);
            
            setNewMessage('');
        }
    };

    const filteredAgents = AGENTS_DATA.filter(agent => {
        const matchesCategory = !filters.category || agent.category === filters.category;
        const matchesPrice = agent.price >= filters.minPrice && agent.price <= filters.maxPrice;
        const matchesRating = agent.rating >= filters.minRating;
        return matchesCategory && matchesPrice && matchesRating;
    });

    const sortedAgents = [...filteredAgents].sort((a, b) => {
        switch (filters.sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    return (
        <div className="agents-page">
            {/* Header */}
            <header>
                <div className="container">
                    <div className="nav-wrapper">
                        <div className="logo">
                            <img src="./logo-big.svg" alt="Mosaic Logo" />
                        </div>
                        <nav>
                            <ul>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(ROUTES.HOME); }}>Home</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(ROUTES.AGENTS); }} className="active">Agents</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(ROUTES.CREATE_AGENT); }}>Register Agent</a></li>
                            </ul>
                        </nav>
                        <div className="auth-buttons">
                            <button className="btn-login">Login</button>
                            <button className="btn-register">Register</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Orchestrator Chat Section */}
            <section className="orchestrator-chat">
                <div className="container">
                    <div className="chat-container large">
                        <div className="chat-header">
                            <div className="agent-info">
                                <div className="agent-avatar orchestrator">🎭</div>
                                <div className="agent-details">
                                    <h3>Orchestrator Agent</h3>
                                    <span className="status online">Online - Finding agents for you</span>
                                </div>
                            </div>
                        </div>
                        <div className="chat-messages">
                            {chatMessages.map(message => (
                                <div key={message.id} className={`message ${message.sender}`}>
                                    <div className="message-content">
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Describe what you need... (e.g., 'I need help with sales data analysis')"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage}>Search</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Transition Area */}
            <div className={`transition-area ${showAgents ? 'show' : ''}`}>
                <div className="container">
                    <h2>Agents Found</h2>
                    <p>Scroll down to see more available agents</p>
                </div>
            </div>

            {/* Agents Grid Section */}
            <section className={`agents-grid-section ${showAgents ? 'show' : ''}`}>
                <div className="container">
                    {/* Filters */}
                    <div className="filters-section">
                        <div className="filters-top">
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
                            
                            <div className="price-filter">
                                <label>Price: ${filters.minPrice} - ${filters.maxPrice}/hour</label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="500" 
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                                />
                            </div>
                            
                            <select 
                                value={filters.minRating} 
                                onChange={(e) => setFilters({...filters, minRating: e.target.value})}
                            >
                                <option value="0">Any Rating</option>
                                <option value="3">3+ Stars</option>
                                <option value="4">4+ Stars</option>
                                <option value="4.5">4.5+ Stars</option>
                            </select>
                            
                            <select 
                                value={filters.sortBy} 
                                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                            >
                                <option value="popularity">Popularity</option>
                                <option value="price-low">Lowest Price</option>
                                <option value="price-high">Highest Price</option>
                                <option value="rating">Best Rating</option>
                            </select>
                        </div>
                    </div>

                    {/* Agents Grid */}
                    <div className="agents-grid">
                        {sortedAgents.map(agent => (
                            <div key={agent.id} className="agent-card">
                                <div className="agent-avatar">{agent.avatar}</div>
                                <div className="agent-info">
                                    <div className="agent-header">
                                        <h3>{agent.name}</h3>
                                        {agent.verified && <span className="verified-badge">✓</span>}
                                    </div>
                                    <div className="agent-category">{agent.category}</div>
                                    <p className="agent-description">{agent.description}</p>
                                    <div className="agent-footer">
                                        <div className="agent-price">${agent.price}/hour</div>
                                        <div className="agent-rating">
                                            {'★'.repeat(Math.floor(agent.rating))} {agent.rating}
                                        </div>
                                    </div>
                                    <button className="btn-view-profile">View Profile</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <button className="btn-page active">1</button>
                        <button className="btn-page">2</button>
                        <button className="btn-page">3</button>
                        <button className="btn-page">...</button>
                        <button className="btn-page">10</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AgentsPage; 