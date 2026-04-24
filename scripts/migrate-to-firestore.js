#!/usr/bin/env node

/**
 * Data Migration Script: Supabase to Firestore
 * 
 * This script helps migrate data from Supabase to Firestore
 * Run with: node scripts/migrate-to-firestore.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Firebase configuration (using your existing service account)
const serviceAccount = require('../deba-portfolio-firebase-adminsdk-fbsvc-0af458b284.json');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Load actual data from JSON files
function loadDataFromFile(filename) {
  try {
    const filePath = path.join(__dirname, '..', 'public', 'data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}

// Actual data from JSON files
const actualData = {
  blogs: loadDataFromFile('blogs.json'),
  projects: loadDataFromFile('projects.json'),
  speakingEngagements: [],
  publications: [],
  experiences: []
};

async function migrateData() {
  console.log('🚀 Starting Firebase data migration...\n');
  
  try {
    // Migrate Blogs
    console.log('📝 Migrating blogs...');
    for (const blog of actualData.blogs) {
      const blogRef = db.collection('blogs').doc(blog.id || blog.title.toLowerCase().replace(/\s+/g, '-'));
      await blogRef.set(blog);
      console.log(`✅ Created blog: ${blog.title}`);
    }
    
    // Migrate Projects
    console.log('\n🚀 Migrating projects...');
    for (const project of actualData.projects) {
      const projectData = {
        ...project,
        created_at: new Date(),
        updated_at: new Date()
      };
      const projectRef = db.collection('projects').doc(project.id || project.title.toLowerCase().replace(/\s+/g, '-'));
      await projectRef.set(projectData);
      console.log(`✅ Created project: ${project.title}`);
    }
    
    // Migrate Speaking Engagements
    console.log('\n🎤 Migrating speaking engagements...');
    for (const engagement of actualData.speakingEngagements) {
      const engagementRef = db.collection('speaking_engagements').doc(engagement.id || engagement.title.toLowerCase().replace(/\s+/g, '-'));
      await engagementRef.set(engagement);
      console.log(`✅ Created speaking engagement: ${engagement.title}`);
    }
    
    // Migrate Publications
    console.log('\n� Migrating publications...');
    for (const publication of actualData.publications) {
      const pubRef = db.collection('publications').doc(publication.id || publication.title.toLowerCase().replace(/\s+/g, '-'));
      await pubRef.set(publication);
      console.log(`✅ Created publication: ${publication.title}`);
    }
    
    // Migrate Experiences
    console.log('\n💼 Migrating experiences...');
    for (const experience of actualData.experiences) {
      const expRef = db.collection('experiences').doc(experience.id || experience.title.toLowerCase().replace(/\s+/g, '-'));
      await expRef.set(experience);
      console.log(`✅ Created experience: ${experience.title}`);
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit Firebase Console to verify your data');
    console.log('2. Test your portfolio website');
    console.log('3. Use admin dashboard to manage content');
    console.log('4. Update Firestore security rules for production');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
if (require.main === module) {
  migrateData();
}

module.exports = { migrateData, actualData };
