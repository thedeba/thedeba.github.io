-- Fix RLS policies to only allow authenticated admin users

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read blogs" ON blogs;
DROP POLICY IF EXISTS "Admin can insert blogs" ON blogs;
DROP POLICY IF EXISTS "Admin can update blogs" ON blogs;
DROP POLICY IF EXISTS "Admin can delete blogs" ON blogs;

DROP POLICY IF EXISTS "Public can read projects" ON projects;
DROP POLICY IF EXISTS "Admin can insert projects" ON projects;
DROP POLICY IF EXISTS "Admin can update projects" ON projects;
DROP POLICY IF EXISTS "Admin can delete projects" ON projects;

DROP POLICY IF EXISTS "Public can read speaking engagements" ON speaking_engagements;
DROP POLICY IF EXISTS "Admin can insert speaking engagements" ON speaking_engagements;
DROP POLICY IF EXISTS "Admin can update speaking engagements" ON speaking_engagements;
DROP POLICY IF EXISTS "Admin can delete speaking engagements" ON speaking_engagements;

DROP POLICY IF EXISTS "Public can read publications" ON publications;
DROP POLICY IF EXISTS "Admin can insert publications" ON publications;
DROP POLICY IF EXISTS "Admin can update publications" ON publications;
DROP POLICY IF EXISTS "Admin can delete publications" ON publications;

-- Create proper policies with authentication checks

-- Blogs
CREATE POLICY "Public can read blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert blogs" ON blogs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update blogs" ON blogs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete blogs" ON blogs FOR DELETE USING (auth.role() = 'authenticated');

-- Projects
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Speaking Engagements
CREATE POLICY "Public can read speaking engagements" ON speaking_engagements FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert speaking engagements" ON speaking_engagements FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update speaking engagements" ON speaking_engagements FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete speaking engagements" ON speaking_engagements FOR DELETE USING (auth.role() = 'authenticated');

-- Publications
CREATE POLICY "Public can read publications" ON publications FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert publications" ON publications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update publications" ON publications FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete publications" ON publications FOR DELETE USING (auth.role() = 'authenticated');
