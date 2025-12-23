-- Migration SQL for Supabase
-- Run this in your Supabase SQL editor to migrate existing data

-- Insert Blogs
INSERT INTO blogs (id, title, excerpt, content, date, read_time) VALUES 
('1766508251952', 'a', 'a', 'a', 'Dec 23, 2025', '5 min read'),
('1', 'The Future of Web Development', 'Exploring emerging trends and technologies shaping the future of web development.', 'Full blog content would go here...', 'Dec 14, 2025', '5 min read'),
('2', 'Building Modern UIs with React', 'Best practices for creating stunning user interfaces with React and modern CSS.', 'Full blog content would go here...', 'Dec 12, 2025', '7 min read'),
('3', 'AI in Software Development', 'How artificial intelligence is revolutionizing the way we write and maintain code.', 'Full blog content would go here...', 'Dec 10, 2025', '6 min read');

-- Insert Projects
INSERT INTO projects (id, title, description, image, tech, live_url, github_url, featured, category) VALUES 
('1766328082244', 'Anup Homeo Pharmacy', 'This project is made with fully NextJs and also used the ProstgreSQL for storage.', 'https://anuphomoeo.vercel.app/doctor.jpg', ARRAY['NextJs', 'PostgreSQL', 'TypeScript'], 'https://anuphomoeo.vercel.app/', 'https://github.com/thedeba/anup-homoeo-pharmacy', true, 'Full Stack'),
('1', 'Bangla GK', 'A deep learning application that generates realistic general knowledge answers with full accuracy.', 'https://db-ai-six.vercel.app/logo.svg', ARRAY['Python', 'PyTorch', 'FastAPI', 'NextJs', 'Datasets', 'Huggingface', 'Tensorflow', 'Transformers'], 'https://db-ai-six.vercel.app/', 'https://github.com/thedeba/db-ai', true, 'AI/ML'),
('2', 'Railgate Automation', 'Fully automatic rail gate automation project is showed with demo.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWYhTSiLC5FzLfv-GO_OIFNn1s-6s6SmRdAg&s', ARRAY['C++', 'Arduino', 'Servo Motor', 'IR Sensors', 'Magnetic Sensors', 'Ultrasonic Sensors etc.'], '', 'https://github.com/thedeba/railProject', false, 'Other'),
('3', 'eRoute', 'eRoute is a Flutter project which is used to schedule live transportation.', 'https://play-lh.googleusercontent.com/Y8GMfhuXXb0AQWhL2CYoHNJlT-h7lQ84HzmCUyyc4Z6jcB5z6MO2qug3HZC3iCR6zYY', ARRAY['Flutter', 'Dart', 'Firebase'], '', 'https://github.com/thedeba/erouteadmin', true, 'Full Stack');

-- Insert Speaking Engagements
INSERT INTO speaking_engagements (title, event, date, location, type) VALUES 
('Modern Web Development Practices', 'Developer Meetup', 'January 2024', 'Online', 'workshop'),
('Building Scalable APIs with Node.js', 'Tech Conference 2024', 'March 2024', 'San Francisco, CA', 'talk');

-- Insert Publications
INSERT INTO publications (title, journal, date, authors, link) VALUES 
('Efficient Neural Network Architectures for Edge Devices', 'Journal of Machine Learning Research', '2024', 'Debashish, et al.', 'https://example.com/paper1'),
('Real-time Data Processing with React and WebSockets', 'Web Development Quarterly', '2023', 'Debashish', 'https://example.com/paper2');
