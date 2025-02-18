'use client';

import { useChat, Message } from '@ai-sdk/react';
import { IoSearchOutline, IoArrowForward } from 'react-icons/io5';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import { useMDXComponents } from '@/mdx-components';
import Link from 'next/link';
import { CaseCard } from '@/components/ui/case-card';


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

type ResponseWithTools = Message & {
    toolInvocations: ToolInvocation[];
};

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
    const [isDebugOpen, setIsDebugOpen] = useState(false);
    const mdxComponents = useMDXComponents({
        Link,
        CaseCard,
        IoArrowForward,
    });

    // Process regular content
    useEffect(() => {
        if (content) {
            serialize(content).then(setMdxSource);
        }
    }, [content]);

    // Process tool results
    useEffect(() => {
        if (toolInvocations?.length) {
            const lastTool = toolInvocations[toolInvocations.length - 1];
            if (lastTool.state === 'result' && lastTool.name === 'legalSearch') {
                processToolResults(lastTool);
            }
        }
    }, [toolInvocations]);

    const processToolResults = async (tool: ToolResultInvocation) => {
        try {
            const { tool_results } = tool.output;
            const results = tool_results?.results;

            if (!results || results.length === 0) {
                const noResultsMdx = `# No Results Found\n\nI couldn't find any cases that match your query. Try rephrasing your search or using different keywords.`;
                setMdxSource(await serialize(noResultsMdx));
                return;
            }

            // Get the most relevant result
            const mainResult = results[0];
            const otherResults = results.slice(1);

            // Helper function to escape special characters in strings
            const escapeString = (str: string) => str.replace(/['"\\]/g, '\\$&');

            // Helper function to safely stringify JSON
            const safeJsonStringify = (obj: Record<string, unknown> | unknown[]) => {
                if (!obj) return '{}';
                return JSON.stringify(obj)
                    .replace(/"/g, '\\"')
                    .replace(/\n/g, '\\n');
            };

            // Build MDX content with proper escaping
            const mdxContent = `
# Legal Analysis

${mainResult.relevance}

<CaseCard
    documentId="${escapeString(mainResult.documentId)}"
    title="${escapeString(mainResult.analysis.title)}"
    date="${escapeString(mainResult.analysis.date)}"
    tribunal="${escapeString(mainResult.analysis.tribunal)}"
    summary="${escapeString(mainResult.analysis.summary)}"
    decision={{
        outcome: "${escapeString(mainResult.analysis.decision?.outcome || '')}",
        reasoning: "${escapeString(mainResult.analysis.decision?.reasoning || '')}",
        implications: ${safeJsonStringify(mainResult.analysis.decision?.implications || [])}
    }}
    keyIssues={${safeJsonStringify(mainResult.caseDetails?.background?.keyIssues || [])}}
    keyPrinciples={${safeJsonStringify(mainResult.analysis.keyPrinciples || [])}}
/>

${otherResults.length > 0 ? `
## Related Cases

${otherResults.map(result => `
### ${escapeString(result.analysis.title)}
${result.relevance}

<CaseCard
    documentId="${escapeString(result.documentId)}"
    title="${escapeString(result.analysis.title)}"
    date="${escapeString(result.analysis.date)}"
    tribunal="${escapeString(result.analysis.tribunal)}"
    summary="${escapeString(result.analysis.summary)}"
    decision={{
        outcome: "${escapeString(result.analysis.decision?.outcome || '')}",
        reasoning: "${escapeString(result.analysis.decision?.reasoning || '')}",
        implications: ${safeJsonStringify(result.analysis.decision?.implications || [])}
    }}
    keyIssues={${safeJsonStringify(result.caseDetails?.background?.keyIssues || [])}}
    keyPrinciples={${safeJsonStringify(result.analysis.keyPrinciples || [])}}
/>
`).join('\n')}
` : ''}

${tool_results.suggestedResponse ? `
## Key Takeaways

${tool_results.suggestedResponse}
` : ''}`;

            setMdxSource(await serialize(mdxContent));
        } catch (error) {
            console.error('Error processing search result:', error);
            const errorMdx = `# Error Processing Results\n\nAn error occurred while processing the search results. Please try your search again.`;
            setMdxSource(await serialize(errorMdx));
        }
    };

    return (
        <div className="space-y-4">
            {/* Collapsible Debug Panel */}
            <div className="relative">
                <button
                    onClick={() => setIsDebugOpen(!isDebugOpen)}
                    className="w-full flex items-center justify-between p-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <IoSearchOutline className="h-4 w-4" />
                        Tool Invocations
                    </span>
                    <span className="text-xs">
                        {isDebugOpen ? '▼' : '▶'}
                    </span>
                </button>
                {isDebugOpen && (
                    <div className="mt-2 p-4 bg-yellow-50 rounded-lg text-xs font-mono overflow-x-auto border border-yellow-200">
                        <pre className="whitespace-pre-wrap">
                            {JSON.stringify(toolInvocations, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            {/* Search Status */}
            {toolInvocations?.map((tool, index) => {
                if (tool.state === 'call' && tool.name === 'legalSearch') {
                    return (
                        <div key={`call-${index}`}>
                            <ToolCallCard tool={tool} />
                        </div>
                    );
                }
                return null;
            })}

            {/* MDX Content */}
            {mdxSource && (
                <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-blockquote:border-l-emerald-600 prose-blockquote:text-emerald-800">
                    <MDXRemote {...mdxSource} components={mdxComponents} />
                </div>
            )}
        </div>
    );
}

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        maxSteps: 5,
        onResponse: (response) => {
            if ('toolInvocations' in response) {
                const responseWithTools = response as unknown as ResponseWithTools;
                console.log('Chat response:', {
                    ...response,
                    toolInvocations: responseWithTools.toolInvocations?.map(tool => {
                        if (tool.state === 'call') {
                            return {
                                state: tool.state,
                                name: tool.name,
                                args: tool.args
                            };
                        } else {
                            return {
                                state: tool.state,
                                name: tool.name,
                                output: {
                                    results: tool.output.tool_results.results,
                                    suggestedResponse: tool.output.tool_results.suggestedResponse
                                }
                            };
                        }
                    })
                });
            }
        },
        onFinish: (message) => {
            if ('toolInvocations' in message) {
                const messageWithTools = message as unknown as ResponseWithTools;
                console.log('Chat finished:', {
                    ...message,
                    toolInvocations: messageWithTools.toolInvocations?.map((tool: ToolInvocation) => ({
                        state: tool.state,
                        name: tool.name,
                        args: tool.state === 'call' ? tool.args : undefined,
                        output: tool.state === 'result' ? {
                            results: (tool as ToolResultInvocation).output?.tool_results?.results,
                            suggestedResponse: (tool as ToolResultInvocation).output?.tool_results?.suggestedResponse
                        } : undefined
                    }))
                });
            }
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