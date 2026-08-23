import React from 'react';

interface ServiceHeaderProps {
  title?: string;
  subtitle?: string;
}

export const ServiceHeader = ({ 
  title = "Printing Services", 
  subtitle = "Choose a service to continue" 
}: ServiceHeaderProps) => (
  <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md pb-4 pt-[1.125rem] px-5 border-b border-transparent">
    <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-tight">{title}</h1>
    <p className="text-[14px] text-gray-500 font-medium mt-1 leading-snug">{subtitle}</p>
  </header>
);
