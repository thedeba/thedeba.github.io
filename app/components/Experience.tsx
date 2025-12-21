"use client";

import { motion } from "framer-motion";

const experiences = [
  {
    id: 1,
    type: "work",
    title: "Freelance Software Engineer",
    company: "Self-Employed",
    period: "2025 - Present",
    description: "Freelance Software Engineer with hands-on experience in building scalable web applications, AI-driven solutions, and cloud-based systems. I specialize in modern frontend frameworks like React and Next.js, backend development using Node.js and Python, and database management with MongoDB, MySQL, and PostgreSQL. I also work with machine learning models using TensorFlow and deploy secure, high-performance applications on AWS and Firebase. Passionate about clean code, performance optimization, and solving real-world problems.",
    skills: ["React", "Next.js", "Python", "TensorFlow", "Node.js", "MongoDB", "AWS", "MySQL", "PostgreSQL", "Firebase", "C", "C++", "Java", "Shell Script", "Flutter",],
  },
  {
    id: 2,
    type: "work",
    title: "IoT Engineer Intern",
    company: "SiS InflexionpointBD",
    period: "2023 - 2024",
    description: "Developed and maintained web applications using modern technologies. Collaborated with cross-functional teams to deliver high-quality products.",
    skills: ["Arduino", "ESP32", "MongoDB", "C", "C++", "Java", "Shell Script", "Flutter",],
  },
  {
    id: 3,
    type: "education",
    title: "B.Sc. in Computer Science & Engineering",
    company: "Daffodil International University",
    period: "2021 - 2025",
    description: "Graduated with a focus on AI/ML/NLP and software engineering. Participated in various coding competitions and research projects.",
    skills: ["Data Structures", "Algorithms", "Machine Learning", "Natural Language Processing", "Software Engineering"],
  },
  {
    id: 4,
    type: "education",
    title: "Dinajpur Adarsha College",
    company: "Higher Secondary School",
    period: "2016 - 2018",
    description: "Graduated with a focus on the field of Science.",
    skills: ["Higher Mathemetics", "Physics", "Chemistry", "Biology", "English"],
  },
  {
    id: 5,
    type: "education",
    title: "Jnangkur Pilot High School",
    company: "Secondary School",
    period: "2014 - 2016",
    description: "I finished my secondary education from here.",
    skills: ["Higher Mathemetics", "Physics", "Chemistry", "Biology", "English", "Religion", "Social Science"],
  },
  {
    id: 6,
    type: "education",
    title: "Suffa Residential Model School",
    company: "Secondary School",
    period: "2014 - 2014",
    description: "Started reading in this school in class 9 but not finished from here.",
    skills: ["Higher Mathemetics", "Physics", "Chemistry", "Biology", "English", "Religion", "Social Science"],
  },
  {
    id: 7,
    type: "education",
    title: "Amena Baki Residential Model School & College",
    company: "Junior School",
    period: "2013 - 2014",
    description: "Admitted in class 6 and finished class 8 from here.",
    skills: ["Bengali", "English", "Religion", "Social Science", "Science", "Mathematics", "Art", "Music", "Physical Education"],
  },
  {
    id: 8,
    type: "education",
    title: "Manmathpur Co-Operative High School",
    company: "Junior School",
    period: "2012 - 2013",
    description: "Admitted in class 6 and finished class 7 from here.",
    skills: ["Bengali", "English", "Religion", "Social Science", "Science", "Mathematics", "Art", "Music", "Physical Education"],
  },
  {
    id: 9,
    type: "education",
    title: "Manmathpur Government Primary School",
    company: "Primary School",
    period: "2010 - 2011",
    description: "Completed my primary education from here again.",
    skills: ["Bengali", "English", "Religion", "Social Science", "Mathematics"],
  },
  {
    id: 10,
    type: "education",
    title: "Khorakhai Baishnab Para Government Primary School",
    company: "Primary School",
    period: "2006 - 2009",
    description: "I have completed my primary education from here.",
    skills: ["Bengali", "English", "Religion", "Social Science", "Mathematics"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Experience</h2>
          <p className="text-gray-300 text-lg">
            My professional journey and educational background
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative flex items-center mb-8 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900 z-10" />

              {/* Content */}
              <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                <motion.div
                  className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Type Badge */}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                      exp.type === "work"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {exp.type === "work" ? "💼 Work" : "📖 Education"}
                  </span>

                  <h3 className="text-xl font-semibold text-white mb-1">{exp.title}</h3>
                  <p className="text-blue-400 font-medium mb-2">{exp.company}</p>
                  <p className="text-gray-400 text-sm mb-3">{exp.period}</p>
                  <p className="text-gray-300 text-sm mb-4">{exp.description}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

