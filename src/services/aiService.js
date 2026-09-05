// TripX Universal AI Engine (No Mocks)
// Supports both Gemini and OpenAI-compatible API keys.

export const getAIResponse = async (userMessage) => {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const openAiBaseUrl = import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1';

  // 1. Try OpenAI Compatible Route
  if (openAiKey && openAiKey !== 'YOUR_API_KEY_HERE') {
    const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';
    try {
      const response = await fetch(`${openAiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: model, // Dynamic model based on provider
          messages: [
            { role: 'system', content: 'You are a helpful travel assistant for TripX.' },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      }
      console.warn('OpenAI API rejected the request. Status:', response.status);
    } catch (e) {
      console.error('OpenAI Error:', e);
    }
  }

  // 2. Try Gemini Route
  if (geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are a helpful travel assistant for TripX.\n\nUser: ${userMessage}` }] }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      }
      console.warn('Gemini API rejected the request. Status:', response.status);
    } catch (e) {
      console.error('Gemini Error:', e);
    }
  }

  // 3. Absolute Failure
  return "Error: I need a valid, active API key to function. Please add either a VITE_OPENAI_API_KEY or a VITE_GEMINI_API_KEY to your .env file. (If you provided one, it was rejected by the provider).";
};
