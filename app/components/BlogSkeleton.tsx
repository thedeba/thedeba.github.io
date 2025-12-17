"use client";

import { motion } from "framer-motion";

export default function BlogSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 animate-pulse" />
          
          {/* Date skeleton */}
          <div className="flex gap-2 mb-3">
            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
          </div>
          
          {/* Title skeleton */}
          <div className="h-6 w-3/4 bg-gray-700 rounded mb-3 animate-pulse" />
          
          {/* Excerpt skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse" />
          </div>
          
          {/* Read more skeleton */}
          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
        </motion.div>
      ))}
    </div>
  );
}

