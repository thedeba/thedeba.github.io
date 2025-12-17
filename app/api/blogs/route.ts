import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'blogs.json');

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
}

function readBlogs(): Blog[] {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeBlogs(blogs: Blog[]): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(blogs, null, 2));
}

export async function GET() {
  const blogs = readBlogs();
  return NextResponse.json(blogs);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const blogs = readBlogs();

    const newBlog: Blog = {
      id: Date.now().toString(),
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      readTime: body.readTime || '5 min read'
    };

    blogs.unshift(newBlog); // Add to beginning
    writeBlogs(blogs);

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const blogs = readBlogs();

    const index = blogs.findIndex(blog => blog.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    blogs[index] = {
      ...blogs[index],
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      readTime: body.readTime
    };

    writeBlogs(blogs);
    return NextResponse.json(blogs[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const blogs = readBlogs();
    const filteredBlogs = blogs.filter(blog => blog.id !== id);

    if (filteredBlogs.length === blogs.length) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    writeBlogs(filteredBlogs);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}