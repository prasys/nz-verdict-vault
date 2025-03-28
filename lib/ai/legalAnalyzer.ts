// lib/ai/legalAnalyzer.ts
import { createOpenAI } from '@ai-sdk/openai';
import { AI_CONFIG } from '@/lib/config';

const openai = createOpenAI({
//   baseURL: AI_CONFIG.OPENAI_BASE_URL,
apiKey: process.env.OPENAI_API_KEY2 
//   apiKey: AI_CONFIG.OPENAI_API_KEY,
});

export async function analyzeNarrative(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: AI_CONFIG.CHAT_MODEL,
    messages: [
      {
        role: 'system',
        content: 'Extract the legal narrative (key facts, events, and parties) from the following text in a concise paragraph.',
      },
      { role: 'user', content: text },
    ],
  });
  return response.choices[0].message.content || 'No narrative identified.';
}

export async function identifyFramework(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: AI_CONFIG.CHAT_MODEL,
    messages: [
      {
        role: 'system',
        content: 'Identify the legal framework (laws, regulations, or principles) applied or referenced in the following text. List them clearly.',
      },
      { role: 'user', content: text },
    ],
  });
  return response.choices[0].message.content || 'No framework identified.';
}

export async function generateReasoning(
  narrative: string,
  framework: string
): Promise<{ reasoning: string; recommendation: string }> {
  const response = await openai.chat.completions.create({
    model: AI_CONFIG.CHAT_MODEL,
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
}