'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

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

export default function SpeakingPublicationsAdmin() {
  const [speakingEngagements, setSpeakingEngagements] = useState<SpeakingEngagement[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Form states
  const [speakingForm, setSpeakingForm] = useState<Omit<SpeakingEngagement, 'id'>>({ 
    title: '', 
    event: '', 
    date: '', 
    location: '', 
    type: 'talk' 
  });
  
  const [publicationForm, setPublicationForm] = useState<Omit<Publication, 'id'>>({ 
    title: '', 
    journal: '', 
    date: '', 
    authors: '', 
    link: '' 
  });
  const [editingId, setEditingId] = useState<{ type: 'speaking' | 'publication'; id: number } | null>(null);

  useEffect(() => {
    fetchData();
    
    return () => {
      // Cancel any ongoing requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchData = async () => {
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch('/api/speaking-publications', {
        signal: abortControllerRef.current.signal
      });
      const data = await response.json();
      setSpeakingEngagements(data.speakingEngagements || []);
      setPublications(data.publications || []);
    } catch (error) {
      // Ignore AbortError as it's expected when requests are cancelled
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    const abortController = new AbortController();
    
    try {
      const response = await fetch('/api/speaking-publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speakingEngagements, publications }),
        signal: abortController.signal
      });
      
      if (!response.ok) throw new Error('Failed to save');
      
      const result = await response.json();
      // Update local state with the data returned from database (which has correct IDs)
      setSpeakingEngagements(result.data.speakingEngagements);
      setPublications(result.data.publications);
      
      setSaveStatus('success');
      toast.success('Speaking & Publications saved successfully!', { duration: 3000 });
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      // Ignore AbortError as it's expected when requests are cancelled
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Error saving data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Speaking engagement handlers
  const addSpeakingEngagement = () => {
    const newItem = { ...speakingForm, id: Date.now() };
    setSpeakingEngagements([...speakingEngagements, newItem]);
    setSpeakingForm({ title: '', event: '', date: '', location: '', type: 'talk' });
  };

  const removeSpeakingEngagement = (id: number) => {
    setSpeakingEngagements(speakingEngagements.filter(item => item.id !== id));
  };

  // Publication handlers
  const addPublication = () => {
    const newItem = { ...publicationForm, id: Date.now() };
    setPublications([...publications, newItem]);
    setPublicationForm({ title: '', journal: '', date: '', authors: '', link: '' });
  };

  const removePublication = (id: number) => {
    setPublications(publications.filter(item => item.id !== id));
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Speaking & Publications Management</h1>
      
      <form onSubmit={handleSave} className="space-y-8">
        {/* Speaking Engagements Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Speaking Engagements</h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Title"
              className="p-2 bg-gray-700 rounded"
              value={speakingForm.title}
              onChange={(e) => setSpeakingForm({...speakingForm, title: e.target.value})}
            />
            <input
              type="text"
              placeholder="Event"
              className="p-2 bg-gray-700 rounded"
              value={speakingForm.event}
              onChange={(e) => setSpeakingForm({...speakingForm, event: e.target.value})}
            />
            <input
              type="text"
              placeholder="Date (e.g., January 2024)"
              className="p-2 bg-gray-700 rounded"
              value={speakingForm.date}
              onChange={(e) => setSpeakingForm({...speakingForm, date: e.target.value})}
            />
            <input
              type="text"
              placeholder="Location"
              className="p-2 bg-gray-700 rounded"
              value={speakingForm.location}
              onChange={(e) => setSpeakingForm({...speakingForm, location: e.target.value})}
            />
            <select
              className="p-2 bg-gray-700 rounded"
              value={speakingForm.type}
              onChange={(e) => setSpeakingForm({...speakingForm, type: e.target.value as any})}
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

          <div className="space-y-4">
            {speakingEngagements.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
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
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Publications</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Title"
              className="p-2 bg-gray-700 rounded"
              value={publicationForm.title}
              onChange={(e) => setPublicationForm({...publicationForm, title: e.target.value})}
            />
            <input
              type="text"
              placeholder="Journal/Conference"
              className="p-2 bg-gray-700 rounded"
              value={publicationForm.journal}
              onChange={(e) => setPublicationForm({...publicationForm, journal: e.target.value})}
            />
            <input
              type="text"
              placeholder="Date (e.g., 2024)"
              className="p-2 bg-gray-700 rounded"
              value={publicationForm.date}
              onChange={(e) => setPublicationForm({...publicationForm, date: e.target.value})}
            />
            <input
              type="text"
              placeholder="Authors"
              className="p-2 bg-gray-700 rounded"
              value={publicationForm.authors}
              onChange={(e) => setPublicationForm({...publicationForm, authors: e.target.value})}
            />
            <input
              type="url"
              placeholder="Link to publication"
              className="p-2 bg-gray-700 rounded md:col-span-2"
              value={publicationForm.link}
              onChange={(e) => setPublicationForm({...publicationForm, link: e.target.value})}
            />
            <button
              type="button"
              onClick={addPublication}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium md:col-span-2"
            >
              Add Publication
            </button>
          </div>

          <div className="space-y-4">
            {publications.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
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

        <div className="flex justify-between items-center">
          <div>
            {saveStatus === 'saving' && <span className="text-yellow-400">Saving...</span>}
            {saveStatus === 'success' && <span className="text-green-400">Saved successfully!</span>}
            {saveStatus === 'error' && <span className="text-red-400">Error saving. Please try again.</span>}
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
            disabled={saveStatus === 'saving'}
          >
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
}
