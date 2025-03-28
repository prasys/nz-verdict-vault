// lib/ai/legalAnalyzer.ts
'use server';
import { createOpenAI } from '@ai-sdk/openai';
import { AI_CONFIG } from '@/lib/config';

const openai = createOpenAI({
  baseURL: 'https://api.openai.com/v1',
  apiKey: AI_CONFIG.OPENAI_API_KEY2,
});

// Debug logging
console.log('OpenAI client initialized:', {
  baseURL: AI_CONFIG.OPENAI_BASE_URL,
  apiKey: AI_CONFIG.OPENAI_API_KEY2 ? 'Provided' : 'Missing',
  openai: openai,
  hasChat: !!openai.chat,
  hasCompletions: !!openai.chat?.completions,
});

export async function analyzeNarrative(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: AI_CONFIG.CHAT_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Extract the legal narrative (key facts, events, and parties) from the following text in a concise paragraph.',
        },
        { role: 'user', content: text },
      ],
    });
    return response.choices[0].message.content || 'No narrative identified.';
  } catch (error) {
    console.error('analyzeNarrative error:', error);
    throw error;
  }
}

export async function identifyFramework(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: AI_CONFIG.CHAT_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Identify the legal framework (laws, regulations, or principles) applied or referenced in the following text. List them clearly.',
        },
        { role: 'user', content: text },
      ],
    });
    return response.choices[0].message.content || 'No framework identified.';
  } catch (error) {
    console.error('identifyFramework error:', error);
    throw error;
  }
}

export async function generateReasoning(
  narrative: string,
  framework: string
): Promise<{ reasoning: string; recommendation: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: AI_CONFIG.CHAT_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Apply the legal narrative to the framework. Provide detailed reasoning and a recommendation. Format your response with "Reasoning:" followed by the reasoning, and "Recommendation:" followed by the recommendation.`,
        },
        { role: 'user', content: `Narrative: ${narrative}\nFramework: ${framework}` },
      ],
    });
    const result = response.choices[0].message.content || '';
    const [reasoningPart, recommendationPart] = result.split('Recommendation:');
    return {
      reasoning: reasoningPart?.replace('Reasoning:', '').trim() || 'No reasoning provided.',
      recommendation: recommendationPart?.trim() || 'No recommendation provided.',
    };
  } catch (error) {
    console.error('generateReasoning error:', error);
    throw error;
  }
}