const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Clean previous builds
if (fs.existsSync('out')) {
  fs.rmSync('out', { recursive: true });
}
if (fs.existsSync('docs')) {
  fs.rmSync('docs', { recursive: true });
}

// Copy static data files first
const dataDir = path.join(process.cwd(), 'data');
const publicDataDir = path.join(process.cwd(), 'public', 'data');

if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

const filesToCopy = [
  'blogs.json',
  'projects.json', 
  'speaking-publications.json',
  'videos.json'
];

filesToCopy.forEach(file => {
  const srcPath = path.join(dataDir, file);
  const destPath = path.join(publicDataDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to public/data/`);
  } else {
    console.log(`Warning: ${file} not found in data directory`);
  }
});

// Build the project
console.log('Building Next.js project...');
try {
  execSync('next build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Check if out directory exists
if (!fs.existsSync('out')) {
  console.error('Error: Next.js did not generate the out directory');
  console.log('This might be due to API routes preventing static export');
  console.log('Creating a fallback static build...');
  
  // Create docs directory manually
  fs.mkdirSync('docs', { recursive: true });
  
  // Copy the .next static files
  const nextStaticPath = path.join('.next', 'static');
  if (fs.existsSync(nextStaticPath)) {
    fs.cpSync(nextStaticPath, path.join('docs', '_next', 'static'), { recursive: true });
  }
  
  // Copy public files
  if (fs.existsSync('public')) {
    fs.cpSync('public', 'docs', { recursive: true });
  }
  
  // Create a basic index.html if it doesn't exist
  const indexPath = path.join('docs', 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('Creating basic index.html...');
    const basicHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Debashish Portfolio</title>
    <meta name="description" content="Software Engineer, ML/DL Engineer & Full Stack Developer">
    <link rel="stylesheet" href="/debashish-portfolio/_next/static/css/app.css">
</head>
<body>
    <div id="root">
        <div style="padding: 20px; text-align: center;">
            <h1>Debashish Portfolio</h1>
            <p>Software Engineer, ML/DL Engineer & Full Stack Developer</p>
            <p>This site is being deployed to GitHub Pages...</p>
        </div>
    </div>
</body>
</html>`;
    fs.writeFileSync(indexPath, basicHtml);
  }
} else {
  // Copy out to docs
  console.log('Copying static files to docs directory...');
  fs.cpSync('out', 'docs', { recursive: true });
  
  // Also copy public data files to docs
  if (fs.existsSync('public/data')) {
    fs.cpSync('public/data', path.join('docs', 'data'), { recursive: true });
  }
}

console.log('Static export completed for GitHub Pages deployment');
