import fs from 'fs';
import path from 'path';

// Check if we're in GitHub Pages build mode
const isStaticBuild = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages';

// Static data paths
const STATIC_DATA_PATHS = {
  blogs: path.join(process.cwd(), 'data', 'blogs.json'),
  projects: path.join(process.cwd(), 'data', 'projects.json'),
  speakingPublications: path.join(process.cwd(), 'data', 'speaking-publications.json'),
};

// Types
interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
}

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

interface SpeakingEngagement {
  id: number;
  title: string;
  event: string;
  date: string;
  location: string;
  type: 'talk' | 'workshop' | 'panel';
}

interface Publication {
  id: number;
  title: string;
  journal: string;
  date: string;
  authors: string;
  link: string;
}

interface SpeakingPublicationsData {
  speakingEngagements: SpeakingEngagement[];
  publications: Publication[];
}

// Static data readers
function readStaticData<T>(filePath: string): T[] {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading static data from ${filePath}:`, error);
    return [];
  }
}

function readStaticDataObject<T>(filePath: string): T {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading static data from ${filePath}:`, error);
    return {} as T;
  }
}

// Server-side data fetchers
export async function fetchBlogs(): Promise<Blog[]> {
  if (isStaticBuild) {
    return readStaticData<Blog>(STATIC_DATA_PATHS.blogs);
  }
  
  try {
    const response = await fetch('/api/blogs');
    if (!response.ok) throw new Error('Failed to fetch blogs');
    return response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function fetchProjects(): Promise<Project[]> {
  if (isStaticBuild) {
    return readStaticData<Project>(STATIC_DATA_PATHS.projects);
  }
  
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function fetchSpeakingPublications(): Promise<SpeakingPublicationsData> {
  if (isStaticBuild) {
    return readStaticDataObject<SpeakingPublicationsData>(STATIC_DATA_PATHS.speakingPublications);
  }
  
  try {
    const response = await fetch('/api/speaking-publications');
    if (!response.ok) throw new Error('Failed to fetch speaking publications');
    return response.json();
  } catch (error) {
    console.error('Error fetching speaking publications:', error);
    return { speakingEngagements: [], publications: [] };
  }
}
