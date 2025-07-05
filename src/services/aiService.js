const AI_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Try multiple models in case one doesn't work
const AI_SERVICES = [
  {
    name: 'OpenRouter Mistral',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'mistralai/mistral-small-3.2-24b-instruct:free'
  },
  {
    name: 'OpenRouter GPT-3.5',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'openai/gpt-3.5-turbo'
  }
];

export const sendMessageToAI = async (message, conversationHistory = [], contextMessage = '') => {
  // Check if API key is available
  if (!AI_API_KEY) {
    return '⚠️ **API Key Missing**\n\nTo use the AI Assistant, you need to set up your OpenRouter API key:\n\n**For Local Development:**\n1. Create a `.env` file in your project root\n2. Add: `VITE_OPENROUTER_API_KEY=your_actual_key_here`\n3. Restart your development server\n\n**For Vercel Deployment:**\n1. Go to your Vercel dashboard\n2. Select your project\n3. Go to Settings → Environment Variables\n4. Add: `VITE_OPENROUTER_API_KEY` with your API key\n5. Redeploy your project\n\n💡 **Get API Key**: [OpenRouter.ai](https://openrouter.ai)';
  }

  const systemMessage = contextMessage 
    ? `You are a helpful study assistant for students preparing for exams. You help with PYQs (Previous Year Questions) and provide study guidance. 

IMPORTANT FORMATTING RULES:
- Use clear headings with **bold** text
- Use bullet points (•) for lists
- Use numbered lists (1., 2., 3.) for steps
- Use code blocks with \`\`\` for code examples
- Use **bold** for important terms
- Use *italic* for emphasis
- Break up long paragraphs with line breaks
- Use emojis sparingly but effectively (📚, 💡, ✅, ⚠️)

Be concise, helpful, and focus on exam preparation strategies. ${contextMessage}`
    : `You are a helpful study assistant for students preparing for exams. You help with PYQs (Previous Year Questions) and provide study guidance. 

IMPORTANT FORMATTING RULES:
- Use clear headings with **bold** text
- Use bullet points (•) for lists
- Use numbered lists (1., 2., 3.) for steps
- Use code blocks with \`\`\` for code examples
- Use **bold** for important terms
- Use *italic* for emphasis
- Break up long paragraphs with line breaks
- Use emojis sparingly but effectively (📚, 💡, ✅, ⚠️)

Be concise, helpful, and focus on exam preparation strategies.`;

  const messages = [
    {
      role: 'system',
      content: systemMessage
    },
    ...conversationHistory.map(msg => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.text
    })),
    {
      role: 'user',
      content: message
    }
  ];

  // Try each service until one works
  for (const service of AI_SERVICES) {
    try {
      console.log(`Trying ${service.name}...`);
      
      const response = await fetch(service.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'PYQ Study Assistant'
        },
        body: JSON.stringify({
          model: service.model,
          messages: messages,
          max_tokens: 800,
          temperature: 0.7,
          stream: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`${service.name} worked!`);
        return data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
      } else {
        console.log(`${service.name} failed with status: ${response.status}`);
        const errorText = await response.text();
        console.log(`Error details: ${errorText}`);
      }
    } catch (error) {
      console.error(`${service.name} error:`, error);
    }
  }

  // If all services fail, return a helpful error message with debugging info
  console.error('All AI services failed. Check the console for detailed error messages.');
  return '⚠️ **Connection Failed**\n\nAll AI services are currently unavailable. This could be due to:\n\n• **Invalid API key** - Check your OpenRouter API key\n• **Network issues** - Check your internet connection\n• **Service downtime** - Try again in a few minutes\n\n🔧 **Debug Steps**:\n1. Check browser console (F12) for detailed errors\n2. Verify your API key is correct\n3. Test your internet connection\n4. Try refreshing the page';
};

// Test function to check API connectivity
export const testAPIConnection = async () => {
  if (!AI_API_KEY) {
    return {
      success: false,
      message: 'API key not configured. Please set VITE_OPENROUTER_API_KEY in your environment variables.'
    };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'PYQ Study Assistant'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: '✅ API connection successful!'
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: `❌ API Error: ${errorData.error?.message || 'Unknown error'}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `❌ Network Error: ${error.message}`
    };
  }
}; 