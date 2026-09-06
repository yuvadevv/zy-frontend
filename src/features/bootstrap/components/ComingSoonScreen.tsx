"use client";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Printer, FileText, Upload, Sparkles, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { workerClient } from "@/lib/api/workerClient";

export function ComingSoonScreen({ onDismiss }: { onDismiss?: () => void }) {
  const [isMounted, setIsMounted] = useState(false);
  const [clickedCTA, setClickedCTA] = useState(false);

  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loadingHero, setLoadingHero] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await workerClient.getContent('launch_hero');
        if (response.content && response.content.length > 0) {
          const active = response.content.sort((a:any, b:any) => (b.priority || 1) - (a.priority || 1))[0];
          if (active.image_url || active.image_key) {
            const key = active.image_url || active.image_key;
            setHeroImage(`${process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8500'}/api/public/${key}`);
          }
        }
      } catch (err) {
        console.error("Failed to load hero image:", err);
      } finally {
        setLoadingHero(false);
      }
    };
    fetchHero();
  }, []);

  // Parallax effect values for desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Extremely subtle movement for a premium feel
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-4, 4]);
  const translateX = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  const translateY = useTransform(mouseY, [-0.5, 0.5], [-10, 10]);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      // Only apply on desktop devices
      if (window.innerWidth < 1024) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = clientX / innerWidth - 0.5;
      const y = clientY / innerHeight - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0B] text-[#F7F7F5] flex flex-col overflow-x-hidden overflow-y-auto font-sans selection:bg-[#FF6B00] selection:text-white">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle radial orange atmosphere */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#FF6B00] rounded-full blur-[160px] opacity-[0.06] mix-blend-screen translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-[#FF6B00] rounded-full blur-[120px] opacity-[0.03] mix-blend-screen -translate-x-1/4 translate-y-1/4" />
        
        {/* Subtle Grid */}
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Vignette / Edge Shadow for cinematic depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(11,11,11,1)] z-10" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
        
        {/* Header */}
        <header className="w-full py-8 sm:py-12 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-black tracking-tighter">
            BLINTZY<span className="text-[#FF6B00]">.</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
              Preparing Launch
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-16 lg:gap-8 pb-20 pt-8 lg:pt-0">
          
          {/* Left: Typography & Messaging */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-5/12 flex flex-col z-20 text-center lg:text-left order-2 lg:order-1"
          >
            <div className="inline-flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="h-[1px] w-8 bg-[#FF6B00]" />
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#FF6B00] uppercase">
                Built for Campus Life
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter leading-[1.05] text-[#F7F7F5] mb-6">
              THE CAMPUS <br />
              <span className="text-white/60 font-medium">IS ABOUT TO GET</span><br />
              SMARTER.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/50 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0 mb-10">
              A smarter way to print, access academic documents,
              and get what you need — built specifically for campus life.
            </p>

            <div className="mb-10 flex flex-col items-center lg:items-start gap-1 text-center lg:text-left">
              <span className="text-[11px] sm:text-sm font-bold tracking-[0.2em] text-[#FF6B00] uppercase">
                Coming Soon To
              </span>
              <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#F7F7F5]">
                Ramachandra College of Engineering <br className="hidden sm:block lg:hidden" />
                <span className="text-white/60">— Eluru</span>
              </span>
            </div>

            {/* Non-navigating CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => {
                  setClickedCTA(true);
                  if (onDismiss) setTimeout(onDismiss, 800);
                }}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-bold bg-white text-[#0B0B0B] rounded-full overflow-hidden transition-transform active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {clickedCTA ? "We're almost ready" : "See What We're Building"}
                  {!clickedCTA && (
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </span>
                <div className="absolute inset-0 bg-gray-200 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              </button>
            </div>
          </motion.div>

          {/* Right: Admin Uploaded Square Image */}
          <div className="w-full lg:w-7/12 flex items-center justify-center lg:justify-end order-1 lg:order-2 mt-8 lg:mt-0">
            <div className="w-full max-w-[380px] lg:max-w-[580px] lg:w-[clamp(400px,38vw,580px)] aspect-square rounded-[28px] lg:rounded-[32px] overflow-hidden border border-white/15 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative flex items-center justify-center">
              
              {loadingHero ? (
                /* Premium skeleton */
                <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent animate-pulse flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#FF6B00] animate-spin" />
                </div>
              ) : heroImage ? (
                /* Admin uploaded image */
                <img 
                  src={heroImage} 
                  alt="BLINTZY launch coming soon at Ramachandra College of Engineering" 
                  className="w-full h-full object-cover object-center" 
                />
              ) : (
                /* Fallback */
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/5 to-[#141414] p-12 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                  <ImageIcon className="w-10 h-10 text-white/20 mb-6" />
                  <h3 className="text-xl font-bold text-white/80 tracking-tight mb-2">BLINTZY</h3>
                  <p className="text-sm font-medium text-white/40 max-w-[200px]">Launch visual coming soon.</p>
                  <div className="absolute top-0 right-8 w-[1px] h-32 bg-gradient-to-b from-transparent via-[#FF6B00]/40 to-transparent" />
                </div>
              )}

              {/* Tiny subtle orange accent outside frame */}
              <div className="absolute top-8 right-0 w-1.5 h-12 bg-[#FF6B00] rounded-l-full opacity-80" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-6 sm:py-8 border-t border-white/5 flex flex-col justify-center items-center gap-4 text-center">
          <div className="text-[10px] sm:text-xs font-medium text-white/30 tracking-wide">
            © {new Date().getFullYear()} Blintzy. All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
}
