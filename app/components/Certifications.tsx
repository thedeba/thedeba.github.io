"use client";

import { motion } from "framer-motion";

const certifications = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    badge: "/certifications/aws.png",
    url: "https://aws.amazon.com/certification/",
  },
  {
    id: 2,
    title: "TensorFlow Developer Certificate",
    issuer: "Google",
    date: "2023",
    badge: "/certifications/tensorflow.png",
    url: "https://www.tensorflow.org/certificate",
  },
  {
    id: 3,
    title: "Meta React Developer Certificate",
    issuer: "Meta",
    date: "2022",
    badge: "/certifications/react.png",
    url: "https://www.coursera.org/professional-certificates/meta-react-native",
  },
  {
    id: 4,
    title: "Machine Learning Specialization",
    issuer: "Stanford University",
    date: "2022",
    badge: "/certifications/ml.png",
    url: "https://www.coursera.org/specializations/machine-learning",
  },
];

export default function Certifications() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Certifications & Achievements</h2>
          <p className="text-gray-300 text-lg">
            Professional certifications and recognitions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <motion.a
              key={cert.id}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors group"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center group-hover:text-blue-400 transition-colors">
                {cert.title}
              </h3>
              <p className="text-gray-400 text-sm text-center mb-1">{cert.issuer}</p>
              <p className="text-gray-500 text-xs text-center">{cert.date}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

