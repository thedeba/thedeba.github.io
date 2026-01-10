import { NextRequest, NextResponse } from 'next/server';
import { contactMessageOperations, ContactMessage } from '@/lib/supabase-data';

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
