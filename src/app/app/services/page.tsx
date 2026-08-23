import React from 'react';
import { STATIC_SERVICES, STATIC_CATEGORIES, STATIC_FEATURED } from '@/features/services/mock/servicesData';
import { mapService, mapCategory, mapFeaturedService } from '@/features/services/mappers';
import { ServicesLayout } from '@/features/services/components/ServicesLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Printing Services | BLINTZY',
  description: 'Choose from a variety of printing services.',
};

export default async function ServicesHubPage() {
  // In a real app, these would be fetched via Server Actions or fetch() from an API route.
  // We simulate server fetching and mapping here.
  const services = STATIC_SERVICES.data.map(mapService);
  const categories = STATIC_CATEGORIES.data.map(mapCategory);
  const featured = STATIC_FEATURED.data.map(mapFeaturedService);

  return (
    <main className="w-full h-full bg-background min-h-screen">
      <ServicesLayout 
        initialServices={services}
        initialCategories={categories}
        initialFeatured={featured}
      />
    </main>
  );
}
