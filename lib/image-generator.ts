/**
 * Generate a random image URL for blog posts
 * @param width Image width (default: 800)
 * @param height Image height (default: 400)
 * @returns Random image URL
 */
export function generateRandomImage(width: number = 800, height: number = 400): string {
  // Using Lorem Picsum for random placeholder images
  // You can also use other services like Unsplash or Pexels
  const seed = Math.random().toString(36).substring(7);
  return `https://picsum.photos/${width}/${height}?random=${seed}`;
}

/**
 * Generate a random image URL with a specific category/theme
 * @param category Image category (e.g., 'tech', 'nature', 'business')
 * @param width Image width (default: 800)
 * @param height Image height (default: 400)
 * @returns Random image URL
 */
export function generateThemedImage(category: string, width: number = 800, height: number = 400): string {
  const seed = Math.random().toString(36).substring(7);
  return `https://picsum.photos/seed/${category}-${seed}/${width}/${height}.jpg`;
}
