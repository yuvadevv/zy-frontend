"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Settings, Printer, Package, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/design-system/utils/cn";

export interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface OnboardingCarouselProps {
  slides?: CarouselSlide[];
  intervalMs?: number;
  pauseMs?: number;
  compact?: boolean;
  reducedMotion?: boolean;
}

const defaultSlides: CarouselSlide[] = [
  {
    id: "upload",
    title: "Upload PDF",
    description: "Simple document upload right from your phone.",
    icon: <FileUp className="w-16 h-16 sm:w-20 sm:h-20 text-orange-500" strokeWidth={1.5} />,
  },
  {
    id: "configure",
    title: "Print Configuration",
    description: "Choose copies, color, and binding options easily.",
    icon: <Settings className="w-16 h-16 sm:w-20 sm:h-20 text-orange-500" strokeWidth={1.5} />,
  },
  {
    id: "vendor",
    title: "Vendor Printing",
    description: "Professionally printed by our campus partners.",
    icon: <Printer className="w-16 h-16 sm:w-20 sm:h-20 text-orange-500" strokeWidth={1.5} />,
  },
  {
    id: "packaging",
    title: "Packaging",
    description: "Securely packed and labeled for you.",
    icon: <Package className="w-16 h-16 sm:w-20 sm:h-20 text-orange-500" strokeWidth={1.5} />,
  },
  {
    id: "delivery",
    title: "Classroom Delivery",
    description: "Delivered straight to your classroom desk.",
    icon: <MapPin className="w-16 h-16 sm:w-20 sm:h-20 text-orange-500" strokeWidth={1.5} />,
  },
  {
    id: "success",
    title: "Success",
    description: "Ready before your lecture even begins.",
    icon: <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-500" strokeWidth={1.5} />,
  },
];

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({
  slides = defaultSlides,
  intervalMs = 4500,
  pauseMs = 3000,
  compact = false,
  reducedMotion = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= slides.length) {
        setIsFinished(true);
        return prev;
      }
      return nextIndex;
    });
  }, [slides.length]);

  useEffect(() => {
    if (reducedMotion || isPaused) return;

    let timeout: NodeJS.Timeout;

    if (isFinished) {
      timeout = setTimeout(() => {
        setIsFinished(false);
        setCurrentIndex(0);
      }, pauseMs);
    } else {
      timeout = setTimeout(nextSlide, intervalMs);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, isFinished, isPaused, nextSlide, intervalMs, pauseMs, reducedMotion]);

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -100 && currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (swipe > 100 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const variants = reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, x: 20, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: -20, scale: 0.95 },
      };

  return (
    <div
      className={cn("w-full relative flex flex-col items-center justify-center", compact ? "h-[200px]" : "h-full")}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className={cn("relative w-full flex-1 flex items-center justify-center overflow-hidden", compact ? "mb-4" : "mb-12")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            drag={reducedMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="flex flex-col items-center text-center absolute w-full px-4 cursor-grab active:cursor-grabbing"
          >
            <div className={cn("bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center", compact ? "w-16 h-16 mb-4" : "w-28 h-28 mb-8")}>
              {slides[currentIndex].icon}
            </div>
            {!compact && (
              <span className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">
                Step {currentIndex + 1} of {slides.length}
              </span>
            )}
            <h2 className={cn("font-bold text-gray-900 tracking-tight", compact ? "text-lg mb-1" : "text-3xl mb-4")}>
              {slides[currentIndex].title}
            </h2>
            <p className={cn("text-gray-500 leading-relaxed max-w-sm", compact ? "text-sm hidden sm:block" : "text-lg")}>
              {slides[currentIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center justify-center space-x-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
              setIsFinished(false);
            }}
            className="p-2 -m-2 cursor-pointer"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentIndex ? "w-6 sm:w-8 bg-orange-500" : "w-1.5 sm:w-2 bg-gray-200 hover:bg-gray-300"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
