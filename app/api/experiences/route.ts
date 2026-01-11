import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { experienceOperations, Experience } from '@/lib/supabase-data';

export async function GET() {
  try {
    const experiences = await experienceOperations.getAll();
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
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
  // Verify authentication
  const isAuthorized = await verifyAdminAuth(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

    await experienceOperations.delete(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
