const fs = require('fs');
const path = require('path');

// Copy data files to public directory for GitHub Pages
const dataDir = path.join(process.cwd(), 'data');
const publicDataDir = path.join(process.cwd(), 'public', 'data');

// Create public data directory if it doesn't exist
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

// Copy JSON files from data directory to public data directory
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

console.log('Static data files prepared for GitHub Pages deployment');
