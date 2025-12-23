import { supabase } from './supabase';

// Blog types
export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  read_time: string;
}

// Project types
export interface Project {
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

// Speaking engagement types
export interface SpeakingEngagement {
  id: number;
  title: string;
  event: string;
  date: string;
  location: string;
  type: string;
}

// Publication types
export interface Publication {
  id: number;
  title: string;
  journal: string;
  date: string;
  authors: string;
  link: string;
}

// Blog operations
export const blogOperations = {
  async getAll(): Promise<Blog[]> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Blog | null> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(blog: Omit<Blog, 'id'>): Promise<Blog> {
    const newBlog = {
      ...blog,
      id: Date.now().toString(),
    };
    
    const { data, error } = await supabase
      .from('blogs')
      .insert(newBlog)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Blog>): Promise<Blog> {
    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Project operations
export const projectOperations = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(project: Omit<Project, 'id'>): Promise<Project> {
    const newProject = {
      ...project,
      id: Date.now().toString(),
    };
    
    const { data, error } = await supabase
      .from('projects')
      .insert(newProject)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Speaking engagement operations
export const speakingEngagementOperations = {
  async getAll(): Promise<SpeakingEngagement[]> {
    const { data, error } = await supabase
      .from('speaking_engagements')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<SpeakingEngagement | null> {
    const { data, error } = await supabase
      .from('speaking_engagements')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(engagement: Omit<SpeakingEngagement, 'id'>): Promise<SpeakingEngagement> {
    const { data, error } = await supabase
      .from('speaking_engagements')
      .insert(engagement)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, updates: Partial<SpeakingEngagement>): Promise<SpeakingEngagement> {
    const { data, error } = await supabase
      .from('speaking_engagements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('speaking_engagements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Publication operations
export const publicationOperations = {
  async getAll(): Promise<Publication[]> {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<Publication | null> {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(publication: Omit<Publication, 'id'>): Promise<Publication> {
    const { data, error } = await supabase
      .from('publications')
      .insert(publication)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, updates: Partial<Publication>): Promise<Publication> {
    const { data, error } = await supabase
      .from('publications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Combined operations for speaking publications
export const speakingPublicationsOperations = {
  async getAll() {
    const [speakingEngagements, publications] = await Promise.all([
      speakingEngagementOperations.getAll(),
      publicationOperations.getAll()
    ]);
    
    return {
      speakingEngagements,
      publications
    };
  },

  async updateAll(data: { speakingEngagements: SpeakingEngagement[], publications: Publication[] }) {
    // This is a more complex operation - we'll need to handle updates carefully
    // For now, we'll implement a simple approach: delete all and reinsert
    
    // Delete existing data
    await supabase.from('speaking_engagements').delete().neq('id', -1);
    await supabase.from('publications').delete().neq('id', -1);
    
    // Insert new data
    const [newSpeaking, newPublications] = await Promise.all([
      supabase.from('speaking_engagements').insert(data.speakingEngagements).select(),
      supabase.from('publications').insert(data.publications).select()
    ]);
    
    if (newSpeaking.error) throw newSpeaking.error;
    if (newPublications.error) throw newPublications.error;
    
    return {
      speakingEngagements: newSpeaking.data || [],
      publications: newPublications.data || []
    };
  }
};
