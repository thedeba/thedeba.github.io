"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  onScrollTo: (section: string) => void;
}

export default function Navbar({ onScrollTo }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar only after scrolling 10vh
      setIsScrolled(window.scrollY > window.innerHeight * 0.1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", section: "about" },
    { label: "Skills", section: "skills" },
    { label: "Projects", section: "projects" },
    { label: "Experience", section: "experience" },
    { label: "Blog", section: "blog" },
    { label: "Contact", section: "contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isScrolled ? 0 : -100, 
        opacity: isScrolled ? 1 : 0 
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md shadow-lg"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient"
            whileHover={{ scale: 1.05 }}
          >
            Debashish
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.section}
                onClick={() => onScrollTo(item.section)}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.a
              href="/resume.pdf"
              target="_blank"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resume
            </motion.a>
            {isAdmin && (
              <motion.a
                href="/admin"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-sm font-semibold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Admin
              </motion.a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.section}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Mobile menu button clicked:', item.section);
                  onScrollTo(item.section);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-gray-300 hover:text-white py-2 px-2 transition-colors focus:outline-none focus:bg-gray-800"
              >
                {item.label}
              </button>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-semibold transition-colors"
            >
              Resume
            </a>
            {isAdmin && (
              <a
                href="/admin"
                className="block w-full text-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-sm font-semibold transition-colors"
              >
                Admin
              </a>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
}

