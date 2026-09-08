import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/vendor/', '/app/', '/api/', '/auth/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
