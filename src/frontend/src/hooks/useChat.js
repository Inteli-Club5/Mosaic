import { useState } from 'react';

const useChat = (initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = (text, sender = 'user') => {
    if (text.trim()) {
      const message = {
        id: messages.length + 1,
        sender,
        text: text.trim(),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, message]);
      return message;
    }
    return null;
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      ...message,
      timestamp: new Date().toISOString()
    }]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const handleSendMessage = () => {
    const message = sendMessage(newMessage);
    if (message) {
      setNewMessage('');
      return message;
    }
    return null;
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    addMessage,
    clearMessages,
    handleSendMessage
  };
};

export default useChat; 