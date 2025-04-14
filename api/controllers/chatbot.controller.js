import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

// Initialize Gemini API with the current SDK
const genAI = new GoogleGenerativeAI(env.geminiApiKey);

// Store conversation history for authenticated users (in memory for now)
// For production, this should be moved to a database
export const conversationHistory = new Map();

/**
 * Generate a system prompt that provides context about Enveave
 */
const getSystemPrompt = () => {
  return `You are an AI assistant for Enveave, an environmental volunteering platform that connects volunteers with organizations running environmental initiatives. 
  
Key facts about Enveave:
- Enveave helps connect volunteers with environmental organizations and projects
- Organizations can post opportunities and manage volunteer applications
- Volunteers can search for opportunities, apply, and track their applications
- Types of environmental work include conservation, clean-ups, education, research, and more
- The platform is free to use for both volunteers and organizations

Your role is to:
1. Answer questions about Enveave and environmental volunteering
2. Help users navigate the platform and use its features
3. Provide information about environmental issues when relevant
4. Be friendly, helpful, and concise

Keep your responses focused on environmental topics and platform usage. If asked about topics unrelated to environmental volunteering or the platform, politely redirect the conversation.`;
};

/**
 * Process user context for personalized responses
 */
const processUserContext = (userContext) => {
  // Add personalization based on user type
  let contextPrompt = '';
  
  if (userContext?.userType === 'volunteer') {
    contextPrompt += `\nThis user is a volunteer on the platform. They may need help with:
- Finding suitable volunteer opportunities
- Completing their volunteer profile
- Applying to opportunities
- Tracking application status
- Understanding environmental volunteering requirements`;
  } 
  else if (userContext?.userType === 'organization') {
    contextPrompt += `\nThis user represents an organization on the platform. They may need help with:
- Creating and posting volunteer opportunities
- Managing volunteer applications
- Setting up their organization profile
- Understanding how to effectively engage volunteers
- Best practices for environmental projects`;
  }
  else if (userContext?.userType === 'admin') {
    contextPrompt += `\nThis user is an administrator of the platform. They may need help with:
- Managing users and content
- Platform statistics and analytics
- Administrative features
- System oversight capabilities`;
  }
  else{
    contextPrompt += `\nThis user is a visitor. They may be wanted to volunteer or they may be an organization looking to post opportunities.
- They may need help with signing up or understanding the platform's features
- They may want to know about enveave platform and its mission
- They may be looking for specific opportunities or organizations
- They may need help with the signup process`;
  }
  
  // Add current page context if available
  if (userContext?.currentPage) {
    contextPrompt += `\nThe user is currently on the ${userContext.currentPage} page.`;
  }
  
  return contextPrompt;
};

/**
 * Send a message to Gemini API and get a response
 * @route POST /api/chatbot/message
 * @access Public
 */
