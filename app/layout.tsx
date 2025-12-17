import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Debashish | Software Engineer & Full Stack Developer",
  description: "Debashish is a Software Engineer, ML/DL Engineer & Full Stack Developer specializing in building innovative web applications and AI solutions.",
  keywords: ["Software Engineer", "Full Stack Developer", "Machine Learning", "React", "Next.js", "Python", "AI", "Web Development"],
  authors: [{ name: "Debashish" }],
  creator: "Debashish",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://debashish.dev",
    siteName: "Debashish Portfolio",
    title: "Debashish | Software Engineer & Full Stack Developer",
    description: "Software Engineer, ML/DL Engineer & Full Stack Developer specializing in building innovative web applications and AI solutions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Debashish Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debashish | Software Engineer & Full Stack Developer",
    description: "Software Engineer, ML/DL Engineer & Full Stack Developer",
    images: ["/og-image.png"],
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
