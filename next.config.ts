import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  transpilePackages: ['next-mdx-remote'],
  
  // Disable TypeScript errors during build
  typescript: {
    // This allows production builds to succeed even with TypeScript errors
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build
  eslint: {
    // This prevents ESLint from running during the build
    ignoreDuringBuilds: true,
  },
  
  // Optionally, add any other Next.js config below
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)