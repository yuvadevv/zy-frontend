'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Info, Users, Goal, Compass } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full h-full bg-white min-h-[100dvh]">
      <div className="flex items-center p-4 border-b border-gray-100 sticky top-0 bg-white z-10 gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-black transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-black">About BLINTZY</h2>
      </div>

      <div className="flex-1 p-6 overflow-y-auto pb-32">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
            <Info className="w-10 h-10 text-orange-500" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-black mb-2">Welcome to BLINTZY</h3>
          <p className="text-gray-500">Your Campus Service Companion</p>
        </div>

        <div className="space-y-8">
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Goal className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-black mb-1">Our Purpose</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                BLINTZY is built to streamline campus-life essentials. From printing and binding to future services, our goal is to save students time and effort so they can focus on their education.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-black mb-1">Campus Focus</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Designed specifically for Ramachandra College of Engineering and tailored to real student needs, BLINTZY acts as a bridge between campus service providers and students.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-teal-500" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-black mb-1">Our Vision</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                We envision a completely digital, hassle-free campus ecosystem where ordering any service is just a few taps away.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} BLINTZY. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
