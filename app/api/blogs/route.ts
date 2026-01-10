import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { blogOperations, Blog } from '@/lib/supabase-data';

export async function GET() {
  try {
    const blogs = await blogOperations.getAll();
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Verify authentication
  const isAuthorized = await verifyAdminAuth(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
  // Verify authentication
  const isAuthorized = await verifyAdminAuth(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
  // Verify authentication
  const isAuthorized = await verifyAdminAuth(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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