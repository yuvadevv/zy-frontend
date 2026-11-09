'use client';

import React, { useEffect, useState } from 'react';
import { useAnimation, useInView } from 'framer-motion';
import { SectionContainer } from './SectionContainer';

interface StatItem {
  label: string;
  value: number;
}

const Counter = ({ from, to }: { from: number; to: number }) => {
  const [count, setCount] = useState(from);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      let start = from;
      const end = to;
      const duration = 2000;
      const incrementTime = 20;
      const step = Math.abs(end - start) / (duration / incrementTime);

      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(Math.floor(start));
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, from, to]);

  return <span ref={ref}>{count.toLocaleString()}{to > 1000 ? '+' : ''}</span>;
};

export function Statistics({ data }: { data?: any[] }) {
  if (!data || data.length === 0) return null;

  const stats: StatItem[] = data.map((d) => ({
    label: d.title,
    value: parseInt((d.message || '0').replace(/,/g, ''), 10) || 0,
  }));

  return (
    <SectionContainer className="bg-[#FF6B00] text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center divide-x divide-orange-400">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center justify-center p-4">
            <span className="text-4xl md:text-5xl font-extrabold mb-2 text-white">
              <Counter from={0} to={stat.value} />
            </span>
            <span className="text-orange-100 font-semibold uppercase tracking-wider text-sm">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
