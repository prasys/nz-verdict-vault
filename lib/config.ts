// Central configuration file for environment variables

// AI model configuration
export const AI_CONFIG = {
  // Default chat model with fallback
  CHAT_MODEL: process.env.NEXT_PUBLIC_AI_CHAT_MODEL || 'gpt-4o-2024-08-06',
  
  // Model for embeddings
  EMBEDDING_MODEL: process.env.NEXT_PUBLIC_AI_EMBEDDING_MODEL || 'text-embedding-3-small',
  
  // OpenAI API configuration
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_API_KEY2: process.env.OPENAI_API_KEY2,
};

// Validate required environment variables
if (!AI_CONFIG.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}