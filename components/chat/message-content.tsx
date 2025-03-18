import React, { useCallback, useEffect, useState } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useMDXComponents } from '@/mdx-components';
import Link from 'next/link';
import { CaseCard } from '@/components/ui/case-card';
import { IoArrowForward } from 'react-icons/io5';
import { CaseResult } from '@/components/ui/case-result';
import { handleAIToolError } from '@/lib/error/errorHandler';
import { AIToolCache } from '@/lib/cache/aiToolCache';
import { AnimateFadeUp, AnimateScale, AnimateFadeIn } from '@/components/shared/animations';

const NO_RESULTS_MDX = `# No Results Found\n\nI couldn't find any relevant cases that match your query. Try rephrasing your search or using different keywords.`;
const ERROR_MDX = `# Error Processing Results\n\nAn error occurred while processing the search results. Please try your search again.`;
const LOADING_MDX = `# Searching...\n\nLooking for relevant legal cases...`;
const INCOMPLETE_TOOL_MDX = `# Processing...\n\nWaiting for search results...`;

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

interface MessageContentProps {
    content: string;
    toolInvocations?: CustomToolInvocation[];
}

const cache = AIToolCache.getInstance();

const MessageContent: React.FC<MessageContentProps> = ({ content, toolInvocations }) => {
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    const [isDebugOpen, setIsDebugOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const mdxComponents = useMDXComponents({ Link, CaseCard, IoArrowForward, CaseResult });

    const generateMDXContent = useCallback(async (results: SearchResult[], suggestedResponse?: string) => {
        if (!results || !Array.isArray(results) || results.length === 0) {
            return NO_RESULTS_MDX;
        }

        const mainResult = results[0];
        const otherResults = results.slice(1);

        // Validate main result has required fields
        if (!mainResult.documentId || !mainResult.analysis?.title) {
            console.error('Invalid result format:', mainResult);
            return ERROR_MDX;
        }

        const cacheKey = `mdx-${mainResult.documentId}`;
        const cachedContent = await cache.get<string>(cacheKey);

        if (cachedContent) {
            return cachedContent;
        }

        const mdxContent = `
# Legal Analysis

<CaseResult result={${JSON.stringify(mainResult)}} isMainResult={true} showSummary={true} />

${otherResults.length > 0 ? `
## Related Cases

${otherResults.map(result => `
<CaseResult result={${JSON.stringify(result)}} showSummary={false} />
`).join('\n')}
` : ''}

${suggestedResponse ? `
## Key Takeaways

${suggestedResponse}
` : ''}`;

        cache.set(cacheKey, mdxContent, 3600000);
        return mdxContent;
    }, []);

    const processToolResults = useCallback(async (tool: CustomToolInvocation) => {
        try {
            setIsLoading(true);

            // Handle incomplete tool calls
            if (!tool.output || !tool.output.tool_results) {
                setMdxSource(await serialize(INCOMPLETE_TOOL_MDX));
                return;
            }

            const { results, suggestedResponse } = tool.output.tool_results;

            if (!results || !Array.isArray(results) || results.length === 0) {
                setMdxSource(await serialize(NO_RESULTS_MDX));
                return;
            }

            const mdxContent = await generateMDXContent(results, suggestedResponse);
            setMdxSource(await serialize(mdxContent));
        } catch (error) {
            console.error('Error processing results:', error);
            const errorMessage = handleAIToolError(error);
            setMdxSource(await serialize(`${ERROR_MDX}\n\n${errorMessage}`));
        } finally {
            setIsLoading(false);
        }
    }, [generateMDXContent]);

    useEffect(() => {
        if (content) {
            serialize(content).then(setMdxSource);
        }
    }, [content]);

    useEffect(() => {
        const lastTool = toolInvocations?.[toolInvocations.length - 1];
        if (lastTool?.state === 'result' && lastTool.name === 'legalSearch') {
            processToolResults(lastTool);
        } else if (lastTool?.state === 'call' && lastTool.name === 'legalSearch') {
            // Show loading state when tool is called but hasn't returned yet
            serialize(LOADING_MDX).then(setMdxSource);
        }
    }, [toolInvocations, processToolResults]);

    return (
        <AnimateFadeUp>
            <div className="space-y-4">
                <AnimateScale delay={0.1}>
                    <div className="relative">
                        <button
                            onClick={() => setIsDebugOpen(!isDebugOpen)}
                            className="w-full flex items-center justify-between p-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <span>Tool Invocations</span>
                                {isLoading && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500" />
                                )}
                            </span>
                            <span>{isDebugOpen ? '▼' : '▶'}</span>
                        </button>

                        {isDebugOpen && (
                            <AnimateFadeIn>
                                <div className="mt-2 p-4 bg-yellow-50 rounded-lg text-xs font-mono overflow-x-auto border border-yellow-200">
                                    <pre className="whitespace-pre-wrap">
                                        {JSON.stringify(toolInvocations, null, 2)}
                                    </pre>
                                </div>
                            </AnimateFadeIn>
                        )}
                    </div>
                </AnimateScale>

                {mdxSource && (
                    <AnimateFadeIn delay={0.2}>
                        <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-blockquote:border-l-emerald-600 prose-blockquote:text-emerald-800">
                            <MDXRemote {...mdxSource} components={mdxComponents} />
                        </div>
                    </AnimateFadeIn>
                )}
            </div>
        </AnimateFadeUp>
    );
};

export default MessageContent; 