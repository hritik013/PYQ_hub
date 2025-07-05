const AI_API_KEY = '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';

export const testAPIKey = async () => {
  console.log('Testing API key...');
  
  const testServices = [
    {
      name: 'OpenRouter Mistral',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      model: 'mistralai/mistral-small-3.2-24b-instruct:free'
    }
  ];

  for (const service of testServices) {
    try {
      console.log(`\n--- Testing ${service.name} ---`);
      
      const payload = {
        model: service.model,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 100,
        temperature: 0.5,
        stream: false
      };

      const response = await fetch(service.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'PYQ Study Assistant'
        },
        body: JSON.stringify(payload)
      });

      console.log(`Status: ${response.status}`);
      console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS! Response:', data);
        return { success: true, service: service.name, data };
      } else {
        const errorText = await response.text();
        console.log('❌ FAILED! Error:', errorText);
      }
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
  }
  
  return { success: false, message: 'All services failed' };
}; 