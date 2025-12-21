"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from 'react';

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

export default function SpeakingPublications() {
  const [speakingEngagements, setSpeakingEngagements] = useState<SpeakingEngagement[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/speaking-publications');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setSpeakingEngagements(data.speakingEngagements || []);
        setPublications(data.publications || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching speaking/publications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="py-12 text-center">Loading...</div>;
  if (error) return <div className="py-12 text-center text-red-500">Error: {error}</div>;

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Speaking & Publications</h2>
          <p className="text-gray-300 text-lg">
            My recent speaking engagements and published works
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Speaking Engagements */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h3 className="text-2xl font-semibold mb-6">Speaking Engagements</h3>
            <div className="space-y-6">
              {speakingEngagements.map((item: SpeakingEngagement, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-700 p-4 rounded-lg"
                >
                  <h4 className="text-lg font-medium text-blue-400">{item.title}</h4>
                  <p className="text-sm text-gray-300 mt-1">{item.event}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">{item.date} • {item.location}</span>
                    <span className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded-full">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </div>
                </motion.div>
              ))}
              {speakingEngagements.length === 0 && (
                <p className="text-gray-400 text-center py-4">No speaking engagements to display</p>
              )}
            </div>
          </motion.div>

          {/* Publications */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h3 className="text-2xl font-semibold mb-6">Publications</h3>
            <div className="space-y-6">
              {publications.map((item: Publication, index: number) => (
                <motion.a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <h4 className="text-lg font-medium text-blue-400">{item.title}</h4>
                  <p className="text-sm text-gray-300 mt-1">{item.journal}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">{item.authors} • {item.date}</span>
                    <span className="text-xs text-blue-400">Read →</span>
                  </div>
                </motion.a>
              ))}
              {publications.length === 0 && (
                <p className="text-gray-400 text-center py-4">No publications to display</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
