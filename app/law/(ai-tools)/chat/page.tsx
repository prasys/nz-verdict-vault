'use client';

import { useChat } from '@ai-sdk/react';
import { IoSearchOutline } from 'react-icons/io5';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import { CaseCard } from '@/components/ui/case-card';

// Define types for the chat response and messages
interface ChatResponse {
    toolInvocations?: ToolInvocation[];
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    toolInvocations?: ToolInvocation[];
}

interface LegalSearchResult {
    documentId: string;
    similarity: number;
    relevance: string;
    analysis: {
        title: string;
        date: string;
        tribunal: string;
        summary: string;
        keyTopics: string[];
        categories?: string[];
        decision?: {
            outcome: string;
            reasoning?: string;
            implications?: string[];
        };
        keyPrinciples?: string[];
    };
    caseDetails?: {
        background: {
            context?: string;
            keyIssues?: string[];
            preEvents?: Array<{
                date: string;
                description: string;
                significance?: string;
            }>;
        };
    };
}

interface LegalSearchToolResponse {
    tool_results: {
        results: LegalSearchResult[];
        suggestedResponse: string;
    };
    content: string;
}

interface ToolCallInvocation {
    state: 'call';
    name: 'legalSearch';
    args: { query: string };
}

interface ToolResultInvocation {
    state: 'result';
    name: 'legalSearch';
    output: LegalSearchToolResponse;
}

type ToolInvocation = ToolCallInvocation | ToolResultInvocation;

function ToolCallCard({ tool }: { tool: ToolCallInvocation }) {
    return (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <IoSearchOutline className="h-4 w-4" />
                <span className="font-medium">Searching for:</span>
                <span className="text-emerald-600">{tool.args.query}</span>
            </div>
        </div>
    );
}

function MessageContent({ content, toolInvocations }: { content: string | null; toolInvocations: ToolInvocation[] | undefined }) {
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);

    useEffect(() => {
        if (content) {
            serialize(content, {
                mdxOptions: {
                    development: process.env.NODE_ENV === 'development',
                }
            }).then(setMdxSource);
        }
    }, [content]);

    return (
        <div className="space-y-4">
            {/* Raw Tool Invocations Debug Panel */}
            <div className="bg-yellow-50 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-yellow-200">
                <div className="font-bold mb-2">Raw Tool Invocations:</div>
                <pre>
                    {JSON.stringify(toolInvocations, null, 2)}
                </pre>
            </div>

            {content && mdxSource && (
                <div className="prose prose-sm max-w-none">
                    <MDXRemote {...mdxSource} />
                </div>
            )}

            {toolInvocations?.map((tool, index) => {
                if (tool.state === 'call' && tool.name === 'legalSearch') {
                    return (
                        <div key={`call-${index}`}>
                            <ToolCallCard tool={tool} />
                        </div>
                    );
                }

                if (tool.state === 'result' && tool.name === 'legalSearch') {
                    try {
                        const results = tool.output?.tool_results?.results;

                        if (results && results.length > 0) {
                            return (
                                <div key={`result-${index}`} className="space-y-6">
                                    <div className="text-sm font-medium text-gray-500">
                                        Found {results.length} Relevant Cases:
                                    </div>
                                    {results.map((result, resultIndex) => (
                                        <CaseCard
                                            key={`${result.documentId}-${resultIndex}`}
                                            title={result.analysis.title}
                                            date={result.analysis.date}
                                            tribunal={result.analysis.tribunal}
                                            summary={result.analysis.summary}
                                            documentId={result.documentId}
                                            relevance={result.relevance}
                                            decision={result.analysis.decision}
                                            keyIssues={result.caseDetails?.background?.keyIssues}
                                            keyPrinciples={result.analysis.keyPrinciples}
                                        />
                                    ))}
                                </div>
                            );
                        } else {
                            return (
                                <div key={`no-results-${index}`} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-gray-600 text-sm">No matching cases found.</p>
                                </div>
                            );
                        }
                    } catch (error) {
                        console.error('Error processing search result:', error);
                        return (
                            <div key={`error-${index}`} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">
                                    Error displaying search results: {error instanceof Error ? error.message : 'Unknown error'}
                                </p>
                            </div>
                        );
                    }
                }
                return null;
            })}
        </div>
    );
}

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        maxSteps: 5,
        onResponse: (response: any) => {
            // Log the full response object with all nested details
            console.log('Chat response:', {
                ...response,
                toolInvocations: response.toolInvocations?.map((tool: any) => ({
                    state: tool.state,
                    name: tool.name,
                    args: tool.state === 'call' ? tool.args : undefined,
                    output: tool.state === 'result' ? {
                        results: tool.output?.results?.map((result: any) => ({
                            documentId: result.documentId,
                            similarity: result.similarity,
                            relevance: result.relevance,
                            analysis: result.analysis,
                            caseDetails: result.caseDetails
                        })),
                        suggestedResponse: tool.output?.suggestedResponse
                    } : undefined
                }))
            });
        },
        onFinish: (message: any) => {
            // Log the full message object with all nested details
            console.log('Chat finished:', {
                ...message,
                toolInvocations: message.toolInvocations?.map((tool: any) => ({
                    state: tool.state,
                    name: tool.name,
                    args: tool.state === 'call' ? tool.args : undefined,
                    output: tool.state === 'result' ? {
                        results: tool.output?.results?.map((result: any) => ({
                            documentId: result.documentId,
                            similarity: result.similarity,
                            relevance: result.relevance,
                            analysis: result.analysis,
                            caseDetails: result.caseDetails
                        })),
                        suggestedResponse: tool.output?.suggestedResponse
                    } : undefined
                }))
            });
        },
    });

    // Update the messages effect to show full object details
    useEffect(() => {
        if (messages.length > 0) {
            console.log('Current messages:', messages.map(m => ({
                role: m.role,
                content: m.content,
                toolInvocations: m.toolInvocations?.map(tool => ({
                    state: tool.state,
                    name: tool.name,
                    args: tool.state === 'call' ? tool.args : undefined,
                    output: tool.state === 'result' ? {
                        results: tool.output?.results?.map(result => ({
                            documentId: result.documentId,
                            similarity: result.similarity,
                            relevance: result.relevance,
                            analysis: result.analysis,
                            caseDetails: result.caseDetails
                        })),
                        suggestedResponse: tool.output?.suggestedResponse
                    } : undefined
                }))
            })));
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
                                toolInvocations={m.toolInvocations ?
                                    (m.toolInvocations as unknown as ToolInvocation[]) :
                                    undefined
                                }
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