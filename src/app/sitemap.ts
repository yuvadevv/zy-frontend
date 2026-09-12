import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const basicRoutes = ['', '/about', '/contact', '/pricing', '/features', '/privacy', '/terms'].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const serviceRoutes = [
    '/services/academic-manual-printing',
    '/services/custom-pdf-printing',
    '/services/hall-ticket-printing',
    '/services/campus-document-delivery'
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...basicRoutes, ...serviceRoutes];
}
