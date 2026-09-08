import { Metadata } from 'next';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Building2, Printer, Briefcase, Mail, HelpCircle, ArrowRight } from 'lucide-react';
import { DynamicSupportEmail } from './DynamicSupportEmail';
import { getPublicPlatformStatus } from '@/lib/api/server/platform';

export const metadata: Metadata = {
  title: 'Contact | BLINTZY Campus Printing',
  description: 'Get in touch with BLINTZY for business inquiries, print partnerships, and college integrations.',
};

export default async function ContactPage() {
  const status = await getPublicPlatformStatus();
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-4 block">Get in Touch</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Let's build the future of campus logistics.</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Whether you're a print vendor wanting to digitize, a college looking for a smart campus solution, or a student needing help.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {/* General Support */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:border-orange-200 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:text-orange-500 transition-colors">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">General Support</h3>
              <p className="text-gray-600 mb-6">Need help with an order or your account?</p>
              <DynamicSupportEmail />
            </div>

            {/* Media */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:border-orange-200 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:text-orange-500 transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Media Inquiry</h3>
              <p className="text-gray-600 mb-6">Press, media, and brand assets.</p>
              <a href="mailto:press@blintzy.com" className="font-bold text-orange-500 flex items-center gap-1 hover:gap-2 transition-all">
                press@blintzy.com <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Business */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:border-orange-200 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:text-orange-500 transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business</h3>
              <p className="text-gray-600 mb-6">Investment and corporate inquiries.</p>
              <a href="mailto:business@blintzy.com" className="font-bold text-orange-500 flex items-center gap-1 hover:gap-2 transition-all">
                business@blintzy.com <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <hr className="border-gray-100 mb-24" />

          {/* Become a Print Partner */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24 bg-orange-50 p-8 md:p-12 rounded-[3rem] border border-orange-100">
            <div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-orange-500">
                <Printer className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Become a Print Partner</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Transform your campus print shop into a fully digital fulfillment center. Receive orders instantly, track revenue, and never deal with cash or USB drives again.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700 font-medium">✓ Zero upfront software cost</li>
                <li className="flex items-center gap-2 text-gray-700 font-medium">✓ Dedicated Vendor Dashboard</li>
                <li className="flex items-center gap-2 text-gray-700 font-medium">✓ Weekly automated payouts</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Partner Application</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Name</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" placeholder="e.g. Campus Xerox" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">College/Location</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" placeholder="e.g. SRM University" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                  <input type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" placeholder="+91" />
                </div>
                <button type="button" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl mt-4 transition-colors">
                  Apply Now
                </button>
              </form>
            </div>
          </div>

          {/* For Colleges */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-gray-900 p-8 md:p-12 rounded-[3rem] text-white">
              <h3 className="text-xl font-bold mb-6">Request Integration</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Institution Name</label>
                  <input type="text" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Official Email</label>
                  <input type="email" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" />
                </div>
                <button type="button" className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 rounded-xl mt-4 transition-colors">
                  Contact Sales
                </button>
              </form>
            </div>
            <div className="order-1 md:order-2">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 text-gray-900">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">For Colleges & Universities</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Bring BLINTZY to your campus. Reduce administrative overhead, eliminate long queues outside campus shops, and provide a premium digital amenity for your students.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700 font-medium">✓ Custom SSO Integration</li>
                <li className="flex items-center gap-2 text-gray-700 font-medium">✓ Centralized department billing</li>
                <li className="flex items-center gap-2 text-gray-700 font-medium">✓ Detailed campus analytics</li>
              </ul>
            </div>
          </div>

        </div>
      </main>
      
      <Footer socialLinks={status?.social_links} />
    </div>
  );
}
