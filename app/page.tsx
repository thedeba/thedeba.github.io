"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Stats from "./components/Stats";
import BlogSkeleton from "./components/BlogSkeleton";
import Testimonials from "./components/Testimonials";
import Certifications from "./components/Certifications";
import CurrentlyWorking from "./components/CurrentlyWorking";
import GitHubContributions from "./components/GitHubContributions";
import Newsletter from "./components/Newsletter";
import CodeSnippets from "./components/CodeSnippets";
import ThemeToggle from "./components/ThemeToggle";
import Hobbies from "./components/Hobbies";
import SpeakingPublications from "./components/SpeakingPublications";
import Analytics from "./components/Analytics";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
}

export default function Home() {
  const aboutRef = useRef<HTMLElement | null>(null);
  const skillsRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const blogRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const blogsResponse = await fetch("/api/blogs");

        if (blogsResponse.ok) {
          const blogsData = await blogsResponse.json();
          setBlogs(blogsData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setBlogsLoading(false);
      }
    };

    loadData();
  }, []);

  // Typing animation effect
  useEffect(() => {
    const fullText = "Software Engineer, ML/DL Engineer & Full Stack Developer";
    let currentIndex = 0;
    let isDeleting = false;
    let waitTime = 0;
    let timeoutId: NodeJS.Timeout;

    const typeText = () => {
      if (waitTime > 0) {
        waitTime -= 100;
        timeoutId = setTimeout(typeText, 100);
        return;
      }

      if (!isDeleting && currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeText, 100);
      } else if (isDeleting && currentIndex > 0) {
        setDisplayedText(fullText.slice(0, currentIndex - 1));
        currentIndex--;
        timeoutId = setTimeout(typeText, 50);
      } else if (currentIndex === fullText.length) {
        waitTime = 2000;
        isDeleting = true;
        timeoutId = setTimeout(typeText, 100);
      } else if (currentIndex === 0 && isDeleting) {
        isDeleting = false;
        timeoutId = setTimeout(typeText, 100);
      }
    };

    timeoutId = setTimeout(() => {
      typeText();
    }, 1000);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(cursorInterval);
    };
  }, []);

  const scrollToSection = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLElement | null>> = {
      about: aboutRef,
      skills: skillsRef,
      projects: projectsRef,
      experience: experienceRef,
      blog: blogRef,
      contact: contactRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewWork = () => {
    scrollToSection("projects");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <Navbar onScrollTo={scrollToSection} />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden pt-16">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10"
        >
          {/* Name with continuous floating and animated gradient */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: [0, -10, 0],
            }}
            transition={{
              scale: { delay: 0.2, duration: 0.5 },
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="relative inline-block"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-4 relative"
              style={{
                background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6, #60a5fa)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(96, 165, 250, 0.5))",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Debashish
            </motion.h1>
            {/* Glowing effect behind name */}
            <motion.div
              className="absolute inset-0 blur-2xl opacity-30"
              style={{
                background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Subtitle with typing animation */}
          <motion.div
            className="text-xl md:text-2xl mb-8 min-h-[2.5rem] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span className="text-gray-300 font-medium">
              {displayedText}
              <motion.span
                className="inline-block w-0.5 h-6 md:h-8 bg-blue-400 ml-1"
                animate={{
                  opacity: showCursor ? 1 : 0,
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </span>
          </motion.div>

          {/* Buttons with enhanced animations */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.button
              className="relative px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-colors overflow-hidden group"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(37, 99, 235, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewWork}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span className="relative z-10">View My Work</span>
            </motion.button>
            <motion.a
              href="/resume.pdf"
              target="_blank"
              className="relative px-8 py-3 border-2 border-gray-500 hover:border-white rounded-full text-lg font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Resume
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
            <p className="text-gray-300 text-lg">
              Passionate about creating beautiful, functional web experiences.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Hello! I'm Debashish, an engineer with a passion for building innovative and
                user-friendly technologies. I've accomplished my Bachelor's degree in Computer
                Science and Engineering at Daffodil International University. AI and Machine
                Learning are my areas of interest. I'm currently working as a freelancer and
                building my own projects. I'm also a full-stack developer with a keen eye for
                design and a love for modern technologies. I specialize in creating dynamic,
                responsive web applications that provide exceptional user experiences.
              </p>
              <p className="text-gray-300 leading-relaxed">
                When I'm not coding, you can find me exploring new technologies, contributing
                to open-source projects, or designing user interfaces that push the boundaries
                of what's possible on the web.
              </p>
            </div>
            <motion.div
              className="w-64 h-64 rounded-full mx-auto overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img
                src="/profile.png"
                alt="Debashish"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Skills Section */}
      <section ref={skillsRef}>
        <Skills />
      </section>

      {/* Projects Section */}
      <section ref={projectsRef}>
        <Projects />
      </section>

      {/* Experience Section */}
      <section ref={experienceRef}>
        <Experience />
      </section>

      {/* Currently Working On */}
      <CurrentlyWorking />

      {/* GitHub Contributions */}
      <GitHubContributions />

      {/* Code Snippets */}
      <CodeSnippets />

      {/* Testimonials */}
      <Testimonials />

      {/* Certifications */}
      <Certifications />

      {/* Hobbies */}
      <Hobbies />

      {/* Speaking & Publications */}
      <SpeakingPublications />

      {/* Newsletter */}
      <Newsletter />

      {/* Blogs Section */}
      <section ref={blogRef} id="blog" className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Blog & Updates</h2>
            <p className="text-gray-300 text-lg">
              My latest thoughts, insights, and updates from the world of technology.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
                className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </motion.div>

          {blogsLoading ? (
            <BlogSkeleton />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(showAllBlogs ? blogs : blogs.slice(0, 3))
                .filter((post) =>
                  searchQuery === "" ||
                  post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((post, i) => (
                <Link href={`/blog/${post.id}`} key={post.id}>
                  <motion.article
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors group cursor-pointer h-full"
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                      <img src="/file.svg" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                      Read More
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          )}
          {blogs.length > 3 && !showAllBlogs && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full text-lg font-semibold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAllBlogs(true)}
              >
                View All ({blogs.length - 3} more)
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef}>
        <ContactForm />
      </section>

      {/* Footer */}
      <Footer onScrollTo={scrollToSection} />

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Analytics */}
      <Analytics />
    </div>
  );
}
