"use client";
import React, { useState, useMemo } from 'react';
import { Service, Category, FeaturedService } from '../types';
import { ServiceHeader } from './ServiceHeader';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { ServiceGrid } from './ServiceGrid';
import { FeaturedServices } from './FeaturedServices';
import { HelpCard } from './HelpCard';
import { useServicesAnalytics } from '../analytics/useServicesAnalytics';
import { useRouter } from 'next/navigation';

interface ServicesLayoutProps {
  initialServices: Service[];
  initialCategories: Category[];
  initialFeatured: FeaturedService[];
}

export const ServicesLayout = ({ initialServices, initialCategories, initialFeatured }: ServicesLayoutProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const analytics = useServicesAnalytics();
  const router = useRouter();

  // Filter Logic
  const filteredServices = useMemo(() => {
    let result = initialServices;

    // Filter by Category (unless 'all')
    if (activeCategoryId !== 'all') {
      result = result.filter(s => s.categoryIds.includes(activeCategoryId));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q) ||
        (s.subtitle && s.subtitle.toLowerCase().includes(q))
      );
    }

    return result;
  }, [initialServices, activeCategoryId, searchQuery]);

  // Handlers
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim()) analytics.trackSearchUsed(q);
  };

  const handleCategorySelect = (id: string) => {
    setActiveCategoryId(id);
    analytics.trackCategoryChanged(id);
  };

  const handleServiceClick = (id: string) => {
    const service = initialServices.find(s => s.id === id);
    if (service && service.enabled && !service.comingSoon && !service.maintenance) {
      analytics.trackServiceClicked(id);
      router.push(service.route);
    }
  };

  const handleFeaturedClick = (id: string, campaign?: string) => {
    analytics.trackFeaturedClicked(id, campaign);
    const service = initialServices.find(s => s.id === id);
    if (service) {
      router.push(service.route);
    }
  };

  return (
    <div className="flex flex-col w-full pb-24">
      <ServiceHeader />
      
      <div className="pt-2">
        <SearchBar value={searchQuery} onChange={handleSearch} />
        
        {/* Hide categories and featured if searching */}
        {!searchQuery && (
          <>
            <CategoryFilter 
              categories={initialCategories.sort((a,b) => a.priority - b.priority)} 
              activeCategoryId={activeCategoryId} 
              onSelect={handleCategorySelect} 
            />
            
            {activeCategoryId === 'all' && (
              <FeaturedServices 
                featured={initialFeatured} 
                services={initialServices} 
                onFeaturedClick={handleFeaturedClick} 
              />
            )}
          </>
        )}

        <ServiceGrid 
          services={filteredServices} 
          onServiceSelect={handleServiceClick} 
          searchQuery={searchQuery} 
        />
        
        {!searchQuery && activeCategoryId === 'all' && (
          <HelpCard onHelpClick={analytics.trackHelpClicked} />
        )}
      </div>
    </div>
  );
};
