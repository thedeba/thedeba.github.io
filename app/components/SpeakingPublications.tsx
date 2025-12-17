"use client";

import { motion } from "framer-motion";

const speaking = [
  {
    id: 1,
    title: "Building Scalable ML Systems",
    event: "Tech Conference 2024",
    date: "March 2024",
    location: "San Francisco, CA",
    type: "talk",
  },
  {
    id: 2,
    title: "Modern Web Development Practices",
    event: "Developer Meetup",
    date: "January 2024",
    location: "Online",
    type: "workshop",
  },
];

const publications = [
  {
    id: 1,
    title: "Efficient Neural Network Architectures for Edge Devices",
    journal: "Journal of Machine Learning Research",
    date: "2024",
    authors: "Debashish, et al.",
    link: "https://example.com/paper1",
  },
  {
    id: 2,
    title: "Real-time Data Processing with React and WebSockets",
    journal: "Web Development Quarterly",
    date: "2023",
    authors: "Debashish",
    link: "https://example.com/paper2",
  },
];

export default function SpeakingPublications() {
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
            Sharing knowledge through talks and research
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Speaking Engagements */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-blue-400">Speaking Engagements</h3>
            <div className="space-y-6">
              {speaking.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.type === "talk" ? "bg-blue-600/20 text-blue-400" : "bg-purple-600/20 text-purple-400"
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{item.event}</p>
                  <p className="text-gray-500 text-xs">{item.date} • {item.location}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Publications */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-purple-400">Publications</h3>
            <div className="space-y-6">
              {publications.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                  className="block bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
                >
                  <h4 className="text-lg font-semibold mb-2 hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2">{item.journal}</p>
                  <p className="text-gray-500 text-xs mb-2">{item.authors}</p>
                  <p className="text-gray-500 text-xs">{item.date}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

