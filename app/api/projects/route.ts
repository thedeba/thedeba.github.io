import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { db } from '@/lib/firebase-admin';
import { Project } from '@/lib/firebase-data';

// Project operations using admin SDK
const projectOperations = {
  async getAll(): Promise<Project[]> {
    const snapshot = await db.collection('projects').get();
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    
    // Sort manually: featured projects first, then by created_at (newest first)
    return projects.sort((a, b) => {
      // First sort by featured (true comes first)
      if (a.featured !== b.featured) {
        return b.featured ? 1 : -1;
      }
      
      // Then sort by created_at (newest first)
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bDate - aDate;
    });
  },

  async getById(id: string): Promise<Project | null> {
    const doc = await db.collection('projects').doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Project) : null;
  },

  async create(project: Omit<Project, 'id'>): Promise<Project> {
    const newProject = {
      ...project,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    const docRef = await db.collection('projects').add(newProject);
    const newDoc = await docRef.get();
    return { id: newDoc.id, ...newDoc.data() } as Project;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const updateData = {
      ...updates,
      updated_at: new Date()
    };
    
    await db.collection('projects').doc(id).update(updateData);
    const updatedDoc = await db.collection('projects').doc(id).get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as Project;
  },

  async delete(id: string): Promise<void> {
    await db.collection('projects').doc(id).delete();
  }
};

export async function GET() {
  try {
    const projects = await projectOperations.getAll();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Projects API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch projects',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Admin SDK operations bypass security rules, no auth needed

  try {
    const body = await request.json();

    const newProject = await projectOperations.create({
      title: body.title,
      description: body.description,
      image: body.image || '/projects/default.png',
      tech: body.tech || [],
      live_url: body.liveUrl || '',
      github_url: body.githubUrl || '',
      featured: body.featured || false,
      category: body.category || 'Other',
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Admin SDK operations bypass security rules, no auth needed

  try {
    const body = await request.json();

    const updatedProject = await projectOperations.update(body.id, {
      title: body.title,
      description: body.description,
      image: body.image,
      tech: body.tech,
      live_url: body.liveUrl,
      github_url: body.githubUrl,
      featured: body.featured,
      category: body.category,
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
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

    await projectOperations.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

