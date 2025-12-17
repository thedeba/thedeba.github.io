"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const snippets = [
  {
    id: 1,
    title: "React Custom Hook",
    language: "typescript",
    code: `function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
    description: "A reusable debounce hook for React",
  },
  {
    id: 2,
    title: "Python ML Model",
    language: "python",
    code: `def train_model(X_train, y_train):
    model = Sequential([
        Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
        Dropout(0.3),
        Dense(64, activation='relu'),
        Dense(1, activation='sigmoid')
    ])
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    model.fit(X_train, y_train, epochs=50, batch_size=32)
    return model`,
    description: "Neural network model for binary classification",
  },
];

export default function CodeSnippets() {
  const [selectedSnippet, setSelectedSnippet] = useState(0);

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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Code Snippets</h2>
          <p className="text-gray-300 text-lg">
            Some of my favorite code snippets and utilities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {snippets.map((snippet, index) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl overflow-hidden"
            >
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold mb-1">{snippet.title}</h3>
                <p className="text-sm text-gray-400">{snippet.description}</p>
              </div>
              <div className="p-4 bg-gray-900 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
                  <code>{snippet.code}</code>
                </pre>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase">{snippet.language}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(snippet.code);
                    alert("Code copied to clipboard!");
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Copy
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

