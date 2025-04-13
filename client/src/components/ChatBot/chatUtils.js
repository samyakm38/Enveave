/**
 * Chat utility functions for Enveave AI Assistant
 */

// Generate an appropriate greeting based on user type and login status
export const getInitialGreeting = (user, userType) => {
  // Current hour to determine time of day
  const hour = new Date().getHours();
  
  let timeGreeting = 'Hello';
  if (hour < 12) timeGreeting = 'Good morning';
  else if (hour < 18) timeGreeting = 'Good afternoon';
  else timeGreeting = 'Good evening';
  
  // User-specific greetings
  if (user && user.name) {
    if (userType === 'volunteer') {
      return `${timeGreeting}, ${user.name}! 👋 I'm your Enveave assistant. I can help you find volunteering opportunities, track your applications, or answer questions about environmental initiatives. How can I assist you today?`;
    }
    else if (userType === 'organization') {
      return `${timeGreeting}, ${user.name}! 👋 I'm your Enveave assistant. I can help you manage volunteer opportunities, review applications, or answer questions about the platform. How can I help your organization today?`;
    }
    else if (userType === 'admin') {
      return `${timeGreeting}, ${user.name}! 👋 I'm your Enveave assistant. I can help you manage the platform, review data analytics, or provide insights on user activity. What administrative task would you like help with today?`;
    }
    else {
      return `${timeGreeting}, ${user.name}! 👋 I'm your Enveave assistant. How can I help you today?`;
    }
  }
  
  // Default greeting for visitors
  return `${timeGreeting}! 👋 I'm your Enveave assistant. I can help answer questions about environmental volunteering opportunities, organizations, and how to get involved. What would you like to know?`;
};

// Predefined quick response suggestions based on user type
export const getSuggestions = (userType) => {
  if (userType === 'volunteer') {
    return [
      "How do I apply for an opportunity?",
      "What skills are in demand?",
      "How do I complete my profile?",
      "How can I track my applications?"
    ];
  }
  else if (userType === 'organization') {
    return [
      "How do I post a new opportunity?",
      "How do I review applications?",
      "How do I edit my organization profile?",
      "How do I contact volunteers?"
    ];
  }
  else if (userType === 'admin') {
    return [
      "Show platform statistics",
      "How do I verify organizations?",
      "How do I manage content?",
      "How do I run reports?"
    ];
  }
  else {
    return [
      "How do I sign up?",
      "What is Enveave?",
      "What volunteering opportunities are available?",
      "How do organizations join?"
    ];
  }
};

// Process user query to detect intents and format for API
export const processUserQuery = (query, userContext) => {
  // Standardize the query
  const normalizedQuery = query.trim().toLowerCase();
  
  // Prepare context object for the API
  const context = {
    userType: userContext.userType || 'visitor',
    currentPage: userContext.currentPage || 'unknown',
    previousInteractions: userContext.previousInteractions || [],
  };
  
  // Simple intent detection for common queries
  let intent = 'general_query';
  
  if (normalizedQuery.includes('sign up') || normalizedQuery.includes('register') || normalizedQuery.includes('create account')) {
    intent = 'signup_help';
  } 
  else if (normalizedQuery.includes('login') || normalizedQuery.includes('sign in') || normalizedQuery.includes('password')) {
    intent = 'login_help';
  }
  else if (normalizedQuery.includes('apply') || normalizedQuery.includes('application')) {
    intent = 'application_help';
  }
  else if (normalizedQuery.includes('contact') || normalizedQuery.includes('reach out')) {
    intent = 'contact_help';
  }
  
  return {
    query: query,
    intent: intent,
    context: context
  };
};

// Format API response for display in the chat
export const formatResponse = (response) => {
  // Replace URLs with clickable links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const textWithLinks = response.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Replace markdown-style bullet points
  const bulletRegex = /- (.*?)(?=\n- |\n\n|$)/gs;
  const textWithBullets = textWithLinks.replace(bulletRegex, '• $1');
  
  // Replace markdown-style headers
  const headerRegex = /#{1,3} (.*?)(?=\n)/g;
  const formattedText = textWithBullets.replace(headerRegex, '<strong>$1</strong>');

  const boldRegex = /\*\*(.*?)\*\*/g; // Matches **bold text**
  const formattedTextBold = formattedText.replace(boldRegex, '<strong>$1</strong>');
  
  return formattedTextBold;
};
