
export const analyzeImageWithGroq = async (apiKey: string, imageDataUrl: string) => {
  try {
    const base64Image = imageDataUrl.split(',')[1];
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and suggest optimal settings for converting it to line art. Provide only a JSON object with keys: 'threshold' (0-255), 'contrast' (-100 to 100), 'brightness' (-100 to 100), and 'blur' (1-20). For line art, we usually want high contrast and a specific threshold. Explain why in a 'reason' field."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error('Groq API request failed');
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Groq Analysis Error:', error);
    throw error;
  }
};
