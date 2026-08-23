'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Ticket, FileText, BookOpen, MapPin, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { workerClient } from '@/lib/api/workerClient';

const getThemeClass = (theme: string) => {
  switch (theme) {
    case 'orange': return 'bg-gradient-to-br from-[#FF6B00] to-[#E66000]';
    case 'purple': return 'bg-gradient-to-br from-purple-600 to-purple-800';
    case 'blue': return 'bg-gradient-to-br from-blue-600 to-blue-800';
    case 'green': return 'bg-gradient-to-br from-green-600 to-green-800';
    default: return 'bg-gradient-to-br from-[#FF6B00] to-[#E66000]';
  }
};

const getIcon = (iconName: string) => {
  const props = { className: "w-24 h-24 text-white opacity-20 absolute right-4 -bottom-1 transform rotate-12", strokeWidth: 1 };
  switch (iconName) {
    case 'clock': return <Clock {...props} />;
    case 'ticket': return <Ticket {...props} />;
    case 'document': return <FileText {...props} />;
    case 'book': return <BookOpen {...props} />;
    default: return <ImageIcon {...props} />;
  }
};

export const PromoBanners = ({ hasActiveOrders = false }: { hasActiveOrders?: boolean }) => {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await workerClient.getContent('banner');
        if (response.content && response.content.length > 0) {
          // Map backend schema to frontend expected format
          const mappedBanners = response.content.map((b: any, index: number) => ({
            id: b.id,
            index,
            isImage: b.type === 'banner_image' || !!b.image_key,
            imageUrl: b.image_key ? `${process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8500'}/api/public/${b.image_key}` : '',
            title: b.title,
            desc: b.message,
            cta: b.cta_label,
            bg: getThemeClass(b.theme),
            iconName: b.icon,
            textColor: 'text-white',
            descColor: 'text-white/80',
            route: b.cta_url || '#'
          }));
          setBanners(mappedBanners);
        }
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="relative overflow-hidden h-[160px] w-full rounded-[24px] shadow-sm border border-gray-100 bg-gray-50 animate-pulse flex items-center justify-center">
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    if (hasActiveOrders) return null; // Only hide completely if there is an active order

    // Default Fallback BLINTZY Hero for users with no active orders
    return (
      <div className="w-full">
        <div className="relative overflow-hidden h-[160px] w-full rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 bg-gradient-to-br from-[#FF6B00] to-[#E66000] flex items-center px-6 cursor-pointer" onClick={() => window.location.href = '/app/services'}>
          <ImageIcon className="w-24 h-24 text-white opacity-20 absolute right-4 -bottom-1 transform rotate-12" strokeWidth={1} />

          <div className="relative z-10 max-w-[75%] flex flex-col items-start gap-1">
            <h3 className="text-[22px] font-black leading-tight text-white mb-0.5">
              Smart Printing. Delivered to You.
            </h3>
            <p className="text-[13px] font-medium text-white/90 mb-2">
              Fast, high-quality printing for students.
            </p>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = '/app/services';
              }}
              className="mt-1 px-5 h-[36px] bg-white text-[#FF6B00] font-bold rounded-[12px] text-[13px] shadow-sm hover:scale-105 transition-transform"
            >
              Start Printing
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden h-[160px] w-full rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className={`absolute inset-0 flex flex-col justify-center ${banners[current].isImage ? '' : 'px-6'} ${banners[current].bg || 'bg-transparent'}`}
          >
            {banners[current].isImage ? (
              <div
                className="relative w-full h-full cursor-pointer"
                onClick={() => {
                  if (banners[current].route) {
                    window.location.href = banners[current].route;
                  }
                }}
              >
                <img
                  src={banners[current].imageUrl}
                  alt={banners[current].title || 'Banner'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <>
                {getIcon(banners[current].iconName)}

                <div className="relative z-10 max-w-[70%] flex flex-col items-start gap-2">
                  <h3 className={`text-[20px] font-black leading-tight ${banners[current].textColor}`}>
                    {banners[current].title}
                  </h3>
                  <p className={`text-sm font-medium ${banners[current].descColor}`}>
                    {banners[current].desc}
                  </p>

                  {banners[current].cta && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (banners[current].route) {
                          window.location.href = banners[current].route;
                        }
                      }}
                      className="mt-1 -translate-y-1 px-5 h-[36px] bg-white text-gray-900 font-bold rounded-[12px] text-xs shadow-sm hover:scale-105 transition-transform"
                    >
                      {banners[current].cta}
                    </motion.button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {banners.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2.5 z-20">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className="p-2 -m-2 cursor-pointer"
                aria-label={`Go to slide ${i + 1}`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
