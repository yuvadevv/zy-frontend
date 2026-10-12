'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface OfferSparklesProps {
  active: boolean;
}

export const OfferSparkles = ({ active }: OfferSparklesProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (!active || shouldReduceMotion) return null;

  // 12 tasteful confetti particles in BLINTZY orange (#FF6B00), amber (#F59E0B), and warm cream (#FEF3C7)
  const particles = [
    { x: -28, y: -24, scale: 1.1, color: '#FF6B00', duration: 0.7, delay: 0 },
    { x: 32, y: -26, scale: 0.9, color: '#F59E0B', duration: 0.65, delay: 0.05 },
    { x: -40, y: -8, scale: 1.0, color: '#FEF3C7', duration: 0.6, delay: 0.08 },
    { x: 42, y: -6, scale: 1.2, color: '#FF6B00', duration: 0.75, delay: 0.02 },
    { x: -25, y: 22, scale: 0.8, color: '#F59E0B', duration: 0.65, delay: 0.06 },
    { x: 28, y: 24, scale: 1.0, color: '#FF8533', duration: 0.7, delay: 0.04 },
    { x: -12, y: -34, scale: 1.2, color: '#FF6B00', duration: 0.72, delay: 0.03 },
    { x: 14, y: -32, scale: 0.8, color: '#FEF3C7', duration: 0.68, delay: 0.07 },
    { x: -35, y: 12, scale: 0.9, color: '#FF8533', duration: 0.65, delay: 0.05 },
    { x: 38, y: 14, scale: 1.1, color: '#F59E0B', duration: 0.7, delay: 0.02 },
    { x: 0, y: -36, scale: 1.3, color: '#FF6B00', duration: 0.75, delay: 0 },
    { x: 0, y: 32, scale: 0.9, color: '#FEF3C7', duration: 0.62, delay: 0.06 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden flex items-center justify-center" aria-hidden="true">
      {particles.map((p, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, p.scale, 0],
            x: p.x,
            y: p.y
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="absolute w-2 h-2 rounded-full shadow-2xs"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
};
