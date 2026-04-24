import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export async function POST(request: Request) {
  try {
    // Insert dummy data with timestamp
    const docRef = await db.collection('dummy_activity').add({
      activity_data: `Keep-alive ping - ${new Date().toISOString()}`,
      created_at: new Date()
    })

    const newDoc = await docRef.get()

    return NextResponse.json(
      {
        success: true,
        message: 'Dummy activity recorded successfully',
        data: { id: newDoc.id, ...newDoc.data() }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to check latest dummy activity
export async function GET(request: Request) {
  try {
    // Get latest dummy activity
    const snapshot = await db.collection('dummy_activity')
      .orderBy('created_at', 'desc')
      .limit(1)
      .get()

    const lastActivity = snapshot.docs.length > 0 ? 
      { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } : null

    return NextResponse.json(
      {
        success: true,
        lastActivity
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
