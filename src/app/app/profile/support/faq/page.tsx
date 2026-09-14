'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { workerClient } from '@/lib/api/workerClient';

export default function FAQPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const response = await workerClient.getFaqs();
        if (response?.faqs) {
          setFaqs(response.faqs);
        }
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFaqs();
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Group by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    acc[faq.category] = acc[faq.category] || [];
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="flex flex-col w-full h-full bg-white min-h-[100dvh]">
      <div className="flex items-center p-4 border-b border-gray-100 sticky top-0 bg-white z-10 gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-black transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-black">Frequently Asked Questions</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-32">
        {loading ? (
          <div className="flex justify-center p-10">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : Object.keys(groupedFaqs).length === 0 ? (
          <div className="text-center p-10 text-gray-500">No FAQs available.</div>
        ) : (
          Object.keys(groupedFaqs).map(category => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-bold text-black mb-4 ml-1">{category}</h3>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
                {groupedFaqs[category].map((faq: any) => (
                  <div key={faq.id} className="flex flex-col">
                    <button 
                      onClick={() => toggleItem(faq.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="font-semibold text-black pr-4">{faq.question}</span>
                      {openItems[faq.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                      )}
                    </button>
                    {openItems[faq.id] && (
                      <div className="p-4 bg-gray-50 text-sm text-gray-600 border-t border-gray-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
