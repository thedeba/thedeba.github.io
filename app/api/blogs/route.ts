import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Blog } from '@/lib/firebase-data';

// Blog operations using admin SDK
const blogOperations = {
  async getAll(): Promise<Blog[]> {
    const snapshot = await db.collection('blogs').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog));
  },

  async getById(id: string): Promise<Blog | null> {
    const doc = await db.collection('blogs').doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Blog) : null;
  },

  async create(blog: Omit<Blog, 'id'>): Promise<Blog> {
    const docRef = await db.collection('blogs').add(blog);
    const newDoc = await docRef.get();
    return { id: newDoc.id, ...newDoc.data() } as Blog;
  },

  async update(id: string, updates: Partial<Blog>): Promise<Blog> {
    await db.collection('blogs').doc(id).update(updates);
    const updatedDoc = await db.collection('blogs').doc(id).get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as Blog;
  },

  async delete(id: string): Promise<void> {
    await db.collection('blogs').doc(id).delete();
  }
};

export async function GET() {
  try {
    const blogs = await blogOperations.getAll();
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Admin SDK operations bypass security rules, no auth needed

  try {
    const body = await request.json();

    const newBlog = await blogOperations.create({
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      read_time: body.readTime || '5 min read',
      image: body.image || null
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Admin SDK operations bypass security rules, no auth needed

  try {
    const body = await request.json();

    const updatedBlog = await blogOperations.update(body.id, {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      read_time: body.readTime,
      image: body.image || null
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
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

    await blogOperations.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}