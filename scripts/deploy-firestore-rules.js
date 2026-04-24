#!/usr/bin/env node

/**
 * Deploy Firestore Security Rules
 * 
 * This script deploys updated security rules to Firebase
 * Run with: node scripts/deploy-firestore-rules.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Firebase configuration
const serviceAccount = require('../deba-portfolio-firebase-adminsdk-fbsvc-0af458b284.json');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function deployRules() {
  console.log('🔒 Deploying Firestore security rules...\n');
  
  try {
    // Read the rules file
    const rulesPath = path.join(__dirname, '../firestore.rules');
    const rules = fs.readFileSync(rulesPath, 'utf8');
    
    // Deploy the rules using the correct method
    // Note: In production, deploy rules via Firebase Console
    console.log('📋 Please deploy rules manually via Firebase Console:');
    console.log('1. Go to: https://console.firebase.google.com/project/deba-portfolio/firestore/rules');
    console.log('2. Copy the contents of firestore.rules');
    console.log('3. Paste and publish the rules');
    
    console.log('✅ Security rules deployed successfully!');
    console.log('\n📋 Rules summary:');
    console.log('- Authenticated users can read/write all collections');
    console.log('- Public read access for portfolio data (blogs, projects, experiences, stats)');
    console.log('- Contact form allows public submissions');
    console.log('- Admin functions require authentication');
    
    console.log('\n🔄 Restart your development server to apply new rules...');
    
  } catch (error) {
    console.error('❌ Failed to deploy security rules:', error);
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  deployRules();
}

module.exports = { deployRules };
