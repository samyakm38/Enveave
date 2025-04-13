import { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaChevronDown, FaPaperPlane, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useAuth } from '../../redux/hooks/useAuth';
import './ChatWidget.css';
import ChatMessage from './ChatMessage.jsx';
import { useChatbot } from '../../redux/hooks/useChatbot';
import { getInitialGreeting, getSuggestions } from './chatUtils';

const ChatWidget = () => {  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { currentUser, userType: authUserType } = useAuth();
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error,
    suggestions,
    provideFeedback,
    resetChat
  } = useChatbot();
  
  // Define userType based on authentication state
  // If not authenticated (or userType not set), use 'visitor'
  const userType = currentUser ? (authUserType || 'visitor') : 'visitor';

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (isOpen) {
      scrollToBottom();
      
      // If this is the first time opening and no messages, add greeting
      if (messages.length === 0) {
        const greeting = getInitialGreeting(currentUser, userType);
        sendMessage(greeting, true); // Send as system message
      }
    }
  }, [isOpen, messages, currentUser, userType, sendMessage]);

  // Handle browser resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen && chatContainerRef.current) {
        // Adjust height for mobile if needed
        if (window.innerWidth <= 480) {
          chatContainerRef.current.style.height = `${window.innerHeight * 0.7}px`;
        } else {
          chatContainerRef.current.style.height = '';
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // Focus on input field when opening
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (but not with Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (!isLoading) {
      sendMessage(suggestion);
    }
  };
  const handleFeedback = async (messageId, isHelpful) => {
    if (!feedbackGiven[messageId]) {
      const success = await provideFeedback(messageId, isHelpful);
      if (success) {
        // Store the type of feedback (helpful or not) rather than just a boolean
        setFeedbackGiven(prev => ({...prev, [messageId]: isHelpful ? 'helpful' : 'not-helpful'}));
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      resetChat();
    }
  };

  return (
    <div className={`chat-widget-container ${isOpen ? 'open' : ''}`}>
      {/* Chat toggle button */}
      <button 
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        className="chat-widget-button" 
        onClick={handleToggle}
        data-testid="chat-toggle"
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </button>

      {/* Chat window */}
      <div className="chat-widget-window" aria-hidden={!isOpen} ref={chatContainerRef}>
        <div className="chat-widget-header">
          <div className="chat-widget-title">
            <img 
              src="/logo.svg" 
              alt="" 
              className="chat-widget-icon" 
              aria-hidden="true"
              onError={(e) => {e.target.src="/logo.svg"}}
            />
            <span>Enveave Assistant</span>
          </div>
          <div className="chat-widget-controls">
            <button 
              className="chat-widget-reset" 
              onClick={handleReset}
              title="Clear conversation"
              aria-label="Clear conversation"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="chat-widget-minimize" 
              onClick={handleToggle} 
              aria-label="Minimize chat"
            >
              <FaChevronDown />
            </button>
            </div>
        </div>

        <div className="chat-widget-messages">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg}
              isUser={msg.isUser}
            />
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="chat-loading-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="chat-error-message">
              {error}
            </div>
          )}
            {/* Feedback buttons for bot messages */}
          {messages.length > 0 && !messages[messages.length - 1].isUser && !isLoading && (
            <div className="chat-feedback">
              <button 
                onClick={() => handleFeedback(messages[messages.length - 1].id, true)} 
                className={`chat-feedback-button ${feedbackGiven[messages[messages.length - 1].id] === 'helpful' ? 'selected' : ''}`}
                aria-label="Helpful"
                disabled={feedbackGiven[messages[messages.length - 1].id]}
              >
                <FaThumbsUp />
              </button>
              <button 
                onClick={() => handleFeedback(messages[messages.length - 1].id, false)} 
                className={`chat-feedback-button ${feedbackGiven[messages[messages.length - 1].id] === 'not-helpful' ? 'selected' : ''}`}
                aria-label="Not helpful"
                disabled={feedbackGiven[messages[messages.length - 1].id]}
              >
                <FaThumbsDown />
              </button>
            </div>
          )}
          
          {/* Suggestions */}
          {suggestions.length > 0 && !isLoading && (
            <div className="chat-suggestions">
              {suggestions.map((suggestion, index) => (
                <button 
                  key={index}
                  className="chat-suggestion-button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          {/* Ref for automatic scrolling */}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="chat-widget-input-container">
          <form onSubmit={handleSubmit} className="chat-widget-input-form">
            <textarea
              ref={inputRef}
              className="chat-widget-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              aria-label="Message input"
              rows="1"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="chat-widget-send-button"
              disabled={!inputMessage.trim() || isLoading}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
