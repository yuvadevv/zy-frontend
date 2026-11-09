import React from 'react';
import Link from 'next/link';
import { SocialLinks } from '@/lib/api/server/platform';
import { validateSocialUrl } from '@/utils/socialValidation';

type FooterProps = {
  socialLinks?: SocialLinks;
  contactData?: { email?: string; phone?: string } | null;
  termsUrl?: string | null;
  privacyUrl?: string | null;
};

export function Footer({
  socialLinks = {},
  contactData = null,
  termsUrl,
  privacyUrl,
}: FooterProps) {
  const validTwitter = validateSocialUrl(socialLinks?.twitter, 'twitter');
  const validLinkedin = validateSocialUrl(socialLinks?.linkedin, 'linkedin');
  const validInstagram = validateSocialUrl(socialLinks?.instagram, 'instagram');

  const email = contactData?.email || 'support@blintzy.com';
  const phone = contactData?.phone || '+91 98765 43210';

  return (
    <footer className="bg-[#F7F7F5] text-[#737373] py-16 border-t border-[#EAEAEA]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-14">
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF6B00] text-white font-black text-lg shadow-sm transition-transform group-hover:scale-105">
                B
              </div>
              <span className="text-xl font-black tracking-tight text-[#171717] group-hover:text-[#FF6B00] transition-colors">
                BLINTZY
              </span>
            </Link>
            <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider mb-2">
              Your Campus. One Platform.
            </p>
            <p className="text-xs leading-relaxed max-w-xs mb-5 text-[#737373]">
              From academic printing to everyday campus services, BLINTZY is making college life simpler, smarter, and more connected.
            </p>
            <div className="text-xs space-y-1 text-[#171717] font-medium">
              <p>Support: <span className="text-[#737373]">{email}</span></p>
              <p>Campus Desk: <span className="text-[#737373]">{phone}</span></p>
            </div>
          </div>

          {/* Campus Services */}
          <div>
            <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-4">
              Campus Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/app/login" className="hover:text-[#FF6B00] transition-colors font-medium flex items-center gap-1.5">
                  <span>Print & Documents</span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.2 rounded">Live</span>
                </Link>
              </li>
              <li>
                <span className="text-[#A3A3A3] flex items-center gap-1.5 cursor-not-allowed">
                  <span>Campus Food</span>
                  <span className="text-[9px] bg-amber-50 text-amber-600 font-bold px-1.5 py-0.2 rounded">Soon</span>
                </span>
              </li>
              <li>
                <span className="text-[#A3A3A3] flex items-center gap-1.5 cursor-not-allowed">
                  <span>College Bus Tracking</span>
                  <span className="text-[9px] bg-sky-50 text-sky-600 font-bold px-1.5 py-0.2 rounded">Soon</span>
                </span>
              </li>
              <li>
                <span className="text-[#A3A3A3]">Campus Event Passes</span>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#product" className="hover:text-[#FF6B00] transition-colors">
                  Product Workflow
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#FF6B00] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#why-blintzy" className="hover:text-[#FF6B00] transition-colors">
                  Comparison Matrix
                </Link>
              </li>
              <li>
                <Link href="/#ecosystem" className="hover:text-[#FF6B00] transition-colors">
                  Campus Ecosystem
                </Link>
              </li>
              <li>
                <Link href="/app/login" className="hover:text-[#FF6B00] transition-colors font-medium">
                  Student Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Company */}
          <div>
            <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#about" className="hover:text-[#FF6B00] transition-colors">
                  About BLINTZY
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF6B00] transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF6B00] transition-colors">
                  Print Partner Network
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF6B00] transition-colors">
                  Launch on Your Campus
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                {termsUrl ? (
                  <a
                    href={termsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF6B00] transition-colors"
                  >
                    Terms of Service
                  </a>
                ) : (
                  <Link href="/terms" className="hover:text-[#FF6B00] transition-colors">
                    Terms of Service
                  </Link>
                )}
              </li>
              <li>
                {privacyUrl ? (
                  <a
                    href={privacyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF6B00] transition-colors"
                  >
                    Privacy Policy
                  </a>
                ) : (
                  <Link href="/privacy" className="hover:text-[#FF6B00] transition-colors">
                    Privacy Policy
                  </Link>
                )}
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#FF6B00] transition-colors">
                  Student FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#EAEAEA] text-xs">
          <p className="text-[#737373]">
            © {new Date().getFullYear()} BLINTZY Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5 mt-4 md:mt-0 text-[#737373]">
            {validTwitter && (
              <a
                href={validTwitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#171717] transition-colors"
              >
                Twitter
              </a>
            )}
            {validLinkedin && (
              <a
                href={validLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#171717] transition-colors"
              >
                LinkedIn
              </a>
            )}
            {validInstagram && (
              <a
                href={validInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#171717] transition-colors"
              >
                Instagram
              </a>
            )}
            <span className="text-[#A3A3A3]">•</span>
            <span className="text-[#737373]">Crafted for Indian Campuses</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
