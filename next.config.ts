import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages';

const nextConfig: NextConfig = {
  // Only add output export for GitHub Pages deployment
  ...(isStaticExport && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  }),
  
  // Add base path for GitHub Pages
  ...(isStaticExport && {
    basePath: '/debashish-portfolio'
  })
};

export default nextConfig;
