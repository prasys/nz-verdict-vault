import type { MDXComponents } from 'mdx/types'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

// Define custom components with Tailwind styling
const mdxComponents: MDXComponents = {
    h1: ({ className, ...props }) => (
        <Typography
            variant="h1"
            as="h1"
            className={cn(
                "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
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
                "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
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
                "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
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
                "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
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
    a: ({ className, ...props }) => (
        <a
            className={cn(
                "font-medium underline underline-offset-4 hover:text-emerald-600",
                className
            )}
            {...props}
        />
    ),
    p: ({ className, ...props }) => (
        <Typography
            variant="p"
            as="p"
            className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
            {...props}
        />
    ),
    ul: ({ className, ...props }) => (
        <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
        <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }) => (
        <li className={cn("mt-2", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
        <Typography
            variant="blockquote"
            as="blockquote"
            className={cn(
                "mt-6 border-l-2 border-emerald-600 pl-6 italic text-emerald-800 [&>*]:text-emerald-600",
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
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...mdxComponents,
        ...components,
    }
}