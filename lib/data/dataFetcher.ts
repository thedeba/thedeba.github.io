// Check if we're in GitHub Pages build mode
const isStaticBuild = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages';

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

// Universal data fetchers - Client-side only
export async function fetchBlogs(): Promise<Blog[]> {
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
  try {
    const response = await fetch('/api/speaking-publications');
    if (!response.ok) throw new Error('Failed to fetch speaking publications');
    return response.json();
  } catch (error) {
    console.error('Error fetching speaking publications:', error);
    return { speakingEngagements: [], publications: [] };
  }
}

// For client-side usage, we need to check if we're in the browser
export function isClientSideStatic(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if we're on GitHub Pages by looking at the hostname
  return window.location.hostname === 'thedeba.github.io';
}

// Client-side data fetchers
export async function fetchBlogsClient(): Promise<Blog[]> {
  if (isClientSideStatic()) {
    // For GitHub Pages, fetch the static JSON file
    try {
      const response = await fetch('/debashish-portfolio/data/blogs.json');
      if (!response.ok) throw new Error('Failed to fetch static blogs');
      return response.json();
    } catch (error) {
      console.error('Error fetching static blogs:', error);
      return [];
    }
  }
  
  // Dynamic environment - use API
  try {
    const response = await fetch('/api/blogs');
    if (!response.ok) throw new Error('Failed to fetch blogs');
    return response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function fetchProjectsClient(): Promise<Project[]> {
  if (isClientSideStatic()) {
    try {
      const response = await fetch('/debashish-portfolio/data/projects.json');
      if (!response.ok) throw new Error('Failed to fetch static projects');
      return response.json();
    } catch (error) {
      console.error('Error fetching static projects:', error);
      return [];
    }
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

export async function fetchSpeakingPublicationsClient(): Promise<SpeakingPublicationsData> {
  if (isClientSideStatic()) {
    try {
      const response = await fetch('/debashish-portfolio/data/speaking-publications.json');
      if (!response.ok) throw new Error('Failed to fetch static speaking publications');
      return response.json();
    } catch (error) {
      console.error('Error fetching static speaking publications:', error);
      return { speakingEngagements: [], publications: [] };
    }
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
