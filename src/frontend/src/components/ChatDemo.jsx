import React, { useState } from 'react';

const ChatDemo = () => {
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
  );
};

export default ChatDemo; 