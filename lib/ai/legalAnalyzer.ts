// lib/ai/legalAnalyzer.ts
'use server';
import { OpenAI } from 'openai';  // Use the direct OpenAI library instead
import { AIToolError, ErrorCode } from '@/lib/error/errorHandler';

// Create a function to get the OpenAI client to ensure it's properly initialized
function getOpenAIClient() {
  try {
    const apiKey = process.env.OPENAI_API_KEY || '';
    if (!apiKey) {
      throw new Error('OpenAI API key is missing or empty');
    }
    
    // Use the standard OpenAI SDK
    const client = new OpenAI({
      apiKey: apiKey
    });
    
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

// Add the missing identifyFramework function
export async function identifyFramework(text: string): Promise<string> {
  try {
    // Get a fresh client for each request
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

// Add the missing generateReasoning function
export async function generateReasoning(
  narrative: string,
  framework: string
): Promise<{ reasoning: string; recommendation: string }> {
  try {
    // Get a fresh client for each request
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
    
    // Parse the response to extract reasoning and recommendation
    let reasoning = '';
    let recommendation = '';
    
    if (result.includes('Recommendation:')) {
      const parts = result.split('Recommendation:');
      reasoning = parts[0].replace('Reasoning:', '').trim();
      recommendation = parts[1].trim();
    } else {
      reasoning = result;
      recommendation = 'No specific recommendation provided.';
    }
    
    return {
      reasoning,
      recommendation,
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