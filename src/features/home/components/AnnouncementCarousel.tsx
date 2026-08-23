"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Announcement } from '../types';
import { Info, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';

interface CarouselProps {
  announcements: Announcement[];
}

export const AnnouncementCarousel = ({ announcements }: CarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!announcements || announcements.length <= 1) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: clientWidth * 0.85, behavior: 'smooth' });
        }
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [announcements]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.children[0].clientWidth;
      const index = Math.round(scrollLeft / cardWidth);
      if (index !== activeIndex && index >= 0 && index < announcements.length) {
        setActiveIndex(index);
      }
    }
  };

  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-3 pb-3 snap-x snap-mandatory hide-scrollbar"
      >
        {announcements.map((ann, i) => {
          let cardStyle = "bg-green-50/80 border-green-100";
          let badgeStyle = "bg-white text-green-600";
          let titleColor = "text-green-950";
          let iconColor = "text-green-200/60";
          let iconBg = "bg-white/40";
          let icon = <CheckCircle className={`w-14 h-14 ${iconColor} absolute top-4 right-4 transform rotate-12`} strokeWidth={1.5} />;
          
          const cat = ann.category?.toUpperCase() || '';
          if (cat === 'DANGER' || cat === 'URGENT') {
            cardStyle = "bg-red-50/80 border-red-100";
            badgeStyle = "bg-white text-red-600";
            titleColor = "text-red-950";
            iconColor = "text-red-200/60";
            iconBg = "bg-white/40";
            icon = <ShieldAlert className={`w-14 h-14 ${iconColor} absolute top-4 right-4 transform rotate-12`} strokeWidth={1.5} />;
          } else if (cat === 'INFO') {
            cardStyle = "bg-blue-50/80 border-blue-100";
            badgeStyle = "bg-white text-blue-600";
            titleColor = "text-blue-950";
            iconColor = "text-blue-200/60";
            iconBg = "bg-white/40";
            icon = <Info className={`w-14 h-14 ${iconColor} absolute top-4 right-4 transform -rotate-12`} strokeWidth={1.5} />;
          } else if (cat === 'WARNING' || cat === 'NEW') {
            cardStyle = "bg-orange-50/80 border-orange-100";
            badgeStyle = "bg-white text-[#FF6B00]";
            titleColor = "text-orange-950";
            iconColor = "text-orange-200/60";
            iconBg = "bg-white/40";
            icon = <AlertTriangle className={`w-14 h-14 ${iconColor} absolute top-4 right-4 transform rotate-12`} strokeWidth={1.5} />;
          }

          return (
            <motion.div 
              key={ann.id} 
              whileTap={{ scale: 0.98 }}
              className={`w-[85%] max-w-[320px] h-[140px] snap-start px-5 py-4 border rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] shrink-0 flex justify-between relative overflow-hidden ${cardStyle}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

              <div className="flex flex-col justify-between h-full z-10 w-[80%] pr-2">
                <div className="flex flex-col gap-1.5">
                  <span className={`self-start px-2 py-0.5 text-[11px] font-bold rounded-lg uppercase tracking-wider shadow-sm ${badgeStyle}`}>
                    {cat || 'NORMAL'}
                  </span>
                  <div>
                    <h4 className={`font-bold text-[16px] leading-tight mb-0.5 line-clamp-1 ${titleColor}`}>{ann.title}</h4>
                    {(ann as any).description && (
                      <p className="text-[13px] text-gray-500 font-medium line-clamp-2 leading-snug">{(ann as any).description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-auto">
                  {ann.ctaButtonText && (
                    <a href={ann.ctaButtonLink || '#'} className="text-[14px] font-bold text-[#FF6B00] hover:text-orange-600 group flex items-center transition-opacity active:opacity-70">
                      {ann.ctaButtonText} <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
                    </a>
                  )}
                </div>
              </div>
              
              <div className={`absolute -right-4 -bottom-4 w-32 h-32 rounded-full flex items-center justify-center pointer-events-none ${iconBg}`}>
                {icon}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {announcements.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-1 mb-2">
          {announcements.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                if (scrollRef.current) {
                  const cardWidth = scrollRef.current.children[0].clientWidth;
                  scrollRef.current.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                }
              }}
              className="p-1 -m-1 cursor-pointer"
              aria-label={`Go to announcement ${i + 1}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex 
                    ? 'w-5 bg-[#FF6B00]' 
                    : 'w-1.5 bg-gray-200'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


