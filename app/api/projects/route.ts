import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'projects.json');

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  category: string;
}

function readProjects(): Project[] {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeProjects(projects: Project[]): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(projects, null, 2));
}

export async function GET() {
  const projects = readProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const projects = readProjects();

    const newProject: Project = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      image: body.image || '/projects/default.png',
      tech: body.tech || [],
      liveUrl: body.liveUrl || '',
      githubUrl: body.githubUrl || '',
      featured: body.featured || false,
      category: body.category || 'Other',
    };

    projects.unshift(newProject);
    writeProjects(projects);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const projects = readProjects();

    const index = projects.findIndex(project => project.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    projects[index] = {
      ...projects[index],
      title: body.title,
      description: body.description,
      image: body.image,
      tech: body.tech,
      liveUrl: body.liveUrl,
      githubUrl: body.githubUrl,
      featured: body.featured,
      category: body.category,
    };

    writeProjects(projects);
    return NextResponse.json(projects[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const projects = readProjects();
    const filteredProjects = projects.filter(project => project.id !== id);

    if (filteredProjects.length === projects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    writeProjects(filteredProjects);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

