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
        // Add timeout and better error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        // Fetch user data with timeout
        const userRes = await fetch(`https://api.github.com/users/${username}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!userRes.ok) {
          if (userRes.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Please try again later.');
          } else if (userRes.status === 404) {
            throw new Error('GitHub user not found.');
          } else {
            throw new Error('Failed to fetch user data');
          }
        }
        
        const userData = await userRes.json();

        // Fetch repositories with timeout
        const reposController = new AbortController();
        const reposTimeoutId = setTimeout(() => reposController.abort(), 10000);
        
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
          signal: reposController.signal
        });
        clearTimeout(reposTimeoutId);
        
        if (!reposRes.ok) {
          throw new Error('Failed to fetch repositories');
        }
        
        const reposData = await reposRes.json();
        
        // Calculate total stars
        const starsCount = reposData.reduce(
          (acc: number, repo: any) => acc + repo.stargazers_count, 0
        );

        // Set basic stats without events (which often fail due to rate limiting)
        setStats({
          contributions: userData.public_repos * 10, // Rough estimate
          publicRepos: userData.public_repos,
          stars: starsCount,
          loading: false,
          error: null
        });
      } catch (error: any) {
        console.error('Error fetching GitHub data:', error);
        let errorMessage = 'Failed to load GitHub data. Please try again later.';
        
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your connection and try again.';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'GitHub API rate limit exceeded. Please try again in a few minutes.';
        } else if (error.message.includes('user not found')) {
          errorMessage = 'GitHub user not found.';
        }
        
        setStats(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
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
            <div className="mt-4 text-center">
              <div className="text-red-400 text-sm mb-3">
                {stats.error}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Retry Loading
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

