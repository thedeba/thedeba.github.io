"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from 'react';

interface GitHubStats {
  contributions: number;
  publicRepos: number;
  stars: number;
  loading: boolean;
  error: string | null;
}

export default function GitHubContributions() {
  const username = "thedeba";
  const [stats, setStats] = useState<GitHubStats>({
    contributions: 0,
    publicRepos: 0,
    stars: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();

        // Fetch all repositories to count stars
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!reposRes.ok) throw new Error('Failed to fetch repositories');
        const reposData = await reposRes.json();
        
        // Calculate total stars
        const starsCount = reposData.reduce(
          (acc: number, repo: any) => acc + repo.stargazers_count, 0
        );

        // Fetch contribution data (approximate, as GitHub's API doesn't provide exact count)
        // This is a simple approximation and might not be 100% accurate
        const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public`);
        if (!eventsRes.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsRes.json();
        const contributionsCount = new Set(
          eventsData
            .filter((event: any) => event.type === 'PushEvent')
            .map((event: any) => `${event.repo.id}-${event.created_at.split('T')[0]}`)
        ).size;

        setStats({
          contributions: contributionsCount,
          publicRepos: userData.public_repos,
          stars: starsCount,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load GitHub data. Please try again later.'
        }));
      }
    };

    fetchGitHubStats();
  }, [username]);

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">GitHub Activity</h2>
          <p className="text-gray-300 text-lg">
            My open-source contributions and coding activity
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Contribution Graph</h3>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2"
            >
              View Profile
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          
          {/* GitHub Contributions Graph */}
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <img
              src={`https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=react-dark&hide_border=true`}
              alt="GitHub Activity Graph"
              className="w-full"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {stats.loading ? '...' : stats.contributions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Contributions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {stats.loading ? '...' : stats.publicRepos.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">
                {stats.loading ? '...' : stats.stars.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Stars</div>
            </div>
          </div>
          
          {stats.error && (
            <div className="mt-4 text-red-400 text-sm text-center">
              {stats.error}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

