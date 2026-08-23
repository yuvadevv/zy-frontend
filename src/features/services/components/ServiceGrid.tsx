"use client";
import React from 'react';
import { Service } from '../types';
import { ServiceCard } from './ServiceCard';
import { ServiceEmptyState } from './ServiceEmptyState';

interface ServiceGridProps {
  services: Service[];
  onServiceSelect: (id: string) => void;
  searchQuery?: string;
}

export const ServiceGrid = ({ services, onServiceSelect, searchQuery = '' }: ServiceGridProps) => {
  if (!services || services.length === 0) {
    if (searchQuery) {
      return (
        <div className="px-4">
          <ServiceEmptyState 
            title="No Services Found" 
            description={`We couldn't find any services matching "${searchQuery}".`} 
            actionLabel=""
          />
        </div>
      );
    }
    return (
      <div className="px-4">
        <ServiceEmptyState />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {services.map((service) => (
        <ServiceCard 
          key={service.id} 
          service={service} 
          onClick={onServiceSelect} 
        />
      ))}
    </div>
  );
};