export const sendMessage = async (req, res) => {
  try {
    const { message, userContext = {} } = req.body;
    console.log('Received message:', message, 'User context:', userContext);
      // Process the message object from processUserQuery
    let messageQuery, messageIntent, messageContext;
    
    if (typeof message === 'object') {
      // Extract all relevant parts from the processed message object
      messageQuery = message.query || '';
      messageIntent = message.intent || 'general_query';
      messageContext = message.context || {};
    } else {
      // If it's just a string, use it directly
      messageQuery = message;
      messageIntent = 'general_query';
      messageContext = {};
    }
    
    if (!messageQuery) {
      return res.status(400).json({ message: 'Message query is required' });
    }

    // Get conversation history for authenticated users
    let history = [];
    const userId = req.user?.id || 'anonymous';
    
    if (conversationHistory.has(userId)) {
      history = conversationHistory.get(userId);
    }
    
    // Build the complete prompt with context
    const systemPrompt = getSystemPrompt();
    const contextPrompt = processUserContext(userContext);
      try {
      // Build a more comprehensive prompt with all message components
      const userMessageText = `User message: ${messageQuery}
User intent: ${messageIntent}
Current page: ${userContext.currentPage || '/'}`;
      
      const fullPrompt = [systemPrompt, contextPrompt, userMessageText].join('\n\n');
      console.log('User message details:', { query: messageQuery, intent: messageIntent });
      
      // Initialize Gemini model using the current SDK syntax
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-pro-exp-03-25",
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        }
      });
      console.log('Full prompt:', fullPrompt);
      // Send message with context using the correct SDK syntax for @google/generative-ai
      const result = await model.generateContent(fullPrompt);
      const response = result.response.text();
    
    // Save to history if authenticated
    if (req.user?.id) {
      // Add the user message
      if (!conversationHistory.has(req.user.id)) {
        conversationHistory.set(req.user.id, []);
      }
      
      const userMessageObj = {
        text: message,
        isUser: true,
        timestamp: new Date().toISOString()
      };
      
      const botResponseObj = {
        text: response,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      const userHistory = conversationHistory.get(req.user.id);
      userHistory.push(userMessageObj);
      userHistory.push(botResponseObj);
      
      // Limit history size to avoid excessive memory usage
      if (userHistory.length > 50) {
        userHistory.splice(0, 2); // Remove oldest Q&A pair
      }
    }
    
    // Generate message ID for feedback
    const messageId = `msg-${Date.now()}`;
    
    // Generate suggestions based on conversation
    let suggestions = [];
    try {
      // We could also call Gemini here to generate contextual suggestions
      // For now using a simpler approach based on user type
      if (userContext?.userType === 'volunteer') {
        suggestions = [
          "How do I apply for opportunities?",
          "How to build my volunteer profile?",
          "Where can I see my applications?"
        ];
      } else if (userContext?.userType === 'organization') {
        suggestions = [
          "How to create a new opportunity?",
          "How to manage applications?",
          "How to update our profile?"
        ];
      } else {
        suggestions = [
          "How do I sign up?",
          "What is Enveave?",
          "How to find opportunities?"
        ];
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      // If suggestion generation fails, just continue without them
    }
    
    res.status(200).json({
      message: response,
      messageId,
      suggestions
    });
    } catch (error) {
      console.error('Error sending message to Gemini API:', error);
      res.status(500).json({ message: 'Failed to get response from AI assistant' });
    }
  } catch (error) {
    console.error('Error in chatbot processing:', error);
    res.status(500).json({ message: 'Failed to process your request' });
  }
};

/**
 * Get chat history for authenticated user
 * @route GET /api/chatbot/history
 * @access Private
 */
export const getHistory = (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Authentication required to access history' });
    }
    
    const history = conversationHistory.get(req.user.id) || [];
    res.status(200).json({ history });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).json({ message: 'Failed to retrieve chat history' });
  }
};

/**
 * Clear chat history for authenticated user
 * @route DELETE /api/chatbot/history
 * @access Private
 */
export const clearHistory = (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Authentication required to clear history' });
    }
    
    conversationHistory.delete(req.user.id);
    res.status(200).json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ message: 'Failed to clear chat history' });
  }
};

/**
 * Submit feedback for a message
 * @route POST /api/chatbot/feedback
 * @access Private
 */
export const submitFeedback = (req, res) => {
  try {
    const { messageId, isHelpful } = req.body;
    
    if (!messageId || isHelpful === undefined) {
      return res.status(400).json({ message: 'Message ID and feedback value are required' });
    }
    
    // Here you would typically store this feedback in a database
    // For now, just log it
    console.log(`Feedback received: Message ${messageId} was ${isHelpful ? 'helpful' : 'not helpful'}`);
    
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
};

/**
 * Get contextual suggestion prompts
 * @route POST /api/chatbot/suggestions
 * @access Public
 */
export const getSuggestions = (req, res) => {
  try {
    const { userContext } = req.body;
    
    let suggestions = [];
    
    // Generate suggestions based on user type
    if (userContext?.userType === 'volunteer') {
      suggestions = [
        "How do I apply for opportunities?",
        "How to build my volunteer profile?",
        "Where can I see my applications?",
        "What skills are most needed?"
      ];
    } else if (userContext?.userType === 'organization') {
      suggestions = [
        "How to create a new opportunity?",
        "How to manage applications?",
        "How to update our profile?",
        "Best practices for volunteer management"
      ];
    } else if (userContext?.userType === 'admin') {
      suggestions = [
        "How to verify organizations?",
        "How to moderate content?",
        "How to view platform analytics?",
        "How to manage user accounts?"
      ];
    } else {
      suggestions = [
        "How do I sign up?",
        "What is Enveave?",
        "How to find opportunities?",
        "What kinds of volunteer work are available?"
      ];
    }
    
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ message: 'Failed to generate suggestions' });
  }
};
