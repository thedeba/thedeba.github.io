#!/usr/bin/env node

const admin = require('firebase-admin');

// Firebase configuration
const serviceAccount = require('../deba-portfolio-firebase-adminsdk-fbsvc-0af458b284.json');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function clearProjects() {
  console.log('🗑️  Clearing existing projects from Firestore...');
  
  try {
    const projectsSnapshot = await db.collection('projects').get();
    
    if (projectsSnapshot.empty) {
      console.log('No projects found to clear.');
      return;
    }
    
    const batch = db.batch();
    projectsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`✅ Cleared ${projectsSnapshot.size} projects from Firestore`);
    
  } catch (error) {
    console.error('❌ Error clearing projects:', error);
    process.exit(1);
  }
}

// Run clear operation
if (require.main === module) {
  clearProjects();
}

module.exports = { clearProjects };
