import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { AGENTS_DATA } from '../constants/agents';
import { cn } from '../lib/utils';
import { InteractiveGridPattern } from '../components/magicui/interactive-grid-pattern';
import Footer from '../components/Footer';
import { usePrivy } from "@privy-io/react-auth";
import HeaderPrivy from '../components/HeaderPrivy';


const AgentsPage = () => {

    const { user } = usePrivy();
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'orchestrator', text: 'Hello! I am the orchestrator agent. Tell me what is your problem and I can recomend you a (or more) AI agent that could help you.' }
    ]);
    
    const [newMessage, setNewMessage] = useState('');
    const [showAgents, setShowAgents] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        minRating: 0,
        sortBy: 'popularity'
    });



    const navigate = useNavigate();

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
      
      
      

    const filteredAgents = AGENTS_DATA.filter(agent => {
        const matchesSearch = !searchTerm || 
            agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filters.category || agent.category === filters.category;
        const matchesRating = agent.rating >= filters.minRating;
        return matchesSearch && matchesCategory && matchesRating;
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
            <header>
                <HeaderPrivy/>
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
                                    {chatMessages.some(m => m.requiresNft) && (
                                        <div className="chat-followup-options">
                                            <button onClick={handleContinueWithAgent}>✅ Continue with Agent</button>
                                            <button onClick={handleExploreOthers}>🔁 Explore other options</button>
                                        </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <br/>
            <section className={`agents-grid-section ${showAgents ? 'show' : ''}`}>
                <div className="container bg-white rounded-t-3xl shadow-lg">
                    <div className="px-6 py-4">
                    {/* Search and Filters */}
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
                            <div className="agent-card-header">
                            <div className="agent-avatar">{agent.avatar}</div>
                            <div className="agent-main-info">
                                <h3 className="agent-name">
                                {agent.name}
                                {agent.verified && <span className="verified-badge">✓</span>}
                                </h3>
                                <div className="agent-category">{agent.category}</div>
                            </div>
                            </div>

                            <p className="agent-description">{agent.description}</p>

                            <div className="agent-footer">
                            <div className="agent-price">USDC {agent.price}/hour</div>
                            <div className="agent-rating">
                                {'★'.repeat(Math.floor(agent.rating))} <span>{agent.rating}</span>
                            </div>
                            </div>

                            <button 
                                className="btn-view-profile"
                                onClick={() => navigate(`/agents/${agent.id}`)}
                            >
                                View Agent
                            </button>
                        </div>
                        ))}
                    </div>
                    <div className="pagination">
                        <button className="btn-page active">1</button>
                        <button className="btn-page">2</button>
                        <button className="btn-page">...</button>
                    </div>
                    <br/>
                    <hr/>
                    <br/>
                    <h2> Your Agents</h2>
                    <br/>
                    <div className="agents-grid">
                        <div className="create-agent-card" onClick={() => navigate('/create')}>
                        <div className="plus-icon">+</div>
                            <p>Create Agent</p>
                        </div>
                    </div>
                    <div className="pagination">
                        <button className="btn-page active">1</button>
                        <button className="btn-page">2</button>
                        <button className="btn-page">...</button>
                    </div>
                    <br/>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AgentsPage; 