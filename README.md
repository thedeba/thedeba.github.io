# Debashish's Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. This portfolio showcases my skills, projects, experience, and blog posts in a clean, interactive interface.

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_NETLIFY_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)

## 🚀 Features

- **Modern UI/UX** with smooth animations using Framer Motion
- **Dark/Light Mode** with theme toggle
- **Responsive Design** that works on all devices
- **Interactive Components** including:
  - Project showcase with filtering
  - Skills visualization
  - Experience timeline
  - Contact form with validation
  - GitHub contributions graph
  - Code snippets section
- **Performance Optimized** with Next.js 13+ features
- **SEO Optimized** with proper metadata and semantic HTML

## 🛠️ Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form
- **Icons**: Lucide Icons
- **Deployment**: Netlify

## 🚀 Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📂 Project Structure

```
.
├── app/                    # App router pages and layouts
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── styles/            # Global styles
│   └── page.tsx           # Home page
├── public/                # Static files
├── types/                 # TypeScript type definitions
└── package.json           # Project dependencies
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-emailjs-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-emailjs-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
```

## 🚀 Deployment

This project is configured to deploy on Netlify. To deploy your own version:

1. Fork this repository
2. Connect your GitHub repository to Netlify
3. Configure your environment variables in the Netlify dashboard
4. Deploy!

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
