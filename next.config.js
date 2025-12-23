/** @type {import('next').NextConfig} */
const isGHPages = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages';

const nextConfig = {
  // Only enable static export for GitHub Pages
  ...(isGHPages && { output: 'export' }),
  
  // For GitHub Pages, use unoptimized images and set proper base paths
  ...(isGHPages && {
    images: {
      unoptimized: true,
    },
    basePath: '/debashish-portfolio',
    assetPrefix: '/debashish-portfolio/',
  }),
  
  // For Vercel, use default optimized images
  ...(!isGHPages && {
    images: {
      domains: ['images.unsplash.com'], // Add any image domains you use
    },
  }),
};

module.exports = nextConfig;
