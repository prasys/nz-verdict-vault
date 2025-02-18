import type { MDXComponents } from 'mdx/types'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { IoCalendarOutline, IoDocumentTextOutline, IoArrowForward } from 'react-icons/io5'

interface CaseCardProps {
    documentId: string;
    title: string;
    date: string;
    tribunal: string;
    summary: string;
    relevance?: string;
    decision?: {
        outcome: string;
        reasoning?: string;
        implications?: string[];
    };
    keyIssues?: string[];
    keyPrinciples?: string[];
}

// Define custom components with Tailwind styling
const mdxComponents: MDXComponents = {
    h1: ({ className, ...props }) => (
        <Typography
            variant="h1"
            as="h1"
            className={cn(
                "mb-6 mt-8 scroll-m-20 text-4xl font-bold tracking-tight text-gray-900",
                className
            )}
            {...props}
        />
    ),
    h2: ({ className, ...props }) => (
        <Typography
            variant="h2"
            as="h2"
            className={cn(
                "mb-4 mt-12 scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900 first:mt-0",
                className
            )}
            {...props}
        />
    ),
    h3: ({ className, ...props }) => (
        <Typography
            variant="h3"
            as="h3"
            className={cn(
                "mb-3 mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-gray-900",
                className
            )}
            {...props}
        />
    ),
    h4: ({ className, ...props }) => (
        <Typography
            variant="h4"
            as="h4"
            className={cn(
                "mb-2 mt-6 scroll-m-20 text-lg font-semibold tracking-tight text-gray-900",
                className
            )}
            {...props}
        />
    ),
    h5: ({ className, ...props }) => (
        <Typography
            variant="h5"
            as="h5"
            className={cn(
                "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h6: ({ className, ...props }) => (
        <Typography
            variant="h6"
            as="h6"
            className={cn(
                "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    a: ({ className, href, children, ...props }) => {
        const isInternalLink = href?.startsWith('/');
        const isCaseLink = href?.includes('/cases/');
        const classes = cn(
            "inline-flex items-center gap-2",
            isCaseLink ? "px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors" :
                "font-medium text-emerald-600 hover:text-emerald-700 transition-colors",
            className
        );

        if (isInternalLink && href) {
            return (
                <Link href={href} className={classes} {...props}>
                    {children}
                    {isCaseLink && <IoArrowForward className="h-4 w-4" />}
                </Link>
            );
        }

        return (
            <a
                className={classes}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {children}
            </a>
        );
    },
    p: ({ className, ...props }) => (
        <Typography
            variant="p"
            as="p"
            className={cn(
                "leading-7 text-gray-700 [&:not(:first-child)]:mt-4",
                className
            )}
            {...props}
        />
    ),
    ul: ({ className, ...props }) => (
        <ul className={cn("my-6 ml-6 list-disc space-y-3 text-gray-700", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
        <ol className={cn("my-6 ml-6 list-decimal space-y-3 text-gray-700", className)} {...props} />
    ),
    li: ({ className, ...props }) => (
        <li className={cn("mt-2 leading-7 pl-2", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
        <Typography
            variant="blockquote"
            as="blockquote"
            className={cn(
                "my-6 border-l-2 border-emerald-600 pl-6 italic text-emerald-800 [&>*]:text-emerald-600",
                className
            )}
            {...props}
        />
    ),
    img: ({
        className,
        alt,
        ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            className={cn("rounded-md border", className)}
            alt={alt}
            {...props}
        />
    ),
    hr: ({ ...props }) => (
        <hr className="my-4 md:my-8" {...props} />
    ),
    table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="my-6 w-full overflow-y-auto">
            <table className={cn("w-full", className)} {...props} />
        </div>
    ),
    tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
        <tr
            className={cn(
                "m-0 border-t p-0 even:bg-muted",
                className
            )}
            {...props}
        />
    ),
    th: ({ className, ...props }) => (
        <th
            className={cn(
                "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
                className
            )}
            {...props}
        />
    ),
    td: ({ className, ...props }) => (
        <td
            className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
                className
            )}
            {...props}
        />
    ),
    pre: ({ className, ...props }) => (
        <pre
            className={cn(
                "mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4",
                className
            )}
            {...props}
        />
    ),
    code: ({ className, ...props }) => (
        <code
            className={cn(
                "relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm",
                className
            )}
            {...props}
        />
    ),
    CaseCard: ({ documentId, title, date, tribunal, summary, decision, keyIssues = [], keyPrinciples = [] }: CaseCardProps) => (
        <div className="my-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <Link href={`/law/cases/${documentId}`} className="group">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {title}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <IoCalendarOutline className="h-4 w-4" />
                            {date}
                        </div>
                        <div className="flex items-center gap-1">
                            <IoDocumentTextOutline className="h-4 w-4" />
                            {tribunal}
                        </div>
                    </div>
                </div>

                <p className="text-gray-700">{summary}</p>

                {decision && (
                    <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900">Decision</h4>
                        <p className="text-gray-700">{decision.outcome}</p>
                    </div>
                )}

                {keyIssues && keyIssues.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900">Key Issues</h4>
                        <div className="flex flex-wrap gap-2">
                            {keyIssues.map((issue, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                                >
                                    {issue}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {keyPrinciples && keyPrinciples.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900">Key Principles</h4>
                        <div className="flex flex-wrap gap-2">
                            {keyPrinciples.map((principle, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100"
                                >
                                    {principle}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-4">
                    <Link
                        href={`/law/cases/${documentId}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                        View Full Case Analysis
                        <IoArrowForward className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    ),
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...mdxComponents,
        ...components,
    }
}