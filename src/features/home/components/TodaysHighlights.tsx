"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Ticket, FileText, BookOpen, Sparkles, Bell, Printer, ArrowRight } from 'lucide-react';
import { workerClient } from '@/lib/api/workerClient';

const getThemeClass = (theme: string) => {
  switch (theme) {
    case 'orange': return 'bg-gradient-to-br from-[#FF6B00] to-[#E66000] text-white';
    case 'purple': return 'bg-gradient-to-br from-purple-500 to-purple-700 text-white';
    case 'blue': return 'bg-gradient-to-br from-blue-500 to-blue-700 text-white';
    case 'green': return 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white';
    case 'neutral': return 'bg-gray-50 text-gray-900 border border-gray-100 shadow-sm';
    default: return 'bg-gradient-to-br from-[#FF6B00] to-[#E66000] text-white';
  }
};

const getIcon = (iconName: string, isLight: boolean) => {
  const props = { className: `w-5 h-5 ${isLight ? 'text-gray-900' : 'text-white'}` };
  switch (iconName) {
    case 'clock': return <Clock {...props} />;
    case 'ticket': return <Ticket {...props} />;
    case 'document': return <FileText {...props} />;
    case 'book': return <BookOpen {...props} />;
    case 'sparkles': return <Sparkles {...props} />;
    case 'bell': return <Bell {...props} />;
    case 'printer': return <Printer {...props} />;
    default: return <Sparkles {...props} />;
  }
};

export const TodaysHighlights = () => {
  const router = useRouter();
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await workerClient.getContent('highlight');
        if (response.content && Array.isArray(response.content)) {
          const sorted = response.content.sort((a: any, b: any) => (a.priority || 99) - (b.priority || 99));
          setHighlights(sorted);
        }
      } catch (err) {
        console.error('Failed to fetch highlights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  const handleNavigate = (url: string) => {
    if (!url) return;
    try {
      const parsedUrl = new URL(url, window.location.origin);
      if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
        router.push(parsedUrl.pathname + parsedUrl.search + parsedUrl.hash);
      }
    } catch (e) {
      // Invalid URL or relative path fallback
      if (url.startsWith('/')) {
        router.push(url);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
        {[1, 2].map(i => (
          <div key={i} className="min-w-[260px] h-[90px] snap-center rounded-[16px] bg-gray-50 border border-gray-100 animate-pulse shrink-0" />
        ))}
      </div>
    );
  }

  if (highlights.length === 0) {
    return (
      <div className="w-full bg-gray-50 border border-gray-100 rounded-[16px] py-3 px-4 mb-4 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-gray-900">Fresh updates</h4>
          <p className="text-xs text-gray-500 mt-0.5">Will appear here soon.</p>
        </div>
        <Sparkles className="w-5 h-5 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
      {highlights.map((highlight) => {
        const isLight = highlight.theme === 'neutral';
        const isClickable = !!highlight.cta_url;

        return (
          <div 
            key={highlight.id} 
            onClick={() => handleNavigate(highlight.cta_url)}
            className={`relative min-w-[280px] max-w-[320px] min-h-[105px] snap-center p-4 rounded-[16px] shrink-0 flex flex-col justify-between gap-2 overflow-hidden transition-all duration-200 ${isClickable ? 'cursor-pointer hover:scale-[1.02] hover:shadow-md active:scale-95' : ''} ${getThemeClass(highlight.theme)}`}
          >
            <div className="flex items-start gap-3">
              <div className={`shrink-0 p-1.5 rounded-xl ${isLight ? 'bg-white shadow-sm' : 'bg-white/20'}`}>
                {getIcon(highlight.icon, isLight)}
              </div>
              <div className="flex flex-col mt-0.5">
                <h4 className={`font-bold text-[14px] leading-tight tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  {highlight.title}
                </h4>
                {highlight.message && (
                  <p className={`text-[12px] font-medium leading-snug line-clamp-1 mt-1 ${isLight ? 'text-gray-500' : 'text-white/80'}`}>
                    {highlight.message}
                  </p>
                )}
              </div>
            </div>

            {highlight.cta_label && isClickable && (
              <div className="flex justify-end mt-1">
                <div 
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-colors ${
                    isLight 
                      ? 'bg-gray-900 text-white shadow-sm' 
                      : 'bg-white text-gray-900 shadow-sm'
                  }`}
                >
                  <span>{highlight.cta_label}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
