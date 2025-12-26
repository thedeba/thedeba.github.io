import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { projectOperations, Project } from '@/lib/supabase-data';

export async function GET() {
  try {
    const projects = await projectOperations.getAll();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
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
  // Verify authentication
  const isAuthorized = await verifyAdminAuth(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

    await projectOperations.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

