const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building for Vercel deployment...');

// Set environment variable for Vercel
process.env.NEXT_PUBLIC_DEPLOY_TARGET = 'vercel';

// Build the project
try {
  execSync('next build', { stdio: 'inherit' });
  console.log('Vercel build completed successfully!');
} catch (error) {
  console.error('Vercel build failed:', error);
  process.exit(1);
}
