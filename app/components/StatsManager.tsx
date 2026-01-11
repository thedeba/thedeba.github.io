"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import toast from 'react-hot-toast';

interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  created_at: string;
  updated_at: string;
}

export default function StatsManager() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [newStat, setNewStat] = useState({ label: '', value: 0, suffix: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (stat: Stat) => {
    try {
      const response = await fetch('/api/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify(stat),
      });

      if (response.ok) {
        toast.success('Stat updated successfully');
        setEditingStat(null);
        fetchStats();
      } else {
        toast.error('Failed to update stat');
      }
    } catch (error) {
      console.error('Error updating stat:', error);
      toast.error('Failed to update stat');
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify(newStat),
      });

      if (response.ok) {
        toast.success('Stat created successfully');
        setNewStat({ label: '', value: 0, suffix: '' });
        setShowAddForm(false);
        fetchStats();
      } else {
        toast.error('Failed to create stat');
      }
    } catch (error) {
      console.error('Error creating stat:', error);
      toast.error('Failed to create stat');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;

    try {
      const response = await fetch(`/api/stats?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (response.ok) {
        toast.success('Stat deleted successfully');
        fetchStats();
      } else {
        toast.error('Failed to delete stat');
      }
    } catch (error) {
      console.error('Error deleting stat:', error);
      toast.error('Failed to delete stat');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Stats Management</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Stat
        </button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-gray-700 rounded-lg"
        >
          <h4 className="text-lg font-medium text-white mb-4">Create New Stat</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Label"
              value={newStat.label}
              onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Value"
              value={newStat.value}
              onChange={(e) => setNewStat({ ...newStat, value: parseInt(e.target.value) || 0 })}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Suffix (e.g., +)"
              value={newStat.suffix}
              onChange={(e) => setNewStat({ ...newStat, suffix: e.target.value })}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!newStat.label}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-700 rounded-lg p-4"
          >
            {editingStat?.id === stat.id ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={editingStat.label}
                  onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={editingStat.value}
                  onChange={(e) => setEditingStat({ ...editingStat, value: parseInt(e.target.value) || 0 })}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={editingStat.suffix}
                  onChange={(e) => setEditingStat({ ...editingStat, suffix: e.target.value })}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(editingStat)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingStat(null)}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-white font-medium">{stat.label}</div>
                  <div className="text-blue-400 text-2xl font-bold">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Updated: {new Date(stat.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingStat(stat)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(stat.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
