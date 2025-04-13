import apiClient from './authService';

export const chatbotService = {
  // Send a message to the Gemini API and get a response
  sendMessage: async (message, userContext = {}) => {
    const response = await apiClient.post('/chatbot/message', {
      message,
      userContext: {
        userType: userContext.userType || 'visitor',
        userId: userContext.userId,
        userName: userContext.userName,
        currentPage: userContext.currentPage,
        conversationId: userContext.conversationId
      }
    });
    return response.data;
  },
  
  // Get chat history for the current user (if authenticated)
  getHistory: async () => {
    const response = await apiClient.get('/chatbot/history');
    return response.data;
  },
  
  // Clear chat history (if authenticated)
  clearHistory: async () => {
    const response = await apiClient.delete('/chatbot/history');
    return response.data;
  },
  
  // Rate a response (helpful/not helpful) for improving the model
  rateResponse: async (messageId, isHelpful) => {
    const response = await apiClient.post('/chatbot/feedback', {
      messageId,
      isHelpful
    });
    return response.data;
  },
  
  // Get suggested prompts based on user context
  getSuggestions: async (userContext) => {
    const response = await apiClient.post('/chatbot/suggestions', { userContext });
    return response.data;
  }
};

export default chatbotService;
