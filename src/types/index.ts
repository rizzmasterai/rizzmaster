export type Personality = 'NORMAL' | 'RIZZ' | 'CASUAL' | 'PROFESSIONAL';

export interface ImageAnalysis {
  type: 'MALE_PROFILE' | 'FEMALE_PROFILE' | 'CHAT_SCREENSHOT' | 'OTHER';
  confidence: number;
  details: string;
}

export interface Message {
  id: number;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  image?: string;
  imageAnalysis?: ImageAnalysis;
  suggestions?: string[];
  explanations?: string[];
  isLoading?: boolean;
}

export interface GPTResponse {
  suggestions: Array<string | { text: string; explanation?: string }>;
  imageAnalysis?: ImageAnalysis;
}

export interface LoadingMessageBoxProps {
  count?: number;
}
