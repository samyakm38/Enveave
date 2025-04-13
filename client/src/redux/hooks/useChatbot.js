import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { 
  sendMessageStart, 
  sendMessageSuccess, 
  sendMessageFailure,
  addSystemMessage,
  clearChat
} from '../slices/chatbotSlice';
import chatbotService from '../services/chatbotService';
import { processUserQuery, formatResponse, getSuggestions } from '../../components/ChatBot/chatUtils';

export const useChatbot = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { messages, isLoading, error, suggestions, conversationId } = useSelector((state) => state.chatbot);
  const { currentUser, userType } = useSelector((state) => state.auth);

  // Send message to chatbot API
  const sendMessage = async (message, isSystemMessage = false) => {
    // For system messages (greetings, etc.), just add them directly without API call
    if (isSystemMessage) {
      dispatch(addSystemMessage(message));
      return;
    }

    try {
      // Start loading state
      dispatch(sendMessageStart());
      
      // Create unique IDs for messages
      const userMessageId = `user-${Date.now()}`;
      
      // Add user message to state immediately
      const userMessage = {
        id: userMessageId,
        text: message,
        isUser: true,
        timestamp: new Date().toISOString()
      };      // Prepare user context for the API with proper default values to avoid undefined or null
      const userContext = {
        userType: userType || 'visitor',
        userId: currentUser?.id || 'anonymous-user',  // Use string instead of null
        userName: currentUser?.name || 'Visitor',
        currentPage: location.pathname || '/',
        // Remove conversationId as it's not being used properly
      };
      
      // Process query for intent detection
      const processedQuery = processUserQuery(message, userContext);
      
      // For debugging - can be removed in production
      console.log('Processed query:', processedQuery);
      console.log('User context:', userContext);
      console.log('User message:', userMessage);
      // Send to API
      const response = await chatbotService.sendMessage(processedQuery, userContext);
      
      // Format the bot response
      const formattedResponse = formatResponse(response.message);
      
      // Generate suggestion prompts based on context
      const newSuggestions = response.suggestions || getSuggestions(userType);
      
      // Create bot response object
      const botResponse = {
        id: response.messageId || `bot-${Date.now()}`,
        text: formattedResponse,
        isUser: false,
        timestamp: new Date().toISOString(),
        metadata: response.metadata || {}
      };
      
      // Update conversation state
      dispatch(sendMessageSuccess({ 
        userMessage, 
        botResponse,
        suggestions: newSuggestions
      }));
      
      return botResponse;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      
      // Dispatch error action
      dispatch(sendMessageFailure(error.response?.data?.message || 'Failed to get a response. Please try again.'));
      
      // Show error message in chat
      return {
        id: `error-${Date.now()}`,
        text: 'I apologize, but I encountered an error processing your request. Please try again.',
        isUser: false,
        isError: true,
        timestamp: new Date().toISOString()
      };
    }
  };

  // Clear chat history
  const resetChat = async () => {
    try {
      // If user is authenticated, clear history on server too
      if (currentUser?.id) {
        await chatbotService.clearHistory();
      }
      dispatch(clearChat());
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  // Provide feedback on a message
  const provideFeedback = async (messageId, isHelpful) => {
    try {
      if (currentUser?.id) {
        await chatbotService.rateResponse(messageId, isHelpful);
      }
      return true;
    } catch (error) {
      console.error('Error providing feedback:', error);
      return false;
    }
  };

  return {
    messages,
    isLoading,
    error,
    suggestions,
    sendMessage,
    resetChat,
    provideFeedback
  };
};

export default useChatbot;
