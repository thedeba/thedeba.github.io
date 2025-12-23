import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'blogs.json');
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const blogs = JSON.parse(data);
    
    return blogs.map((blog: any) => ({
      id: blog.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export const dynamic = 'force-static';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
