'use client';

import { useChat, Message } from '@ai-sdk/react';
import { useEffect } from 'react';
import MessageContent from '@/components/chat/message-content';

type SearchResult = {
    documentId: string;
    similarity: number;
    relevance: number;
    analysis: Record<string, unknown>;
    caseDetails: Record<string, unknown>;
};

type CustomToolInvocation = {
    state: string;
    name: string;
    args?: { query: string };
    output?: {
        tool_results: {
            results: SearchResult[];
            suggestedResponse: string;
        };
    };
};

type CustomMessage = Message & {
    toolInvocations?: CustomToolInvocation[];
};

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        maxSteps: 5,
        onResponse: (response) => {
            if ('toolInvocations' in response) {
                console.log('Chat response:', response);
            }
        },
        onFinish: (message) => {
            if ('toolInvocations' in message) {
                console.log('Chat finished:', message);
            }
        },
    });

    useEffect(() => {
        if (messages.length > 0) {
            console.log('Current messages:', messages);
        }
    }, [messages]);

    return (
        <div className="flex flex-col w-full max-w-3xl py-24 mx-auto stretch">
            <div className="space-y-6 mb-24">
                {messages.map(m => (
                    <div key={m.id} className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                            <div className="font-medium text-gray-700">
                                {m.role === 'user' ? 'You' : 'AI Assistant'}
                            </div>
                        </div>
                        <div className="p-4">
                            <MessageContent
                                content={m.content}
                                toolInvocations={(m as CustomMessage).toolInvocations}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-3xl mb-8">
                <input
                    className="w-full p-4 border border-gray-300 dark:border-gray-800 rounded-lg shadow-xl 
                             dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                             text-base"
                    value={input}
                    placeholder="Ask about legal cases or search for specific topics..."
                    onChange={handleInputChange}
                    disabled={isLoading}
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                    </div>
                )}
            </form>
        </div>
    );
}