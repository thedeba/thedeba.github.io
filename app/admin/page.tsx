"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'blogs' | 'projects'>('blogs');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Blog | Project | null>(null);

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [blogsResponse, projectsResponse] = await Promise.all([
        fetch('/api/blogs'),
        fetch('/api/projects')
      ]);

      if (blogsResponse.ok) {
        const blogsData = await blogsResponse.json();
        setBlogs(blogsData);
      }

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
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
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        loadData();
        resetBlogForm();
        alert(`Blog ${isEditing ? 'updated' : 'created'} successfully!`);
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
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        loadData();
        resetProjectForm();
        alert(`Project ${isEditing ? 'updated' : 'created'} successfully!`);
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving data');
    }
  };

  const handleEdit = (item: Blog | Project) => {
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
    } else {
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
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const endpoint = activeTab === 'blogs' ? `/api/blogs?id=${id}` : `/api/projects?id=${id}`;

    try {
      const response = await fetch(endpoint, { method: 'DELETE' });

      if (response.ok) {
        loadData();
        alert('Item deleted successfully!');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
          <p className="text-gray-300">Manage your blogs and projects</p>
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
        </div>
        

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-6">
              {isEditing ? 'Edit' : 'Add'} {activeTab === 'blogs' ? 'Blog' : 'Project'}
            </h2>

            {activeTab === 'blogs' ? (
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
              {activeTab === 'blogs' ? 'Blog Posts' : 'Projects'} ({activeTab === 'blogs' ? blogs.length : projects.length})
            </h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {activeTab === 'blogs' ? (
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
