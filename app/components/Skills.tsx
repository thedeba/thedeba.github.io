"use client";

import { motion } from "framer-motion";

const skills = [
  {
    category: "Languages",
    items: [
      { name: "Python", level: 90 },
      { name: "JAVA", level: 70 },
      { name: "C", level: 90 },
      { name: "C++", level: 75 },
      { name: "JavaScript", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "SQL", level: 90 },
      { name: "PHP", level: 75 },
      { name: "DART", level: 80 },
    ],
  },
  {
    category: "Frontend",
    items: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "HTML/CSS", level: 95 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 80 },
      { name: "FastAPI", level: 75 },
      { name: "PostgreSQL", level: 80 },
      { name: "MongoDB", level: 78 },
      { name: "Redis", level: 50 },
      { name: "Docker", level: 65 },
      { name: "MySQL", level: 90 },
    ],
  },
  {
    category: "AI/ML",
    items: [
      { name: "Transformers", level: 70 },
      { name: "TensorFlow", level: 85 },
      { name: "Datasets", lavel: 80 },
      { name: "PyTorch", level: 80 },
      { name: "Scikit-learn", level: 85 },
      { name: "OpenCV", level: 75 },
      { name: "Pandas", level: 85 },
      { name: "NumPy", level: 75 },
      { name: "Matplotlib", level: 83 },
      { name: "Seaborn", level: 90 },
    ],
  },
];

const tools = [
  "Git", "Docker", "AWS", "Firebase", "MongoDB", "Redis", 
  "Linux", "VS Code", "Figma", "Jupyter", "Pandas", "NumPy"
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Skills & Technologies</h2>
          <p className="text-gray-300 text-lg">
            Technologies I work with to bring ideas to life
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {skills.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-400">
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.items.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm">{skill.name}</span>
                      <span className="text-gray-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{
                          duration: 1,
                          delay: categoryIndex * 0.1 + skillIndex * 0.1,
                          ease: "easeOut",
                        }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tools */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold mb-6 text-gray-300">Tools & Platforms</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((tool, index) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -3 }}
                className="px-4 py-2 bg-gray-800 rounded-full text-gray-300 text-sm font-medium border border-gray-700 hover:border-blue-500 transition-colors cursor-default"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}