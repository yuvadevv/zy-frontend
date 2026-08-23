'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/', hash: '' },
  { name: 'Features', href: '/#features', hash: 'features' },
  { name: 'How It Works', href: '/#how-it-works', hash: 'how-it-works' },
  { name: 'Why BLINTZY', href: '/#why-blintzy', hash: 'why-blintzy' },
  { name: 'FAQ', href: '/#faq', hash: 'faq' },
  { name: 'Contact', href: '/contact', hash: '' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
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
      .map(link => link.hash ? document.getElementById(link.hash) : null)
      .filter(Boolean) as HTMLElement[];

    const visibleSections = new Set<string>();

    const observerCallback: IntersectionObserverCallback = (entries) => {
      let changed = false;
      entries.forEach(entry => {
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
        // Find the first visible section in DOM order
        const active = sectionElements.find(el => visibleSections.has(el.id));
        if (active) {
          setActiveSection(active.id);
        }
      }
    };

    const observerOptions = {
      root: null,
      // Focus on the top half of the screen, just below the header
      rootMargin: '-100px 0px -40% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionElements.forEach(el => observer.observe(el));

    // Handle 'Home' special case when scrolled to top
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
        className="fixed top-0 left-0 right-0 h-[3px] bg-orange-500 origin-left z-[60]"
        style={{ scaleX }}
      />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-gray-100 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50 relative group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-xl shadow-sm transition-transform group-hover:scale-105">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-orange-500">Blintzy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isContact = link.href === '/contact';
              const isCurrentPage = pathname === link.href;
              const isHashActive = activeSection === link.hash;
              
              const isActive = isContact ? isCurrentPage : (pathname === '/' && isHashActive);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative group text-sm transition-colors py-2"
                >
                  <span className={`transition-all duration-200 ${isActive ? 'text-orange-600 font-bold' : 'text-gray-600 font-medium group-hover:text-gray-900'}`}>
                    {link.name}
                  </span>
                  {/* Underline indicator */}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-[2px] bg-orange-500 rounded-full transition-all duration-300 ease-out ${
                      isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-hover:bg-gray-300'
                    }`} 
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/app/login"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/app/login"
              className="text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-all px-5 py-2.5 rounded-full shadow-sm hover:shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:-translate-y-[1px] active:scale-95"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors z-50 relative rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 flex flex-col h-[100dvh]"
          >
            <nav className="flex flex-col gap-6 flex-1">
              {navLinks.map((link) => {
                const isContact = link.href === '/contact';
                const isCurrentPage = pathname === link.href;
                const isHashActive = activeSection === link.hash;
                const isActive = isContact ? isCurrentPage : (pathname === '/' && isHashActive);
                
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-2xl font-bold transition-colors ${
                      isActive ? 'text-orange-600' : 'text-gray-900 hover:text-orange-500'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-4 pb-12">
              <Link
                href="/app/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-semibold text-center text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors py-4 rounded-2xl"
              >
                Login
              </Link>
              <Link
                href="/app/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-semibold text-center text-white bg-orange-500 hover:bg-orange-600 transition-colors py-4 rounded-2xl shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
