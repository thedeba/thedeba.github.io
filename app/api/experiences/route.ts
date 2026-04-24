import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Experience } from '@/lib/firebase-data';

// Experience operations using admin SDK
const experienceOperations = {
  async getAll(): Promise<Experience[]> {
    const snapshot = await db.collection('experiences').orderBy('period', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
  },

  async getById(id: string): Promise<Experience | null> {
    const doc = await db.collection('experiences').doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Experience) : null;
  },

  async create(experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience> {
    const newExperience = {
      ...experience,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    const docRef = await db.collection('experiences').add(newExperience);
    const newDoc = await docRef.get();
    return { id: newDoc.id, ...newDoc.data() } as Experience;
  },

  async update(id: string, updates: Partial<Experience>): Promise<Experience> {
    const updateData = {
      ...updates,
      updated_at: new Date()
    };
    
    await db.collection('experiences').doc(id).update(updateData);
    const updatedDoc = await db.collection('experiences').doc(id).get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as Experience;
  },

  async delete(id: string): Promise<void> {
    await db.collection('experiences').doc(id).delete();
  }
};

export async function GET() {
  try {
    const experiences = await experienceOperations.getAll();
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Admin SDK operations bypass security rules, no auth needed

  try {
    const body = await request.json();

    const newExperience = await experienceOperations.create({
      type: body.type,
      title: body.title,
      company: body.company,
      period: body.period,
      description: body.description,
      skills: body.skills || []
    });

    return NextResponse.json(newExperience, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Admin SDK operations bypass security rules, no auth needed

  try {
    const body = await request.json();

    const updatedExperience = await experienceOperations.update(body.id, {
      type: body.type,
      title: body.title,
      company: body.company,
      period: body.period,
      description: body.description,
      skills: body.skills || []
    });

    return NextResponse.json(updatedExperience);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Admin SDK operations bypass security rules, no auth needed

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await experienceOperations.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
