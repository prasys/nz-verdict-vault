'use server';

import { generateText, Tool, LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { AI_CONFIG } from '@/lib/config';

// Create OpenAI instance with API key
const openaiInstance = createOpenAI({
    baseURL: AI_CONFIG.OPENAI_BASE_URL,
    apiKey: AI_CONFIG.OPENAI_API_KEY
});

export interface OpenAiCallOptions {
    model?: string;
    tools?: Record<string, Tool>;
    maxSteps?: number;
    toolChoice?: 'auto' | 'none' | 'required';
    prompt: string;
}

// callVercelAi wraps the Vercel AI generateText call with standardized logging & error handling.
export async function callOpenAi(options: OpenAiCallOptions) {
    const model = openaiInstance(options.model ?? AI_CONFIG.CHAT_MODEL) as LanguageModelV1;
    console.log('💡 Starting Vercel AI call with options:', options);
    try {
        const result = await generateText({
            model,
            tools: options.tools,
            maxSteps: options.maxSteps ?? 5,
            toolChoice: options.toolChoice ?? 'required',
            prompt: options.prompt,
        });
        console.log('✅ Vercel AI call successful:', result);
        return result;
    } catch (error) {
        console.error('❌ Vercel AI call failed:', error);
        throw error;
    }
}