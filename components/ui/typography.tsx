import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { ElementType, forwardRef } from 'react'

const typographyVariants = cva('text-foreground', {
    variants: {
        variant: {
            h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
            h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
            h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
            h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
            h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
            h6: 'scroll-m-20 text-base font-semibold tracking-tight',
            p: 'leading-7',
            blockquote: 'mt-6 border-l-2 pl-6 italic',
            list: 'my-6 ml-6 list-disc [&>li]:mt-2',
        },
    },
    defaultVariants: {
        variant: 'p',
    },
})

type TypographyElement = HTMLHeadingElement | HTMLParagraphElement | HTMLQuoteElement | HTMLDivElement

interface TypographyProps
    extends Omit<React.HTMLAttributes<TypographyElement>, 'as'>,
    VariantProps<typeof typographyVariants> {
    as?: ElementType
}

const Typography = forwardRef<TypographyElement, TypographyProps>(
    ({ className, variant, as: Component = 'p', ...props }, ref) => {
        return (
            <Component
                className={cn(typographyVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)

Typography.displayName = 'Typography'

export { Typography, typographyVariants } 