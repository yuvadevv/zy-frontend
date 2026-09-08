import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/contact', '/pricing', '/privacy', '/terms'].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}
