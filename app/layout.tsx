import type { Metadata } from "next";
import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://debashish.vercel.app'),
  title: "Debashish | Software Engineer | Full Stack Developer",
  description: "Debashish is a Software Engineer, ML/DL Engineer & Full Stack Developer specializing in building innovative web applications and AI solutions.",
  keywords: ["Software Engineer", "Full Stack Developer", "Machine Learning", "React", "Next.js", "Python", "AI", "Web Development"],
  authors: [{ name: "Debashish" }],
  creator: "Debashish",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://debashish.vercel.app",
    siteName: "Debashish Portfolio",
    title: "Debashish | Software Engineer | Full Stack Developer",
    description: "Software Engineer, ML/DL Engineer & Full Stack Developer specializing in building innovative web applications and AI solutions.",
    images: [
      {
        url: "/profile.png",
        width: 1200,
        height: 630,
        alt: "Debashish Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debashish | Software Engineer | Full Stack Developer",
    description: "Software Engineer, ML/DL Engineer & Full Stack Developer",
    images: ["/profile.png"],
    creator: "@debashish",
  },
  robots: {
    index: true,
    follow: true,
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
