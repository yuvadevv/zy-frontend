'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBootstrapConfig } from '@/features/bootstrap/services/bootstrapService';
import toast from 'react-hot-toast';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Services', href: '/#services', hash: 'services' },
  { name: 'Workflow', href: '/#product', hash: 'product' },
  { name: 'How It Works', href: '/#how-it-works', hash: 'how-it-works' },
  { name: 'Why BLINTZY', href: '/#why-blintzy', hash: 'why-blintzy' },
  { name: 'Ecosystem', href: '/#ecosystem', hash: 'ecosystem' },
  { name: 'FAQ', href: '/#faq', hash: 'faq' },
];

export function Navbar() {
  const { data: bootstrapData } = useQuery({
    queryKey: ['bootstrap'],
    queryFn: fetchBootstrapConfig,
    staleTime: 1000 * 60,
  });
  const isComingSoon = bootstrapData?.data?.coming_soon;

  const handleRestrictedAction = (e: React.MouseEvent) => {
    if (isComingSoon) {
      e.preventDefault();
      toast('This feature is currently disabled during Coming Soon mode.', { icon: '🔒' });
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;

    const sectionElements = navLinks
      .map((link) => (link.hash ? document.getElementById(link.hash) : null))
      .filter(Boolean) as HTMLElement[];

    const visibleSections = new Set<string>();

    const observerCallback: IntersectionObserverCallback = (entries) => {
      let changed = false;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target.id);
          changed = true;
        } else {
          if (visibleSections.has(entry.target.id)) {
            visibleSections.delete(entry.target.id);
            changed = true;
          }
        }
      });

      if (changed) {
        const active = sectionElements.find((el) => visibleSections.has(el.id));
        if (active) {
          setActiveSection(active.id);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-100px 0px -40% 0px',
      threshold: 0,
    });

    sectionElements.forEach((el) => observer.observe(el));

    const handleTopScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleTopScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleTopScroll);
    };
  }, [pathname]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#FF6B00] origin-left z-[70]"
        style={{ scaleX }}
      />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-[#EAEAEA] py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 z-50 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF6B00] text-white font-black text-lg shadow-[0_2px_8px_rgba(255,107,0,0.35)] transition-transform duration-300 group-hover:scale-105">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-[#171717] leading-none transition-colors group-hover:text-[#FF6B00]">
                BLINTZY
              </span>
              <span className="text-[10px] font-semibold text-[#737373] tracking-wider uppercase mt-0.5">
                Campus Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F7F7F5]/80 p-1.5 rounded-full border border-[#EAEAEA] backdrop-blur-sm">
            {navLinks.map((link) => {
              const isHashActive = activeSection === link.hash;
              const isActive = pathname === '/' && isHashActive;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-[#171717] bg-white shadow-sm font-bold'
                      : 'text-[#737373] hover:text-[#171717] hover:bg-white/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/app/login"
              onClick={handleRestrictedAction}
              className="text-xs font-semibold text-[#737373] hover:text-[#171717] transition-colors px-3 py-2 rounded-lg"
            >
              Sign In
            </Link>
            <Link
              href="/app/login"
              onClick={handleRestrictedAction}
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#e05e00] transition-all px-4 py-2.5 rounded-full shadow-[0_4px_14px_rgba(255,107,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.35)] active:scale-95"
            >
              <span>Start Printing</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-[#171717] hover:text-[#FF6B00] transition-colors z-50 relative rounded-lg focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#171717]" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 flex flex-col h-[100dvh]"
          >
            <nav className="flex flex-col gap-4 flex-1 pt-4">
              {navLinks.map((link) => {
                const isActive = pathname === '/' && activeSection === link.hash;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-xl font-bold transition-colors py-2 border-b border-[#EAEAEA] flex items-center justify-between ${
                      isActive ? 'text-[#FF6B00]' : 'text-[#171717] hover:text-[#FF6B00]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-5 h-5 text-[#737373]" />
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-3 pb-10">
              <Link
                href="/app/login"
                onClick={(e) => {
                  handleRestrictedAction(e);
                  if (!e.defaultPrevented) setIsMobileMenuOpen(false);
                }}
                className="text-base font-bold text-center text-[#171717] bg-[#F7F7F5] hover:bg-gray-100 border border-[#EAEAEA] transition-colors py-3.5 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/app/login"
                onClick={(e) => {
                  handleRestrictedAction(e);
                  if (!e.defaultPrevented) setIsMobileMenuOpen(false);
                }}
                className="text-base font-bold text-center text-white bg-[#FF6B00] hover:bg-[#e05e00] transition-colors py-3.5 rounded-xl shadow-md"
              >
                Start Printing Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
