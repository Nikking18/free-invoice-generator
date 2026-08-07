import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '../lib/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://free-invoice-generator-red.vercel.app';
  const posts = getAllBlogPosts();

  const blogPostRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogPostRoutes,
  ];
}
