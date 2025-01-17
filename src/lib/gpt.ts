import { Message, Personality, ImageAnalysis } from '../types';

export interface SingleGPTResponse {
  text: string;
  explanation?: string;
}

export const sendMessageToGPT = async (
  message: Message & { personality: Personality }
): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.content,
        image: message.image,
        personality: message.personality,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response suggestions');
    }

    const data = await response.json();
    return data.response; 
  } catch (error) {
    console.error('Error in GPT service:', error);
    throw error;
  }
};
