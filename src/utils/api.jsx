// Helper function to convert File to base64
export async function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      console.log('[Debug] Image converted to base64:', result.slice(0, 100) + '...'); // Preview only
      resolve(result);
    };
    reader.onerror = () => {
      console.error('[Error] FileReader failed:', reader.error);
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });
}

const OPENROUTER_API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function sendMessageToAI(messages) {
  try {
    console.log('[Debug] Raw input messages:', messages);
    console.log('[Debug] API Key Present:', !!OPENROUTER_API_KEY);
    console.log('[Debug] API URL:', API_URL);

    // Process messages to handle multimodal content
    const processedMessages = await Promise.all(messages.map(async (msg, index) => {
      console.log(`[Debug] Processing message #${index}`, msg);
      
      if (typeof msg.content === 'string') {
        console.log(`[Debug] Message #${index} is plain text`);
        return msg;
      }

      // Handle multimodal content (text + images)
      const processedContent = await Promise.all(msg.content.map(async (item, itemIndex) => {
        console.log(`[Debug] Processing content item #${itemIndex}`, item);

        if (item.type === 'text') {
          return { type: 'text', text: item.text };
        } else if (item.type === 'image_url' && item.file) {
          try {
            const base64 = await readFileAsBase64(item.file);
            return {
              type: 'image_url',
              image_url: { url: base64 }
            };
          } catch (error) {
            console.error('[Error] Image to base64 conversion failed:', error);
            return null;
          }
        }

        return item;
      }));

      const validContent = processedContent.filter(item => item !== null);
      console.log(`[Debug] Final content for message #${index}:`, validContent);

      return {
        role: msg.role,
        content: validContent
      };
    }));

    console.log('[Debug] Final processed messages:', processedMessages);

    const payload = {
      model: 'openrouter/horizon-beta',
      messages: processedMessages,
      temperature: 0.7,
      max_tokens: 4000
    };

    console.log('[Debug] Final payload to API:', payload);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Creative Monk AI Bot',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('[Debug] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Error] API responded with an error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Debug] API response data:', data);

    return data.choices[0]?.message?.content || 'No response received';

  } catch (error) {
    console.error('[Fatal] API Error:', error);
    throw error;
  }
}
