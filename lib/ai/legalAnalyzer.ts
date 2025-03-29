// lib/ai/legalAnalyzer.ts
'use server';
import { OpenAI } from '@ai-sdk/openai';
import { AIToolError, ErrorCode } from '@/lib/error/errorHandler';

// Create a function to get the OpenAI client to ensure it's properly initialized
function getOpenAIClient() {
  try {
    // Using direct OpenAI import instead of createOpenAI
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY2 || '',
    });
    
    // Verify the client is properly initialized
    if (!client || !client.chat || !client.chat.completions) {
      throw new Error('OpenAI client not properly initialized');
    }
    
    return client;
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
    throw new AIToolError(
      'AI client initialization failed',
      ErrorCode.AI_CONFIG_ERROR,
      { timestamp: Date.now() }
    );
  }
}

export async function analyzeNarrative(text: string): Promise<string> {
  try {
    // Get a fresh client for each request
    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Extract the legal narrative (key facts, events, and parties) from the following text in a concise paragraph.',
        },
        { role: 'user', content: text.substring(0, 15000) }, // Limit text length
      ],
    });
    
    return response.choices[0].message.content || 'No narrative identified.';
  } catch (error) {
    console.error('analyzeNarrative error:', error);
    throw new AIToolError(
      'Failed to analyze narrative',
      ErrorCode.AI_REQUEST_FAILED,
      { timestamp: Date.now() }
    );
  }
}

export async function identifyFramework(text: string): Promise<string> {
  try {
    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Identify the legal framework (laws, regulations, or principles) applied or referenced in the following text. List them clearly.',
        },
        { role: 'user', content: text.substring(0, 15000) }, // Limit text length
      ],
    });
    
    return response.choices[0].message.content || 'No framework identified.';
  } catch (error) {
    console.error('identifyFramework error:', error);
    throw new AIToolError(
      'Failed to identify framework',
      ErrorCode.AI_REQUEST_FAILED,
      { timestamp: Date.now() }
    );
  }
}

export async function generateReasoning(
  narrative: string,
  framework: string
): Promise<{ reasoning: string; recommendation: string }> {
  try {
    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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
    throw new AIToolError(
      'Failed to generate reasoning',
      ErrorCode.AI_REQUEST_FAILED,
      { timestamp: Date.now() }
    );
  }
}