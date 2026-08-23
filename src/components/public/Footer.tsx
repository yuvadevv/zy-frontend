import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-xl shadow-sm">
                B
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Blintzy</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6">
              Campus printing, delivered smarter. We connect students, faculty, and vendors into one seamless digital ecosystem.
            </p>
            <p className="text-sm">support@blintzy.com</p>
            <p className="text-sm mt-1">+91 (800) 123-4567</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#features" className="hover:text-orange-500 transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-orange-500 transition-colors">How it Works</Link></li>
              <li><Link href="/app/login" className="hover:text-orange-500 transition-colors">Student Login</Link></li>
              <li><Link href="/app/login" className="hover:text-orange-500 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#why-blintzy" className="hover:text-orange-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
              <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Print Partners</Link></li>
              <li><Link href="/contact" className="hover:text-orange-500 transition-colors">For Colleges</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/#faq" className="hover:text-orange-500 transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800 text-sm">
          <p>© {new Date().getFullYear()} Blintzy Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
          </div>
          <span className="mt-4 md:mt-0 opacity-50">Version 1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
