import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { ContactMessage } from '@/lib/firebase-data';

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: 'deba-portfolio',
      clientEmail: 'firebase-adminsdk-fbsvc-0af458b284@deba-portfolio.iam.gserviceaccount.com',
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// Contact message operations using admin SDK
const contactMessageOperations = {
  async getAll(): Promise<ContactMessage[]> {
    const snapshot = await db.collection('contact_messages').orderBy('created_at', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
  },

  async getById(id: string): Promise<ContactMessage | null> {
    const doc = await db.collection('contact_messages').doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as ContactMessage) : null;
  },

  async create(message: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>): Promise<ContactMessage> {
    const newMessage = {
      ...message,
      created_at: admin.firestore.Timestamp.now(),
      updated_at: admin.firestore.Timestamp.now(),
    };
    
    const docRef = await db.collection('contact_messages').add(newMessage);
    const newDoc = await docRef.get();
    return { id: newDoc.id, ...newDoc.data() } as ContactMessage;
  },

  async update(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage> {
    const updateData = {
      ...updates,
      updated_at: admin.firestore.Timestamp.now()
    };
    
    await db.collection('contact_messages').doc(id).update(updateData);
    const updatedDoc = await db.collection('contact_messages').doc(id).get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as ContactMessage;
  },

  async delete(id: string): Promise<void> {
    await db.collection('contact_messages').doc(id).delete();
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const newMessage = await contactMessageOperations.create({
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      status: 'unread'
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await contactMessageOperations.getAll();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 });
    }

    const updatedMessage = await contactMessageOperations.update(body.id, {
      status: body.status
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 });
    }

    await contactMessageOperations.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
