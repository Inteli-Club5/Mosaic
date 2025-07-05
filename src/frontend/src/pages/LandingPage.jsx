import React, { useState } from 'react'; 

const LandingPage = () => {
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'agent', text: 'Olá! Sou um agente de IA especializado em análise de dados. Como posso ajudá-lo hoje?' },
        { id: 2, sender: 'user', text: 'Preciso de ajuda para analisar dados de vendas da minha empresa' },
        { id: 3, sender: 'agent', text: 'Perfeito! Posso ajudá-lo com análise de tendências, identificação de padrões e criação de relatórios. Você gostaria de começar enviando seus dados?' }
    ]);

    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setChatMessages([...chatMessages, { 
                id: chatMessages.length + 1, 
                sender: 'user', 
                text: newMessage 
            }]);
            setNewMessage('');
        }
    };

    return (
        <div>
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
                                <li><a href="/agents">Agentes</a></li>
                                <li><a href="/agents/create">Cadastrar Agente</a></li>
                                <li><a href="/como-funciona">Como Funciona</a></li>
                            </ul>
                        </nav>
                        <div className="auth-buttons">
                            <button className="btn-login">Login</button>
                            <button className="btn-register">Cadastrar</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Conecte-se com Agentes de IA Especializados</h1>
                        <p>Encontre o agente perfeito para suas necessidades ou compartilhe seu próprio agente com a comunidade</p>
                        <div className="hero-buttons">
                            <button className="btn-primary">Encontrar Agentes</button>
                            <button className="btn-secondary">Cadastrar Agente</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chat Demo Section */}
            <section className="chat-demo">
                <div className="container">
                    <h2>Veja como é fácil interagir com nossos agentes</h2>
                    <div className="chat-container">
                        <div className="chat-header">
                            <div className="agent-info">
                                <div className="agent-avatar">🤖</div>
                                <div className="agent-details">
                                    <h4>Agente de Análise de Dados</h4>
                                    <span className="status online">Online</span>
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
                                placeholder="Digite sua mensagem..."
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage}>Enviar</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2>Principais Funcionalidades</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🔍</div>
                            <h3>Busca Inteligente</h3>
                            <p>Encontre agentes especializados usando nossa busca avançada por categoria, preço e avaliações</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💎</div>
                            <h3>Agentes Verificados</h3>
                            <p>Todos os agentes passam por processo de verificação para garantir qualidade e confiabilidade</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3>Acesso Instantâneo</h3>
                            <p>Conecte-se instantaneamente com agentes através de nossa plataforma integrada</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Pagamento Seguro</h3>
                            <p>Transações seguras com blockchain e contratos inteligentes</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Analytics</h3>
                            <p>Acompanhe métricas e desempenho dos seus agentes em tempo real</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Personalização</h3>
                            <p>Agentes adaptáveis às suas necessidades específicas e preferências</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h4>Mosaic</h4>
                            <p>Conectando pessoas com a inteligência artificial do futuro</p>
                        </div>
                        <div className="footer-section">
                            <h4>Produtos</h4>
                            <ul>
                                <li><a href="/agents">Buscar Agentes</a></li>
                                <li><a href="/agents/create">Cadastrar Agente</a></li>
                                <li><a href="/marketplace">Marketplace</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Recursos</h4>
                            <ul>
                                <li><a href="/documentacao">Documentação</a></li>
                                <li><a href="/api">API</a></li>
                                <li><a href="/blog">Blog</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Suporte</h4>
                            <ul>
                                <li><a href="/help">Central de Ajuda</a></li>
                                <li><a href="/contact">Contato</a></li>
                                <li><a href="/faq">FAQ</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 Mosaic. Todos os direitos reservados.</p>
                        <div className="footer-links">
                            <a href="/privacy">Política de Privacidade</a>
                            <a href="/terms">Termos de Uso</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;