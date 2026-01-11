// Check if we're in GitHub Pages build mode
const isStaticBuild = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages';

// Types
interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  read_time: string;
  content: string;
  image?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  live_url: string;
  github_url: string;
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

interface Experience {
  id: number;
  type: 'work' | 'education';
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
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

export async function fetchExperiences(): Promise<Experience[]> {
  try {
    const response = await fetch('/api/experiences');
    if (!response.ok) throw new Error('Failed to fetch experiences');
    return response.json();
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}

// For client-side usage, we need to check if we're in the browser
export function isClientSideStatic(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if we're on GitHub Pages by looking at the hostname
  return window.location.hostname === 'thedeba.github.io';
}

// Client-side data fetchers - now all use API since we moved to Supabase
export async function fetchBlogsClient(): Promise<Blog[]> {
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
  try {
    const response = await fetch('/api/speaking-publications');
    if (!response.ok) throw new Error('Failed to fetch speaking publications');
    return response.json();
  } catch (error) {
    console.error('Error fetching speaking publications:', error);
    return { speakingEngagements: [], publications: [] };
  }
}

export async function fetchExperiencesClient(): Promise<Experience[]> {
  try {
    const response = await fetch('/api/experiences');
    if (!response.ok) throw new Error('Failed to fetch experiences');
    return response.json();
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}
