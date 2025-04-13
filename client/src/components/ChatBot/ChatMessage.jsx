import React from 'react';
import './ChatMessage.css';
import { Avatar } from 'flowbite-react';

const ChatMessage = ({ message, isUser }) => {
    console.log('ChatMessage:', message);
    console.log('isUser:', isUser);
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="chat-message-avatar">
        {isUser ? (
          <div className="chat-user-avatar">
            {/* User initial or avatar image */}
            <Avatar></Avatar>
          </div>
        ) : (
          <div className="chat-bot-avatar">
            {/* Bot avatar - using Enveave icon */}
            <img src="/logo-green.svg" alt="Enveave Assistant" 
              onError={(e) => {e.target.onerror = null; e.target.src="/favicon.ico";}} />
          </div>
        )}
      </div>      <div className="chat-message-content">
        <div 
          className="chat-message-text"
          dangerouslySetInnerHTML={{ __html: message.text }}
        />
        {message.timestamp && (
          <div className="chat-message-time">
            {formatTime(message.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper to format timestamp
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Make sure we're using proper ESM export syntax
export { ChatMessage as default };
