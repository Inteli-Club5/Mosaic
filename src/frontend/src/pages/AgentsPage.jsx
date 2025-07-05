import React, { useState } from 'react';

const AgentsPage = () => {
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'orchestrator', text: 'Olá! Sou o agente orquestrador. Posso ajudá-lo a encontrar o agente perfeito para suas necessidades. O que você está procurando?' }
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

    const [agents] = useState([
        {
            id: 1,
            name: 'Agente de Análise de Dados',
            category: 'Análise de Dados',
            description: 'Especializado em análise estatística, visualização de dados e insights de negócios para empresas.',
            price: 50,
            rating: 4.8,
            avatar: '📊',
            verified: true
        },
        {
            id: 2,
            name: 'Assistente de Marketing',
            category: 'Marketing',
            description: 'Criação de campanhas, análise de mercado e estratégias de marketing digital para seu negócio.',
            price: 35,
            rating: 4.6,
            avatar: '📈',
            verified: true
        },
        {
            id: 3,
            name: 'Consultor Financeiro IA',
            category: 'Finanças',
            description: 'Planejamento financeiro, análise de investimentos e consultoria para otimização de recursos.',
            price: 80,
            rating: 4.9,
            avatar: '💰',
            verified: true
        },
        {
            id: 4,
            name: 'Desenvolvedor de Código',
            category: 'Desenvolvimento',
            description: 'Desenvolvimento de aplicações, revisão de código e consultoria técnica em diversas linguagens.',
            price: 60,
            rating: 4.7,
            avatar: '💻',
            verified: true
        },
        {
            id: 5,
            name: 'Designer Criativo',
            category: 'Design',
            description: 'Criação de designs únicos, branding e identidade visual para projetos criativos.',
            price: 45,
            rating: 4.5,
            avatar: '🎨',
            verified: false
        },
        {
            id: 6,
            name: 'Especialista em SEO',
            category: 'Marketing',
            description: 'Otimização de mecanismos de busca, análise de palavras-chave e estratégias de posicionamento.',
            price: 40,
            rating: 4.4,
            avatar: '🔍',
            verified: true
        }
    ]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setChatMessages([...chatMessages, { 
                id: chatMessages.length + 1, 
                sender: 'user', 
                text: newMessage 
            }]);
            
            // Simular resposta do agente orquestrador
            setTimeout(() => {
                setChatMessages(prev => [...prev, {
                    id: prev.length + 1,
                    sender: 'orchestrator',
                    text: 'Baseado na sua solicitação, encontrei alguns agentes que podem ajudá-lo. Vou mostrar os resultados abaixo.'
                }]);
                setShowAgents(true);
            }, 1000);
            
            setNewMessage('');
        }
    };

    const filteredAgents = agents.filter(agent => {
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
                            <img src="./logo.png" alt="Mosaic Logo" />
                            <span>Mosaic</span>
                        </div>
                        <nav>
                            <ul>
                                <li><a href="/">Home</a></li>
                                <li><a href="/agents" className="active">Agentes</a></li>
                                <li><a href="/agents/create">Cadastrar Agente</a></li>
                            </ul>
                        </nav>
                        <div className="auth-buttons">
                            <button className="btn-login">Login</button>
                            <button className="btn-register">Cadastrar</button>
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
                                    <h3>Agente Orquestrador</h3>
                                    <span className="status online">Online - Encontrando agentes para você</span>
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
                                placeholder="Descreva o que você precisa... (ex: 'Preciso de ajuda com análise de dados de vendas')"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage}>Buscar</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Transition Area */}
            <div className={`transition-area ${showAgents ? 'show' : ''}`}>
                <div className="container">
                    <h2>Agentes Encontrados</h2>
                    <p>Deslize para baixo para ver mais agentes disponíveis</p>
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
                                <option value="">Todas as Categorias</option>
                                <option value="Análise de Dados">Análise de Dados</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Finanças">Finanças</option>
                                <option value="Desenvolvimento">Desenvolvimento</option>
                                <option value="Design">Design</option>
                            </select>
                            
                            <div className="price-filter">
                                <label>Preço: R${filters.minPrice} - R${filters.maxPrice}/hora</label>
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
                                <option value="0">Qualquer Avaliação</option>
                                <option value="3">3+ Estrelas</option>
                                <option value="4">4+ Estrelas</option>
                                <option value="4.5">4.5+ Estrelas</option>
                            </select>
                            
                            <select 
                                value={filters.sortBy} 
                                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                            >
                                <option value="popularity">Popularidade</option>
                                <option value="price-low">Menor Preço</option>
                                <option value="price-high">Maior Preço</option>
                                <option value="rating">Melhor Avaliação</option>
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
                                        <div className="agent-price">R${agent.price}/hora</div>
                                        <div className="agent-rating">
                                            {'★'.repeat(Math.floor(agent.rating))} {agent.rating}
                                        </div>
                                    </div>
                                    <button className="btn-view-profile">Ver Perfil</button>
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