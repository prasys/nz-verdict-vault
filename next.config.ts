// next.config.ts
import createMDX from '@next/mdx';

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  transpilePackages: ['next-mdx-remote'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Stub out 'fs' on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  serverExternalPackages: ['pdf2json.js'], // Moved and renamed from experimental.serverComponentsExternalPackages
  // outputFileTracingIncludes: {              // Moved from experimental.outputFileTracingIncludes
  //   // '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.proto'],
  //   '/law/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.proto'],
  // },
};

const withMDX = createMDX({});
export default withMDX(nextConfig);