const AI_API_KEY = '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';

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
  return 'Sorry, I\'m having trouble connecting to the AI service right now. Please check your API key or try again later. You can also click "Test API Connection" to debug the issue.';
}; 