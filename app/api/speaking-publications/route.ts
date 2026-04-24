import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { SpeakingEngagement, Publication } from '@/lib/firebase-data';

// Speaking engagement operations using admin SDK
const speakingEngagementOperations = {
  async getAll(): Promise<SpeakingEngagement[]> {
    const snapshot = await db.collection('speaking_engagements').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SpeakingEngagement));
  },

  async getById(id: string): Promise<SpeakingEngagement | null> {
    const doc = await db.collection('speaking_engagements').doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as SpeakingEngagement) : null;
  },

  async create(engagement: Omit<SpeakingEngagement, 'id'>): Promise<SpeakingEngagement> {
    const docRef = await db.collection('speaking_engagements').add(engagement);
    const newDoc = await docRef.get();
    return { id: newDoc.id, ...newDoc.data() } as SpeakingEngagement;
  },

  async update(id: string, updates: Partial<SpeakingEngagement>): Promise<SpeakingEngagement> {
    await db.collection('speaking_engagements').doc(id).update(updates);
    const updatedDoc = await db.collection('speaking_engagements').doc(id).get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as SpeakingEngagement;
  },

  async delete(id: string): Promise<void> {
    await db.collection('speaking_engagements').doc(id).delete();
  }
};

// Publication operations using admin SDK
const publicationOperations = {
  async getAll(): Promise<Publication[]> {
    const snapshot = await db.collection('publications').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Publication));
  },

  async getById(id: string): Promise<Publication | null> {
    const doc = await db.collection('publications').doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Publication) : null;
  },

  async create(publication: Omit<Publication, 'id'>): Promise<Publication> {
    const docRef = await db.collection('publications').add(publication);
    const newDoc = await docRef.get();
    return { id: newDoc.id, ...newDoc.data() } as Publication;
  },

  async update(id: string, updates: Partial<Publication>): Promise<Publication> {
    await db.collection('publications').doc(id).update(updates);
    const updatedDoc = await db.collection('publications').doc(id).get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as Publication;
  },

  async delete(id: string): Promise<void> {
    await db.collection('publications').doc(id).delete();
  }
};

// Combined operations for speaking publications
const speakingPublicationsOperations = {
  async getAll() {
    const [speakingEngagements, publications] = await Promise.all([
      speakingEngagementOperations.getAll(),
      publicationOperations.getAll()
    ]);
    
    return {
      speakingEngagements,
      publications
    };
  },

  async updateAll(data: { speakingEngagements: SpeakingEngagement[], publications: Publication[] }) {
    // For Firestore, we'll handle both create and update operations
    const speakingPromises = data.speakingEngagements.map(engagement => {
      // If ID looks like a temporary ID (contains only numbers or is very short), create new
      if (/^[a-zA-Z0-9]+$/.test(engagement.id) && engagement.id.length < 20) {
        // Remove the temporary ID and create new document
        const { id, ...engagementData } = engagement;
        return speakingEngagementOperations.create(engagementData);
      } else {
        // Update existing document
        return speakingEngagementOperations.update(engagement.id, engagement);
      }
    });
    
    const publicationPromises = data.publications.map(publication => {
      // If ID looks like a temporary ID, create new
      if (/^[a-zA-Z0-9]+$/.test(publication.id) && publication.id.length < 20) {
        // Remove the temporary ID and create new document
        const { id, ...publicationData } = publication;
        return publicationOperations.create(publicationData);
      } else {
        // Update existing document
        return publicationOperations.update(publication.id, publication);
      }
    });
    
    const results = await Promise.all([...speakingPromises, ...publicationPromises]);
    
    // Separate the results back into speaking engagements and publications
    const speakingResults = results.slice(0, data.speakingEngagements.length);
    const publicationResults = results.slice(data.speakingEngagements.length);
    
    return {
      speakingEngagements: speakingResults,
      publications: publicationResults
    };
  }
};

export async function GET() {
  try {
    const data = await speakingPublicationsOperations.getAll();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error reading data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Error reading data: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Admin SDK operations bypass security rules, no auth needed

  try {
    const data = await request.json();
    // Validate the data structure
    if (!data || typeof data !== 'object' || !('speakingEngagements' in data) || !('publications' in data)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }
    
    const updatedData = await speakingPublicationsOperations.updateAll(data);
    
    return NextResponse.json({ 
      success: true,
      message: 'Data saved successfully',
      data: updatedData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: unknown) {
    console.error('Error saving data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        error: `Error saving data: ${errorMessage}`,
        success: false
      },
      { status: 500 }
    );
  }
}
