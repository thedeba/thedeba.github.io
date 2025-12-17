# Admin Panel Documentation

## Overview
The admin panel allows you to manage your portfolio's content including blog posts and videos.

## Accessing the Admin Panel
Navigate to `/admin` in your browser (e.g., `http://localhost:3000/admin`)

## Features

### Blog Management
- **Create**: Add new blog posts with title, excerpt, content, and read time
- **Edit**: Modify existing blog posts
- **Delete**: Remove blog posts
- **View**: See all blog posts in a list

### Video Management
- **Create**: Add new videos with title, platform (YouTube/Facebook/Instagram), embed URL, and description
- **Edit**: Modify existing videos
- **Delete**: Remove videos
- **View**: See all videos in a list

## Data Storage
Content is stored in JSON files in the `data/` directory:
- `data/blogs.json` - Blog posts
- `data/videos.json` - Videos

## API Endpoints
- `GET /api/blogs` - Retrieve all blogs
- `POST /api/blogs` - Create a new blog
- `PUT /api/blogs` - Update an existing blog
- `DELETE /api/blogs?id={id}` - Delete a blog
- `GET /api/videos` - Retrieve all videos
- `POST /api/videos` - Create a new video
- `PUT /api/videos` - Update an existing video
- `DELETE /api/videos?id={id}` - Delete a video

## Usage
1. Go to the admin panel
2. Choose between "Blogs" or "Videos" tabs
3. Fill out the form to create new content
4. Use Edit/Delete buttons to manage existing content
5. Changes are automatically reflected on the main portfolio site