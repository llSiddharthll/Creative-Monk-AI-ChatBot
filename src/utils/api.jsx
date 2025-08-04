import OpenAI from 'openai';

// Optional: Set your frontend domain if needed for OpenRouter tracking
const SITE_TITLE = 'Creative Monk AI Bot';
const SITE_URL = 'https://creative-monk-ai-chat-bot-gvxp.vercel.app/';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    'HTTP-Referer': SITE_URL,
    'X-Title': SITE_TITLE,
  }
});

// Helper function to convert File to base64
export async function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      console.log('[Debug] Image converted to base64:', result.slice(0, 100) + '...');
      resolve(result);
    };
    reader.onerror = () => {
      console.error('[Error] FileReader failed:', reader.error);
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });
}

export async function sendMessageToAI(messages) {
  try {
    console.log('[Debug] Raw input messages:', messages);

    // Convert content (especially images) to base64
    const processedMessages = await Promise.all(messages.map(async (msg, index) => {
      if (typeof msg.content === 'string') {
        return msg;
      }

      const processedContent = await Promise.all(msg.content.map(async (item, itemIndex) => {
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
            console.error('[Error] Image conversion failed:', error);
            return null;
          }
        }
        return item;
      }));

      return {
        role: msg.role,
        content: processedContent.filter(Boolean),
      };
    }));

    const completion = await openai.chat.completions.create({
      model: 'openrouter/horizon-beta',
      messages: processedMessages,
      temperature: 0.7,
      max_tokens: 4000,
    });

    console.log('[Debug] OpenAI SDK response:', completion);
    return completion.choices[0]?.message?.content || 'No response received';
  } catch (error) {
    console.error('[Fatal] OpenAI SDK Error:', error);
    throw error;
  }
}
