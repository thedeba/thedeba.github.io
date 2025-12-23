"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function Admin() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blogs' | 'projects' | 'speaking'>('blogs');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [speakingEngagements, setSpeakingEngagements] = useState<SpeakingEngagement[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Blog | Project | SpeakingEngagement | Publication | null>(null);

  // Form states
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    readTime: '5 min read'
  });

  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    image: '',
    tech: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    category: 'Other'
  });

  const [speakingFormData, setSpeakingFormData] = useState({
    title: '',
    event: '',
    date: '',
    location: '',
    type: 'talk' as 'talk' | 'workshop' | 'panel'
  });

  const [publicationFormData, setPublicationFormData] = useState({
    title: '',
    journal: '',
    date: '',
    authors: '',
    link: ''
  });

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }
      setUser(session.user);
      setLoading(false);
      loadData();
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/auth/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const loadData = async () => {
    try {
      const [blogsResponse, projectsResponse, speakingResponse] = await Promise.all([
        fetch('/api/blogs'),
        fetch('/api/projects'),
        fetch('/api/speaking-publications')
      ]);

      if (blogsResponse.ok) {
        const blogsData = await blogsResponse.json();
        setBlogs(blogsData);
      }

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      }

      if (speakingResponse.ok) {
        const speakingData = await speakingResponse.json();
        setSpeakingEngagements(speakingData.speakingEngagements || []);
        setPublications(speakingData.publications || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = '/api/blogs';
    const method = isEditing ? 'PUT' : 'POST';
    const body = {
      ...blogFormData,
      ...(isEditing && editingItem && { id: editingItem.id }),
    };

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        loadData();
        resetBlogForm();
        alert(`Blog ${isEditing ? 'updated' : 'created'} successfully!`);
      } else {
        alert('Error saving data');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving data');
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = '/api/projects';
    const method = isEditing ? 'PUT' : 'POST';
    const body = {
      ...projectFormData,
      tech: projectFormData.tech.split(',').map(t => t.trim()).filter(t => t),
      ...(isEditing && editingItem && { id: editingItem.id }),
    };

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        loadData();
        resetProjectForm();
        alert(`Project ${isEditing ? 'updated' : 'created'} successfully!`);
      } else {
        alert('Error saving data');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving data');
    }
  };

  const handleEdit = (item: Blog | Project | SpeakingEngagement | Publication) => {
    setIsEditing(true);
    setEditingItem(item);

    if (activeTab === 'blogs') {
      const blog = item as Blog;
      setBlogFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        readTime: blog.readTime,
      });
    } else if (activeTab === 'projects') {
      const project = item as Project;
      setProjectFormData({
        title: project.title,
        description: project.description,
        image: project.image,
        tech: project.tech.join(', '),
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        featured: project.featured,
        category: project.category,
      });
    } else {
      // Handle speaking/publications editing inline
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const endpoint = activeTab === 'blogs' ? `/api/blogs?id=${id}` : `/api/projects?id=${id}`;

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(endpoint, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      });

      if (response.ok) {
        loadData();
        alert('Item deleted successfully!');
      } else {
        alert('Error deleting item');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting item');
    }
  };

  const resetBlogForm = () => {
    setBlogFormData({
      title: '',
      excerpt: '',
      content: '',
      readTime: '5 min read'
    });
    setIsEditing(false);
    setEditingItem(null);
  };

  const resetProjectForm = () => {
    setProjectFormData({
      title: '',
      description: '',
      image: '',
      tech: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      category: 'Other'
    });
    setIsEditing(false);
    setEditingItem(null);
  };

  const addSpeakingEngagement = () => {
    const newItem = { ...speakingFormData, id: Date.now() };
    setSpeakingEngagements([...speakingEngagements, newItem]);
    setSpeakingFormData({ title: '', event: '', date: '', location: '', type: 'talk' });
  };

  const removeSpeakingEngagement = (id: number) => {
    setSpeakingEngagements(speakingEngagements.filter(item => item.id !== id));
  };

  const addPublication = () => {
    const newItem = { ...publicationFormData, id: Date.now() };
    setPublications([...publications, newItem]);
    setPublicationFormData({ title: '', journal: '', date: '', authors: '', link: '' });
  };

  const removePublication = (id: number) => {
    setPublications(publications.filter(item => item.id !== id));
  };

  const handleSpeakingSave = async () => {
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/speaking-publications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({ speakingEngagements, publications }),
      });
      
      if (response.ok) {
        alert('Speaking & Publications saved successfully!');
      } else {
        alert('Error saving data');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving data');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with logout */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-gray-300">Manage your blogs and projects</p>
            {user && (
              <p className="text-sm text-gray-400 mt-1">
                Logged in as: {user.email}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex mb-8">
          <button
            onClick={() => {
              setActiveTab('blogs');
              resetBlogForm();
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'blogs'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Blogs
          </button>
          <button
            onClick={() => {
              setActiveTab('projects');
              resetProjectForm();
            }}
            className={`ml-4 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => {
              setActiveTab('speaking');
            }}
            className={`ml-4 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'speaking'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Speaking & Publications
          </button>
        </div>
        

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-6">
              {activeTab === 'speaking' ? 'Speaking & Publications Management' : 
               isEditing ? 'Edit' : 'Add'} {activeTab === 'blogs' ? 'Blog' : 
               activeTab === 'projects' ? 'Project' : ''}
            </h2>

            {activeTab === 'speaking' ? (
              <div className="space-y-8">
                {/* Speaking Engagements Section */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Speaking Engagements</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Title"
                      className="p-2 bg-gray-600 rounded"
                      value={speakingFormData.title}
                      onChange={(e) => setSpeakingFormData({...speakingFormData, title: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Event"
                      className="p-2 bg-gray-600 rounded"
                      value={speakingFormData.event}
                      onChange={(e) => setSpeakingFormData({...speakingFormData, event: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Date (e.g., January 2024)"
                      className="p-2 bg-gray-600 rounded"
                      value={speakingFormData.date}
                      onChange={(e) => setSpeakingFormData({...speakingFormData, date: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      className="p-2 bg-gray-600 rounded"
                      value={speakingFormData.location}
                      onChange={(e) => setSpeakingFormData({...speakingFormData, location: e.target.value})}
                    />
                    <select
                      className="p-2 bg-gray-600 rounded"
                      value={speakingFormData.type}
                      onChange={(e) => setSpeakingFormData({...speakingFormData, type: e.target.value as any})}
                    >
                      <option value="talk">Talk</option>
                      <option value="workshop">Workshop</option>
                      <option value="panel">Panel</option>
                    </select>
                    <button
                      type="button"
                      onClick={addSpeakingEngagement}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium"
                    >
                      Add Engagement
                    </button>
                  </div>

                  <div className="space-y-2">
                    {speakingEngagements.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-600 rounded">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-300">{item.event} • {item.date}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSpeakingEngagement(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Publications Section */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Publications</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Title"
                      className="p-2 bg-gray-600 rounded"
                      value={publicationFormData.title}
                      onChange={(e) => setPublicationFormData({...publicationFormData, title: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Journal/Conference"
                      className="p-2 bg-gray-600 rounded"
                      value={publicationFormData.journal}
                      onChange={(e) => setPublicationFormData({...publicationFormData, journal: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Date (e.g., 2024)"
                      className="p-2 bg-gray-600 rounded"
                      value={publicationFormData.date}
                      onChange={(e) => setPublicationFormData({...publicationFormData, date: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Authors"
                      className="p-2 bg-gray-600 rounded"
                      value={publicationFormData.authors}
                      onChange={(e) => setPublicationFormData({...publicationFormData, authors: e.target.value})}
                    />
                    <input
                      type="url"
                      placeholder="Link to publication"
                      className="p-2 bg-gray-600 rounded md:col-span-2"
                      value={publicationFormData.link}
                      onChange={(e) => setPublicationFormData({...publicationFormData, link: e.target.value})}
                    />
                    <button
                      type="button"
                      onClick={addPublication}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium md:col-span-2"
                    >
                      Add Publication
                    </button>
                  </div>

                  <div className="space-y-2">
                    {publications.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-600 rounded">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-300">{item.journal} • {item.date}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePublication(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSpeakingSave}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
                >
                  Save All Changes
                </button>
              </div>
            ) : activeTab === 'blogs' ? (
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={blogFormData.title}
                    onChange={(e) => setBlogFormData({...blogFormData, title: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt</label>
                  <textarea
                    value={blogFormData.excerpt}
                    onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white h-20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={blogFormData.content}
                    onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white h-32"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Read Time</label>
                  <input
                    type="text"
                    value={blogFormData.readTime}
                    onChange={(e) => setBlogFormData({ ...blogFormData, readTime: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetBlogForm}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={projectFormData.title}
                    onChange={(e) => setProjectFormData({...projectFormData, title: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={projectFormData.description}
                    onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white h-20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="text"
                    value={projectFormData.image}
                    onChange={(e) => setProjectFormData({ ...projectFormData, image: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                    placeholder="/projects/image.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    value={projectFormData.tech}
                    onChange={(e) => setProjectFormData({ ...projectFormData, tech: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Live URL</label>
                  <input
                    type="url"
                    value={projectFormData.liveUrl}
                    onChange={(e) => setProjectFormData({ ...projectFormData, liveUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={projectFormData.githubUrl}
                    onChange={(e) => setProjectFormData({ ...projectFormData, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={projectFormData.category}
                    onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={projectFormData.featured}
                    onChange={(e) => setProjectFormData({ ...projectFormData, featured: e.target.checked })}
                    className="w-4 h-4 mr-2"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Featured Project</label>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetProjectForm}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </motion.div>

          {/* List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-6">
              {activeTab === 'speaking' ? 'Current Speaking & Publications' :
               activeTab === 'blogs' ? 'Blog Posts' : 'Projects'} 
              ({activeTab === 'speaking' ? `${speakingEngagements.length + publications.length} items` :
                activeTab === 'blogs' ? blogs.length : projects.length})
            </h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {activeTab === 'speaking' ? (
                <>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-blue-400">Speaking Engagements ({speakingEngagements.length})</h3>
                    {speakingEngagements.map((item) => (
                      <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-300 mb-2">{item.event} • {item.date} • {item.location}</p>
                        <span className="inline-block px-2 py-1 bg-blue-600 text-xs rounded mb-2">
                          {item.type}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-purple-400">Publications ({publications.length})</h3>
                    {publications.map((item) => (
                      <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-300 mb-2">{item.journal} • {item.date}</p>
                        <p className="text-sm text-gray-400">{item.authors}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : activeTab === 'blogs' ? (
                blogs.map((item) => (
                  <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">{item.excerpt}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                projects.map((item) => (
                  <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
