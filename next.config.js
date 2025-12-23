/** @type {import('next').NextConfig} */
const isGHPages = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages';

const nextConfig = {
  // For GitHub Pages, use unoptimized images and set proper base paths
  ...(isGHPages && {
    output: 'export',
    distDir: 'out',
    images: {
      unoptimized: true,
    },
    basePath: '/debashish-portfolio',
    assetPrefix: '/debashish-portfolio/',
    trailingSlash: true,
  }),
  
  // For Vercel, use default optimized images
  ...(!isGHPages && {
    images: {
      domains: ['images.unsplash.com'], // Add any image domains you use
    },
  }),
};

module.exports = nextConfig;
