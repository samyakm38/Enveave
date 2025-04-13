import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
  conversationId: null,
  suggestions: []
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    sendMessageStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    sendMessageSuccess: (state, action) => {
      state.messages.push(action.payload.userMessage);
      state.messages.push(action.payload.botResponse);
      state.isLoading = false;
      state.suggestions = action.payload.suggestions || [];
    },
    addSystemMessage: (state, action) => {
      state.messages.push({
        id: Date.now().toString(),
        text: action.payload,
        isUser: false,
        isSystem: true,
        timestamp: new Date().toISOString(),
      });
    },
    sendMessageFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
      state.conversationId = null;
    },
    setConversationId: (state, action) => {
      state.conversationId = action.payload;
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    }
  },
});

export const { 
  sendMessageStart, 
  sendMessageSuccess, 
  sendMessageFailure, 
  addSystemMessage,
  clearChat, 
  setConversationId,
  setSuggestions
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
