import type { Metadata } from "next";
import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://deba.vercel.app'),
  title: {
    default: "Debashish | Software Engineer | Full Stack Developer | AI/ML Expert",
    template: "%s | Debashish Portfolio"
  },
  description: "Debashish - Software Engineer, ML/DL Engineer & Full Stack Developer specializing in React, Next.js, Python, and AI solutions. Building innovative web applications with cutting-edge technology.",
  keywords: [
    "Software Engineer", 
    "Full Stack Developer", 
    "Machine Learning Engineer", 
    "Deep Learning", 
    "React Developer", 
    "Next.js Developer", 
    "Python Developer", 
    "AI Engineer", 
    "Web Development", 
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Portfolio Developer",
    "Frontend Developer",
    "Backend Developer"
  ],
  authors: [{ name: "Debashish", url: "https://deba.vercel.app" }],
  creator: "Debashish",
  publisher: "Debashish Portfolio",
  category: "technology",
  classification: "portfolio",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "https://deba.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://deba.vercel.app",
    siteName: "Debashish Portfolio",
    title: "Debashish | Software Engineer | Full Stack Developer | AI/ML Expert",
    description: "Software Engineer, ML/DL Engineer & Full Stack Developer specializing in React, Next.js, Python, and AI solutions. Building innovative web applications with cutting-edge technology.",
    images: [
      {
        url: "/profile.png",
        width: 1200,
        height: 630,
        alt: "Debashish - Software Engineer & AI Expert",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debashish | Software Engineer | Full Stack Developer | AI/ML Expert",
    description: "Software Engineer, ML/DL Engineer & Full Stack Developer specializing in React, Next.js, Python, and AI solutions.",
    images: ["/profile.png"],
    creator: "@debashish",
    site: "@debashish",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "mZ9saHtt1EBD-mcToRu-WvV5pCzADlbKseFj3XSZD98",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
