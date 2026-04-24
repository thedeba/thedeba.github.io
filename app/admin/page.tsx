"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
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
  id: string;
  title: string;
  event: string;
  date: string;
  location: string;
  type: 'talk' | 'workshop' | 'panel';
}

interface Publication {
  id: string;
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

interface Experience {
  id: number;
  type: 'work' | 'education';
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

export default function Admin() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blogs' | 'projects' | 'speaking' | 'messages' | 'stats' | 'experiences'>('blogs');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [speakingEngagements, setSpeakingEngagements] = useState<SpeakingEngagement[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Blog | Project | SpeakingEngagement | Publication | Stat | Experience | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ id: string; type: 'blog' | 'project' | 'stat' | 'experience' } | null>(null);
  const [showEmailLogout, setShowEmailLogout] = useState(false);
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

  const [statFormData, setStatFormData] = useState({
    label: '',
    value: '',
    suffix: ''
  });

  const [experienceFormData, setExperienceFormData] = useState({
    type: 'work' as 'work' | 'education',
    title: '',
    company: '',
    period: '',
    description: '',
    skills: ''
  });

  useEffect(() => {
    // Check authentication
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);
      setLoading(false);
      loadData(); // Load data when authenticated
    });

    return () => unsubscribe();
  }, [router]);

  const loadData = async () => {
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      console.log('Starting loadData...');
      // Get authentication token
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;
      
      const headers: { [key: string]: string } = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      console.log('Making API requests with headers:', headers);
      
      const [blogsResponse, projectsResponse, speakingResponse, messagesResponse, statsResponse, experiencesResponse] = await Promise.all([
        fetch('/api/blogs', { headers, signal: abortControllerRef.current.signal }),
        fetch('/api/projects', { headers, signal: abortControllerRef.current.signal }),
        fetch('/api/speaking-publications', { signal: abortControllerRef.current.signal }), // No auth headers for GET
        fetch('/api/contact-messages', { headers, signal: abortControllerRef.current.signal }),
        fetch('/api/stats', { headers, signal: abortControllerRef.current.signal }),
        fetch('/api/experiences', { headers, signal: abortControllerRef.current.signal })
      ]);

      console.log('API Responses:', {
        blogs: blogsResponse.ok,
        projects: projectsResponse.ok,
        speaking: speakingResponse.ok,
        messages: messagesResponse.ok,
        stats: statsResponse.ok,
        experiences: experiencesResponse.ok
      });

      if (blogsResponse.ok) {
        const blogsData = await blogsResponse.json();
        console.log('Blogs loaded:', blogsData.length);
        setBlogs(blogsData);
      }

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        console.log('Projects loaded from API:', projectsData.length, projectsData);
        setProjects(projectsData);
        console.log('Projects state set to:', projectsData.length);
      } else {
        console.error('Failed to load projects:', projectsResponse.status, projectsResponse.statusText);
      }

      if (speakingResponse.ok) {
        const speakingData = await speakingResponse.json();
        console.log('Speaking data loaded:', speakingData);
        setSpeakingEngagements(speakingData.speakingEngagements || []);
        setPublications(speakingData.publications || []);
        console.log('Set speaking engagements:', speakingData.speakingEngagements?.length || 0, 'items');
        console.log('Set publications:', speakingData.publications?.length || 0, 'items');
      } else {
        console.error('Speaking response not ok:', speakingResponse.status, speakingResponse.statusText);
      }

      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setContactMessages(messagesData);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (experiencesResponse.ok) {
        const experiencesData = await experiencesResponse.json();
        console.log('Experiences loaded:', experiencesData);
        setExperiences(experiencesData);
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
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      const token = await user.getIdToken();
      
      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      const token = await user.getIdToken();
      
      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
        signal: abortController.signal
      });

      if (response.ok) {
        loadData();
        resetProjectForm();
        toast.success(`Project ${isEditing ? 'updated' : 'created'} successfully!`, { duration: 3000 });
        
        // Automatically switch to projects tab to show new data
        setActiveTab('projects');
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

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = '/api/experiences';
    const method = isEditing ? 'PUT' : 'POST';
    const body = {
      ...experienceFormData,
      skills: experienceFormData.skills.split(',').map(s => s.trim()).filter(s => s),
      ...(isEditing && editingItem && { id: editingItem.id }),
    };

    const abortController = new AbortController();

    try {
      // Get session token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      const token = await user.getIdToken();
      
      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
        signal: abortController.signal
      });

      if (response.ok) {
        loadData();
        resetExperienceForm();
        toast.success(`Experience ${isEditing ? 'updated' : 'created'} successfully!`, { duration: 3000 });
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

  const handleEdit = (item: Blog | Project | SpeakingEngagement | Publication | Stat | Experience) => {
    console.log('Editing item:', item, 'Active tab:', activeTab);
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
    } else if (activeTab === 'stats') {
      const stat = item as Stat;
      setStatFormData({
        label: stat.label,
        value: stat.value.toString(),
        suffix: stat.suffix
      });
    } else if (activeTab === 'experiences') {
      const experience = item as Experience;
      setExperienceFormData({
        type: experience.type,
        title: experience.title,
        company: experience.company,
        period: experience.period,
        description: experience.description,
        skills: experience.skills.join(', ')
      });
    } else {
      // Handle speaking/publications editing inline
    }
  };

  const handleDelete = (id: string) => {
    let type: 'blog' | 'project' | 'stat' | 'experience';
    if (activeTab === 'blogs') type = 'blog';
    else if (activeTab === 'projects') type = 'project';
    else if (activeTab === 'stats') type = 'stat';
    else if (activeTab === 'experiences') type = 'experience';
    else return;
    
    setDeleteItem({ id, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;

    let endpoint: string;
    if (deleteItem.type === 'blog') {
      endpoint = `/api/blogs?id=${deleteItem.id}`;
    } else if (deleteItem.type === 'project') {
      endpoint = `/api/projects?id=${deleteItem.id}`;
    } else if (deleteItem.type === 'stat') {
      endpoint = `/api/stats?id=${deleteItem.id}`;
    } else if (deleteItem.type === 'experience') {
      endpoint = `/api/experiences?id=${deleteItem.id}`;
    } else {
      return;
    }
    
    const abortController = new AbortController();

    try {
      // Get session token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      const token = await user.getIdToken();
      
      const response = await fetch(endpoint, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: abortController.signal
      });

      if (response.ok) {
        loadData();
        const itemName = deleteItem.type === 'blog' ? 'Blog' : 
                        deleteItem.type === 'project' ? 'Project' : 
                        deleteItem.type === 'stat' ? 'Stat' : 'Experience';
        toast.success(`${itemName} deleted successfully!`, { duration: 3000 });
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

  const resetStatForm = () => {
    setStatFormData({
      label: '',
      value: '',
      suffix: ''
    });
    setIsEditing(false);
    setEditingItem(null);
  };

  const resetExperienceForm = () => {
    setExperienceFormData({
      type: 'work',
      title: '',
      company: '',
      period: '',
      description: '',
      skills: ''
    });
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleStatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = '/api/stats';
    const method = isEditing ? 'PUT' : 'POST';
    const body = {
      ...statFormData,
      value: parseInt(statFormData.value) || 0,
      ...(isEditing && editingItem && { id: editingItem.id }),
    };

    const abortController = new AbortController();

    try {
      // Get session token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      const token = await user.getIdToken();
      
      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
        signal: abortController.signal
      });

      if (response.ok) {
        loadData();
        resetStatForm();
        toast.success(`Stat ${isEditing ? 'updated' : 'created'} successfully!`, { duration: 3000 });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Error saving data';
        alert(errorMessage);
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

  const addSpeakingEngagement = async () => {
    try {
      // Get session token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      const token = await user.getIdToken();
      
      const newItem = { ...speakingFormData, id: Date.now().toString() };
      const updatedSpeakingEngagements = [...speakingEngagements, newItem];
      
      const response = await fetch('/api/speaking-publications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ speakingEngagements: updatedSpeakingEngagements, publications }),
      });
      
      if (response.ok) {
        const result = await response.json();
        // Update local state with the data returned from database (which has correct IDs)
        setSpeakingEngagements(result.data.speakingEngagements);
        setSpeakingFormData({ title: '', event: '', date: '', location: '', type: 'talk' });
      } else {
        throw new Error('Error saving to database');
      }
    } catch (error) {
      console.error('Error adding speaking engagement:', error);
      throw error;
    }
  };

  const removeSpeakingEngagement = async (id: string) => {
    try {
      // Get session token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      const token = await user.getIdToken();
      
      const updatedSpeakingEngagements = speakingEngagements.filter(item => item.id !== id);
      
      const response = await fetch('/api/speaking-publications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ speakingEngagements: updatedSpeakingEngagements, publications }),
      });
      
      if (response.ok) {
        const result = await response.json();
        // Update local state with the data returned from database
        setSpeakingEngagements(result.data.speakingEngagements);
      } else {
        throw new Error('Error saving to database');
      }
    } catch (error) {
      console.error('Error removing speaking engagement:', error);
      toast.error('Error removing speaking engagement');
    }
  };

  const addPublication = async () => {
    try {
      // Get session token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      const token = await user.getIdToken();
      
      const newItem = { ...publicationFormData, id: Date.now().toString() };
      const updatedPublications = [...publications, newItem];
      
      const response = await fetch('/api/speaking-publications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ speakingEngagements, publications: updatedPublications }),
      });
      
      if (response.ok) {
        const result = await response.json();
        // Update local state with the data returned from database (which has correct IDs)
        setPublications(result.data.publications);
        setPublicationFormData({ title: '', journal: '', date: '', authors: '', link: '' });
      } else {
        throw new Error('Error saving to database');
      }
    } catch (error) {
      console.error('Error adding publication:', error);
      throw error;
    }
  };

  const removePublication = async (id: string) => {
    try {
      // Get session token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      const token = await user.getIdToken();
      
      const updatedPublications = publications.filter(item => item.id !== id);
      
      const response = await fetch('/api/speaking-publications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ speakingEngagements, publications: updatedPublications }),
      });
      
      if (response.ok) {
        const result = await response.json();
        // Update local state with the data returned from database
        setPublications(result.data.publications);
      } else {
        throw new Error('Error saving to database');
      }
    } catch (error) {
      console.error('Error removing publication:', error);
      toast.error('Error removing publication');
    }
  };

  const handleSpeakingSave = async () => {
    const abortController = new AbortController();

    try {
      // Get session token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      const token = await user.getIdToken();
      
      const response = await fetch('/api/speaking-publications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
    await signOut(auth);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with logout */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Management Portal
                  </h1>
                </div>
                <p className="text-gray-400 text-base sm:text-lg">Manage your data with ease</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/"
                      className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 hover:border-blue-400/50 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-blue-300 group-hover:text-white transition-colors">View Site</span>
                    </Link>
                  </motion.div>
                  {user && (
                    <div className="relative">
                      <button
                        onClick={() => setShowEmailLogout(!showEmailLogout)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 hover:border-blue-400/50 rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-blue-300 font-medium">{user.email}</span>
                        <svg className="w-3 h-3 text-blue-400 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showEmailLogout && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full mt-2 right-0 z-50"
                        >
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 rounded-lg transition-all duration-300"
                          >
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="text-sm text-red-300 font-medium">Logout</span>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-2 border border-gray-700/50 shadow-xl mb-6 lg:mb-8">
          <div className="flex flex-wrap gap-1">
            <motion.button
              onClick={() => {
                setActiveTab('blogs');
                resetBlogForm();
              }}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base relative overflow-hidden ${
                activeTab === 'blogs'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: activeTab === 'blogs' ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Blogs
              </span>
              {activeTab === 'blogs' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => {
                console.log('Projects button clicked, setting activeTab to projects');
                setActiveTab('projects');
                resetProjectForm();
              }}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base relative overflow-hidden ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: activeTab === 'projects' ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Projects
              </span>
              {activeTab === 'projects' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => {
                setActiveTab('speaking');
              }}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base relative overflow-hidden ${
                activeTab === 'speaking'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: activeTab === 'speaking' ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span className="hidden sm:inline">Speaking & Publications</span>
                <span className="sm:hidden">Speaking</span>
              </span>
              {activeTab === 'speaking' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => {
                setActiveTab('messages');
              }}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base relative overflow-hidden ${
                activeTab === 'messages'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: activeTab === 'messages' ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Messages ({contactMessages.filter(m => m.status === 'unread').length})
              </span>
              {activeTab === 'messages' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => {
                setActiveTab('stats');
                resetStatForm();
              }}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base relative overflow-hidden ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg shadow-yellow-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: activeTab === 'stats' ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Stats
              </span>
              {activeTab === 'stats' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => {
                setActiveTab('experiences');
                resetExperienceForm();
              }}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base relative overflow-hidden ${
                activeTab === 'experiences'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: activeTab === 'experiences' ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A6.937 6.937 0 0112 20.255 6.937 6.937 0 013 13.255V6.937A6.937 6.937 0 0112 0a6.937 6.937 0 019 6.937v6.318zM12 12a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                Experiences
              </span>
              {activeTab === 'experiences' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          </div>
        </div>
        

        <div className={`${activeTab === 'speaking' ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-6 lg:gap-8`}>
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                {activeTab === 'messages' ? 'Contact Messages' :
                 activeTab === 'speaking' ? 'Speaking & Publications Management' : 
                 activeTab === 'stats' ? 'Stats Management' :
                 activeTab === 'experiences' ? 'Experience Management' :
                 isEditing ? 'Edit' : 'Add'} {activeTab === 'blogs' ? 'Blog' : 
                 activeTab === 'projects' ? 'Project' : 
                 activeTab === 'experiences' ? 'Experience' : ''}
              </h2>
            </div>

            {activeTab === 'speaking' ? (
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Speaking Engagements Section - Left */}
                <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-600/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Speaking Engagements</h3>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <motion.input
                      type="text"
                      placeholder="Title"
                      className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      value={speakingFormData.title}
                      onChange={(e) => setSpeakingFormData({...speakingFormData, title: e.target.value})}
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.input
                      type="text"
                      placeholder="Event"
                      className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      value={speakingFormData.event}
                      onChange={(e) => setSpeakingFormData({...speakingFormData, event: e.target.value})}
                      whileFocus={{ scale: 1.02 }}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.input
                        type="text"
                        placeholder="Date (e.g., January 2024)"
                        className="px-4 py-3 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        value={speakingFormData.date}
                        onChange={(e) => setSpeakingFormData({...speakingFormData, date: e.target.value})}
                        whileFocus={{ scale: 1.02 }}
                      />
                      <motion.input
                        type="text"
                        placeholder="Location"
                        className="px-4 py-3 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        value={speakingFormData.location}
                        onChange={(e) => setSpeakingFormData({...speakingFormData, location: e.target.value})}
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>
                    <motion.select
                      className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      value={speakingFormData.type}
                      onChange={(e) => setSpeakingFormData({...speakingFormData, type: e.target.value as any})}
                      whileFocus={{ scale: 1.02 }}
                    >
                      <option value="talk">Talk</option>
                      <option value="workshop">Workshop</option>
                      <option value="panel">Panel</option>
                    </motion.select>
                    <motion.button
                      type="button"
                      onClick={() => {
                        if (speakingFormData.title && speakingFormData.event && speakingFormData.date) {
                          addSpeakingEngagement();
                          toast.success('Speaking engagement added successfully!');
                        } else {
                          toast.error('Please fill in required fields');
                        }
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 rounded-lg font-semibold text-white shadow-lg shadow-green-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Engagement
                    </motion.button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {speakingEngagements.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center p-4 bg-gray-600/30 border border-gray-500/30 rounded-lg hover:bg-gray-600/50 transition-all duration-300"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-300">{item.event} • {item.date} • {item.location}</p>
                          <span className="inline-block px-2 py-1 bg-green-600/30 text-green-300 text-xs rounded-full mt-2">
                            {item.type}
                          </span>
                        </div>
                        <motion.button
                          type="button"
                          onClick={() => {
                            removeSpeakingEngagement(item.id);
                            toast.success('Speaking engagement removed');
                          }}
                          className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Publications Section - Right */}
                <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-600/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Publications</h3>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <motion.input
                      type="text"
                      placeholder="Title"
                      className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={publicationFormData.title}
                      onChange={(e) => setPublicationFormData({...publicationFormData, title: e.target.value})}
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.input
                      type="text"
                      placeholder="Journal/Conference"
                      className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={publicationFormData.journal}
                      onChange={(e) => setPublicationFormData({...publicationFormData, journal: e.target.value})}
                      whileFocus={{ scale: 1.02 }}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.input
                        type="text"
                        placeholder="Date (e.g., 2024)"
                        className="px-4 py-3 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={publicationFormData.date}
                        onChange={(e) => setPublicationFormData({...publicationFormData, date: e.target.value})}
                        whileFocus={{ scale: 1.02 }}
                      />
                      <motion.input
                        type="text"
                        placeholder="Authors"
                        className="px-4 py-3 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={publicationFormData.authors}
                        onChange={(e) => setPublicationFormData({...publicationFormData, authors: e.target.value})}
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>
                    <motion.input
                      type="url"
                      placeholder="Link to publication"
                      className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={publicationFormData.link}
                      onChange={(e) => setPublicationFormData({...publicationFormData, link: e.target.value})}
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => {
                        if (publicationFormData.title && publicationFormData.journal && publicationFormData.date) {
                          addPublication();
                          toast.success('Publication added successfully!');
                        } else {
                          toast.error('Please fill in required fields');
                        }
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Publication
                    </motion.button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {publications.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center p-4 bg-gray-600/30 border border-gray-500/30 rounded-lg hover:bg-gray-600/50 transition-all duration-300"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-300 mb-2">{item.journal} • {item.date}</p>
                          <p className="text-xs text-gray-400 mb-2">Authors: {item.authors}</p>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              View Publication
                            </a>
                          )}
                        </div>
                        <motion.button
                          type="button"
                          onClick={() => {
                            removePublication(item.id);
                            toast.success('Publication removed');
                          }}
                          className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
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
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={blogFormData.image}
                        onChange={(e) => setBlogFormData({ ...blogFormData, image: e.target.value })}
                        className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white text-sm"
                        placeholder="Enter image URL or generate random"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateRandomImage}
                        className="px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors text-sm"
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
                          className="w-full max-w-full sm:max-w-md h-48 object-cover rounded-lg border border-gray-600"
                          onError={(e) => {
                            e.currentTarget.src = '';
                            toast.error('Failed to load image preview');
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
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
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
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
            ) : activeTab === 'stats' ? (
              <form onSubmit={handleStatSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Label</label>
                  <input
                    type="text"
                    value={statFormData.label}
                    onChange={(e) => setStatFormData({...statFormData, label: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                    placeholder="e.g., Years of Experience"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Value</label>
                  <input
                    type="number"
                    value={statFormData.value}
                    onChange={(e) => setStatFormData({...statFormData, value: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                    placeholder="e.g., 10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Suffix</label>
                  <input
                    type="text"
                    value={statFormData.suffix}
                    onChange={(e) => setStatFormData({...statFormData, suffix: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                    placeholder="e.g., +, %, years"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetStatForm}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : activeTab === 'experiences' ? (
              <form onSubmit={handleExperienceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={experienceFormData.type}
                    onChange={(e) => setExperienceFormData({...experienceFormData, type: e.target.value as any})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                  >
                    <option value="work">Work</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={experienceFormData.title}
                    onChange={(e) => setExperienceFormData({...experienceFormData, title: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company/Institution</label>
                  <input
                    type="text"
                    value={experienceFormData.company}
                    onChange={(e) => setExperienceFormData({...experienceFormData, company: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                    placeholder="e.g., Google or MIT"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Period</label>
                  <input
                    type="text"
                    value={experienceFormData.period}
                    onChange={(e) => setExperienceFormData({...experienceFormData, period: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                    placeholder="e.g., 2020 - Present"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={experienceFormData.description}
                    onChange={(e) => setExperienceFormData({...experienceFormData, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white h-24"
                    placeholder="Describe your role and achievements"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={experienceFormData.skills}
                    onChange={(e) => setExperienceFormData({...experienceFormData, skills: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                    placeholder="React, Node.js, Python"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetExperienceForm}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
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
          {activeTab !== 'speaking' && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-6">
              {activeTab === 'messages' ? 'Contact Messages' :
               activeTab === 'stats' ? 'Stats' :
               activeTab === 'blogs' ? 'Blog Posts' : 
               activeTab === 'experiences' ? 'Experiences' : 'Projects'} 
              ({activeTab === 'messages' ? contactMessages.length :
                activeTab === 'stats' ? stats.length :
                activeTab === 'blogs' ? blogs.length : 
                activeTab === 'experiences' ? experiences.length : projects.length})
            </h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {activeTab === 'blogs' ? (
                blogs.map((item) => (
                  <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">{item.excerpt}</p>
                    <div className="flex flex-col sm:flex-row gap-2">
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
                    <div className="flex flex-col sm:flex-row gap-2">
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
              ) : activeTab === 'stats' ? (
                stats.map((item) => (
                  <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{item.label}</h3>
                        <div className="text-2xl font-bold text-blue-400 mb-2">
                          {item.value}{item.suffix}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
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
                  </div>
                ))
              ) : activeTab === 'experiences' ? (
                <>
                  <div className="text-sm text-gray-400 mb-4">
                    Total experiences: {experiences.length}
                  </div>
                  {experiences.map((item) => (
                    <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          item.type === 'work' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {item.type === 'work' ? '💼 Work' : '📖 Education'}
                        </span>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id.toString())}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-blue-400 font-medium mb-1">{item.company}</p>
                      <p className="text-sm text-gray-400 mb-2">{item.period}</p>
                      <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                      {item.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
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
                        <div className="flex flex-col sm:flex-row gap-2 ml-0 sm:ml-4 mt-2 sm:mt-0">
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
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Delete {deleteItem?.type === 'blog' ? 'Blog' : deleteItem?.type === 'project' ? 'Project' : 'Stat'}</h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this {deleteItem?.type}? This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
