import React, { useState } from 'react';

const ChatDemo = () => {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'agent', text: 'Hello! I am an AI agent specialized in data analysis. How can I help you today?' },
    { id: 2, sender: 'user', text: 'I need help analyzing sales data from my company' },
    { id: 3, sender: 'agent', text: 'Perfect! I can help you with trend analysis, pattern identification and report creation. Would you like to start by sending your data?' }
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
        <h2>See how easy it is to interact with our agents</h2>
        <div className="chat-container">
          <div className="chat-header">
            <div className="agent-info">
              <div className="agent-avatar">🤖</div>
              <div className="agent-details">
                <h4>Data Analysis Agent</h4>
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
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatDemo; 