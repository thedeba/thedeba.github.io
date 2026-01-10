"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from 'react-hot-toast';
import { generateRandomImage } from "@/lib/image-generator";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
  image?: string;
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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

export default function Admin() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blogs' | 'projects' | 'speaking' | 'messages'>('blogs');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [speakingEngagements, setSpeakingEngagements] = useState<SpeakingEngagement[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Blog | Project | SpeakingEngagement | Publication | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ id: string; type: 'blog' | 'project' } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Form states
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    readTime: '5 min read',
    image: ''
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

    return () => {
      subscription.unsubscribe();
      // Cancel any ongoing requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [router]);

  const loadData = async () => {
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      const [blogsResponse, projectsResponse, speakingResponse, messagesResponse] = await Promise.all([
        fetch('/api/blogs', { signal: abortControllerRef.current.signal }),
        fetch('/api/projects', { signal: abortControllerRef.current.signal }),
        fetch('/api/speaking-publications', { signal: abortControllerRef.current.signal }),
        fetch('/api/contact-messages', { signal: abortControllerRef.current.signal })
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

      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setContactMessages(messagesData);
      }
    } catch (error) {
      // Ignore AbortError as it's expected when requests are cancelled
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
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

    const abortController = new AbortController();

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify(body),
        signal: abortController.signal
      });

      if (response.ok) {
        loadData();
        resetBlogForm();
        toast.success(`Blog ${isEditing ? 'updated' : 'created'} successfully!`, { duration: 3000 });
      } else {
        alert('Error saving data');
      }
    } catch (error) {
      // Ignore AbortError as it's expected when requests are cancelled
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
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

    const abortController = new AbortController();

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify(body),
        signal: abortController.signal
      });

      if (response.ok) {
        loadData();
        resetProjectForm();
        toast.success(`Project ${isEditing ? 'updated' : 'created'} successfully!`, { duration: 3000 });
      } else {
        alert('Error saving data');
      }
    } catch (error) {
      // Ignore AbortError as it's expected when requests are cancelled
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
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
        image: blog.image || ''
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

  const handleDelete = (id: string) => {
    const type = activeTab === 'blogs' ? 'blog' : 'project';
    setDeleteItem({ id, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;

    const endpoint = deleteItem.type === 'blog' ? `/api/blogs?id=${deleteItem.id}` : `/api/projects?id=${deleteItem.id}`;
    const abortController = new AbortController();

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(endpoint, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        signal: abortController.signal
      });

      if (response.ok) {
        loadData();
        toast.success(`${deleteItem.type === 'blog' ? 'Blog' : 'Project'} deleted successfully!`, { duration: 3000 });
      } else {
        alert('Error deleting item');
      }
    } catch (error) {
      // Ignore AbortError as it's expected when requests are cancelled
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Error deleting:', error);
      alert('Error deleting item');
    } finally {
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

  const resetBlogForm = () => {
    setBlogFormData({
      title: '',
      excerpt: '',
      content: '',
      readTime: '5 min read',
      image: ''
    });
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleGenerateRandomImage = () => {
    const randomImageUrl = generateRandomImage(800, 400);
    setBlogFormData({ ...blogFormData, image: randomImageUrl });
    toast.success('Random image generated!');
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
    const abortController = new AbortController();

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
        signal: abortController.signal
      });
      
      if (response.ok) {
        const result = await response.json();
        // Update local state with the data returned from database (which has correct IDs)
        setSpeakingEngagements(result.data.speakingEngagements);
        setPublications(result.data.publications);
        toast.success('Speaking & Publications saved successfully!', { duration: 3000 });
      } else {
        alert('Error saving data');
      }
    } catch (error) {
      // Ignore AbortError as it's expected when requests are cancelled
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Error saving:', error);
      alert('Error saving data');
    }
  };

  const updateMessageStatus = async (messageId: string, status: 'unread' | 'read' | 'replied') => {
    try {
      const response = await fetch('/api/contact-messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: messageId, status }),
      });

      if (response.ok) {
        loadData(); // Refresh the messages list
        toast.success(`Message marked as ${status}!`, { duration: 3000 });
      } else {
        alert('Error updating message status');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Error updating message status');
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`/api/contact-messages?id=${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadData(); // Refresh the messages list
        toast.success('Message deleted successfully!', { duration: 3000 });
      } else {
        alert('Error deleting message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
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
          <button
            onClick={() => {
              setActiveTab('messages');
            }}
            className={`ml-4 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'messages'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Messages ({contactMessages.filter(m => m.status === 'unread').length})
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
              {activeTab === 'messages' ? 'Contact Messages' :
               activeTab === 'speaking' ? 'Speaking & Publications Management' : 
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
                <div>
                  <label className="block text-sm font-medium mb-2">Blog Image</label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={blogFormData.image}
                        onChange={(e) => setBlogFormData({ ...blogFormData, image: e.target.value })}
                        className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white"
                        placeholder="Enter image URL or generate random"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateRandomImage}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
                      >
                        Generate Random
                      </button>
                    </div>
                    {blogFormData.image && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
                        <img
                          src={blogFormData.image}
                          alt="Blog preview"
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-600"
                          onError={(e) => {
                            e.currentTarget.src = '';
                            toast.error('Failed to load image preview');
                          }}
                        />
                      </div>
                    )}
                  </div>
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
            ) : activeTab === 'projects' ? (
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
            ) : activeTab === 'messages' ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Contact Messages</h3>
                  <p className="text-gray-400">
                    View and manage messages from your contact form
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">{contactMessages.length}</div>
                    <div className="text-sm text-gray-400">Total Messages</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-400">{contactMessages.filter(m => m.status === 'unread').length}</div>
                    <div className="text-sm text-gray-400">Unread</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">{contactMessages.filter(m => m.status === 'read').length}</div>
                    <div className="text-sm text-gray-400">Read</div>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>

          {/* List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-6">
              {activeTab === 'messages' ? 'Contact Messages' :
               activeTab === 'speaking' ? 'Current Speaking & Publications' :
               activeTab === 'blogs' ? 'Blog Posts' : 'Projects'} 
              ({activeTab === 'messages' ? contactMessages.length :
                activeTab === 'speaking' ? `${speakingEngagements.length + publications.length} items` :
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
              ) : activeTab === 'projects' ? (
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
              ) : activeTab === 'messages' ? (
                contactMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400">No messages yet.</div>
                  </div>
                ) : (
                  contactMessages.map((message) => (
                    <div key={message.id} className={`bg-gray-700 rounded-lg p-4 ${message.status === 'unread' ? 'border-l-4 border-yellow-400' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{message.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded ${
                              message.status === 'unread' ? 'bg-yellow-600 text-black' :
                              message.status === 'read' ? 'bg-blue-600 text-white' :
                              'bg-green-600 text-white'
                            }`}>
                              {message.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-1">{message.email}</p>
                          <p className="text-sm font-medium text-blue-300 mb-2">{message.subject}</p>
                          <p className="text-gray-300 text-sm">{message.message}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {message.status === 'unread' && (
                            <button
                              onClick={() => updateMessageStatus(message.id, 'read')}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors"
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(message.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )
              ) : null}
            </div>
          </motion.div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Delete {deleteItem?.type === 'blog' ? 'Blog' : 'Project'}</h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this {deleteItem?.type}? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteItem(null);
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
