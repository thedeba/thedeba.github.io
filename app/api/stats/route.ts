import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth, createAuthResponse } from '@/lib/auth';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await db.collection('stats').orderBy('created_at', 'desc').get();
    const stats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return createAuthResponse();
    }

    const body = await request.json();
    
    if (!body.id || body.value === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = db.collection('stats').doc(body.id);
    
    // First, let's check if the stat exists
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Stat not found' }, { status: 404 });
    }

    // Update stat
    await docRef.update({ 
      value: body.value,
      suffix: body.suffix,
      label: body.label,
      updated_at: new Date()
    });

    const updatedDoc = await docRef.get();
    return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating stat:', error);
    return NextResponse.json({ error: 'Failed to update stat' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return createAuthResponse();
    }

    const body = await request.json();

    // Validate required fields
    if (!body.label || body.value === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create new stat
    const newStat = {
      label: body.label,
      value: body.value,
      suffix: body.suffix || '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const docRef = await db.collection('stats').add(newStat);
    const newDoc = await docRef.get();
    
    return NextResponse.json({ id: newDoc.id, ...newDoc.data() });
  } catch (error) {
    console.error('Error creating stat:', error);
    return NextResponse.json({ error: 'Failed to create stat' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return createAuthResponse();
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing stat ID' }, { status: 400 });
    }

    await db.collection('stats').doc(id).delete();

    return NextResponse.json({ message: 'Stat deleted successfully' });
  } catch (error) {
    console.error('Error deleting stat:', error);
    return NextResponse.json({ error: 'Failed to delete stat' }, { status: 500 });
  }
}
