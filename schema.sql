-- Blogs table
CREATE TABLE blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  tech TEXT[] NOT NULL DEFAULT '{}',
  live_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  featured BOOLEAN DEFAULT FALSE,
  category TEXT DEFAULT 'Other',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Speaking engagements table
CREATE TABLE speaking_engagements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  event TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Publications table
CREATE TABLE publications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  journal TEXT NOT NULL,
  date TEXT NOT NULL,
  authors TEXT NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Experiences table
CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('work', 'education')),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Stats table
-- Stats table for dynamic statistics
CREATE TABLE IF NOT EXISTS stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL UNIQUE,
  value INTEGER NOT NULL DEFAULT 0,
  suffix TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default stats
INSERT INTO stats (label, value, suffix) VALUES
  ('Years Experience', 3, '+'),
  ('Projects Completed', 25, '+'),
  ('Happy Clients', 15, '+'),
  ('Technologies', 20, '+')
ON CONFLICT (label) DO NOTHING;

-- Enable RLS
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Create policy for read access (public)
CREATE POLICY "Public read access to stats" ON stats
  FOR SELECT USING (true);

-- Create policy for admin access (full CRUD)
CREATE POLICY "Admin full access to stats" ON stats
  FOR ALL USING (
    true
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_stats_updated_at
  BEFORE UPDATE ON stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
--Stats table end

-- Create indexes for better performance
CREATE INDEX idx_experiences_type ON experiences(type);
CREATE INDEX idx_experiences_period ON experiences(period DESC);

-- Enable Row Level Security
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_blogs_date ON blogs(date DESC);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_speaking_engagements_date ON speaking_engagements(date DESC);
CREATE INDEX idx_publications_date ON publications(date DESC);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
--Blogs RLS Policies
CREATE POLICY "Admin can insert blogs" ON blogs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Admin can update blogs" ON blogs FOR UPDATE USING (true);
CREATE POLICY "Admin can delete blogs" ON blogs FOR DELETE USING (true);

--Projects RLS Policies
CREATE POLICY "Admin can insert projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin can update projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "Admin can delete projects" ON projects FOR DELETE USING (true);

--Speaking Engagements RLS Policies
CREATE POLICY "Admin can insert speaking engagements" ON speaking_engagements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read speaking engagements" ON speaking_engagements FOR SELECT USING (true);
CREATE POLICY "Admin can update speaking engagements" ON speaking_engagements FOR UPDATE USING (true);
CREATE POLICY "Admin can delete speaking engagements" ON speaking_engagements FOR DELETE USING (true);

--Publications RLS Policies
CREATE POLICY "Admin can insert publications" ON publications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read publications" ON publications FOR SELECT USING (true);
CREATE POLICY "Admin can update publications" ON publications FOR UPDATE USING (true);
CREATE POLICY "Admin can delete publications" ON publications FOR DELETE USING (true);

--Contact Message RLS Policies
CREATE POLICY "Admin can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read contact messages" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Admin can update contact messages" ON contact_messages FOR UPDATE USING (true);
CREATE POLICY "Admin can delete contact messages" ON contact_messages FOR DELETE USING (true);


-- Experience RLS policies 
CREATE POLICY "Admin can insert experiences" ON experiences FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Admin can update experiences" ON experiences FOR UPDATE USING (true);
CREATE POLICY "Admin can delete experiences" ON experiences FOR DELETE USING (true);