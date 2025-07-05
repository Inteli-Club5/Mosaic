import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { AGENTS_DATA } from '../constants/agents';
import { cn } from '../lib/utils';
import { InteractiveGridPattern } from '../components/magicui/interactive-grid-pattern';


const AgentsPage = () => {
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'orchestrator', text: 'Hello! I am the orchestrator agent. I can help you find the perfect agent for your needs. What are you looking for?' }
    ]);
    
    const [newMessage, setNewMessage] = useState('');
    const [showAgents, setShowAgents] = useState(true);
    
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

            {/* Grid Background - Reduced height */}
            <div className="fixed top-0 left-0 w-screen" style={{ zIndex: -1, height: '100vh' }}>
                <InteractiveGridPattern
                    className={cn("w-full h-full")}
                    width={40}
                    height={40}
                    squares={[60, 32]}
                    squaresClassName=""
                />
            </div>



            {/* Orchestrator Chat Section - Ultra Modern Design */}
            <section className="orchestrator-chat relative" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, minHeight: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                <div className="container relative px-4 sm:px-6 lg:px-8" style={{ marginTop: '120px', paddingBottom: '40px' }}>
                    <div className="max-w-4xl mx-auto">
                        {/* Modern Chat Container */}
                        <div className="modern-chat-container">
                            {/* Header */}
                            <div className="modern-chat-header">
                                <div className="chat-header-content">
                                    <div className="chat-agent-info">
                                        <div className="chat-avatar">
                                            🤖
                                        </div>
                                        <div className="chat-agent-details">
                                            <h3>Orchestrator Agent</h3>
                                            <p>Build your multi-agent with prompts</p>
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
                                                    {message.sender === 'user' ? 'You' : 'Orchestrator'} • now
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
                                            placeholder="Describe what kind of AI agent you need..."
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            className="chat-input-field"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleSendMessage}
                                        className="chat-send-button"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Transition Area */}
            <div className={`transition-area ${showAgents ? 'show' : ''}`} style={{ marginTop: '40vh' }}>
                <style jsx>{`
                    @media (max-width: 768px) {
                        .transition-area {
                            margin-top: 360px !important;
                        }
                    }
                    @media (max-width: 480px) {
                        .transition-area {
                            margin-top: 320px !important;
                        }
                    }
                `}</style>
                <div className="gradient-transition"></div>
                <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '80px' }}>
                    <div className="text-center py-8">
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Available Agents</h2>
                        <p className="text-gray-600">Discover and connect with specialized AI agents</p>
                    </div>
                </div>
            </div>

            {/* Agents Grid Section */}
            <section className={`agents-grid-section ${showAgents ? 'show' : ''}`}>
                <div className="container bg-white rounded-t-3xl shadow-lg">
                    <div className="px-6 py-8">
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
                </div>
            </section>
        </div>
    );
};

export default AgentsPage; 