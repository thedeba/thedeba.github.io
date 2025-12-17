"use client";

import { motion } from "framer-motion";

const hobbies = [
  {
    id: 1,
    name: "Photography",
    icon: "📷",
    description: "Capturing moments and exploring creative perspectives",
  },
  {
    id: 2,
    name: "Reading",
    icon: "📚",
    description: "Tech books, sci-fi novels, and research papers",
  },
  {
    id: 3,
    name: "Gaming",
    icon: "🎮",
    description: "Strategy games and indie titles",
  },
  {
    id: 4,
    name: "Hiking",
    icon: "⛰️",
    description: "Exploring nature and staying active",
  },
  {
    id: 5,
    name: "Music",
    icon: "🎵",
    description: "Playing guitar and discovering new artists",
  },
  {
    id: 6,
    name: "Cooking",
    icon: "🍳",
    description: "Experimenting with new recipes and cuisines",
  },
];

export default function Hobbies() {
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Hobbies & Interests</h2>
          <p className="text-gray-300 text-lg">
            What I enjoy when I'm not coding
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hobbies.map((hobby, index) => (
            <motion.div
              key={hobby.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-750 transition-colors"
            >
              <div className="text-5xl mb-4">{hobby.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{hobby.name}</h3>
              <p className="text-gray-400 text-sm">{hobby.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

