"use client";

import { motion } from "framer-motion";

const currentWork = [
  {
    id: 1,
    title: "Building an AI-Powered Analytics Platform",
    description: "Developing a comprehensive analytics dashboard using React, TypeScript, and TensorFlow.js",
    progress: 75,
    tech: ["React", "TypeScript", "TensorFlow.js"],
  },
  {
    id: 2,
    title: "Open Source Contribution",
    description: "Contributing to Next.js and React open-source projects",
    progress: 40,
    tech: ["Next.js", "React"],
  },
];

export default function CurrentlyWorking() {
  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Currently Working On</h2>
          <p className="text-gray-300 text-lg">
            Projects and initiatives I'm actively developing
          </p>
        </motion.div>

        <div className="space-y-6">
          {currentWork.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{work.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {work.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-400">{work.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${work.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

