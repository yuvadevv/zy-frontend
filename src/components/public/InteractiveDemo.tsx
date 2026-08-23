'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Palette, Copy, BookOpen, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SectionContainer, SectionHeading } from './SectionContainer';

export function InteractiveDemo() {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const resetDemo = () => setStep(1);

  return (
    <SectionContainer className="bg-gray-900 text-white relative">
      <SectionHeading 
        badge="Interactive Demo"
        title="Experience It Live" 
        subtitle="Try out the BLINTZY order flow right here. No signup required."
      />

      <div className="max-w-2xl mx-auto bg-white rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden text-gray-900">
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-orange-500' : 'bg-gray-100'}`} />
          ))}
        </div>

        <div className="min-h-[350px] h-auto flex flex-col justify-center pb-4">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <Upload className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Upload Document</h3>
                <p className="text-gray-500 mb-8">Select your PDF file to print.</p>
                <button onClick={nextStep} className="w-full py-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">
                  Select physics-manual.pdf
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Palette className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-6">Select Color Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={nextStep} className="py-6 border-2 border-gray-200 hover:border-orange-500 rounded-2xl font-bold transition-colors">Black & White</button>
                  <button onClick={nextStep} className="py-6 border-2 border-gray-200 hover:border-orange-500 rounded-2xl font-bold transition-colors">Full Color</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Copy className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold mb-6">How many copies?</h3>
                <div className="flex justify-center items-center gap-6">
                  <button onClick={nextStep} className="w-16 h-16 rounded-full bg-gray-100 text-2xl font-bold hover:bg-orange-500 hover:text-white transition-colors">1</button>
                  <button onClick={nextStep} className="w-16 h-16 rounded-full bg-gray-100 text-2xl font-bold hover:bg-orange-500 hover:text-white transition-colors">2</button>
                  <button onClick={nextStep} className="w-16 h-16 rounded-full bg-gray-100 text-2xl font-bold hover:bg-orange-500 hover:text-white transition-colors">5+</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-6">Binding Requirements</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={nextStep} className="py-6 border-2 border-gray-200 hover:border-orange-500 rounded-2xl font-bold transition-colors">Spiral Binding</button>
                  <button onClick={nextStep} className="py-6 border-2 border-gray-200 hover:border-orange-500 rounded-2xl font-bold transition-colors">Stapled (Top Left)</button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-6">Delivery Location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={nextStep} className="py-4 border-2 border-gray-200 hover:border-orange-500 rounded-2xl font-bold transition-colors">A Block, Room A-214</button>
                  <button onClick={nextStep} className="py-4 border-2 border-gray-200 hover:border-orange-500 rounded-2xl font-bold transition-colors">C Block, Lab 2</button>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center pt-2">
                <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-green-500/20 mt-4 sm:mt-0">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Order Summary</h3>
                <p className="text-gray-500 mb-6 text-sm sm:text-base">₹45.00 • physics-manual.pdf • Spiral Bound</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={resetDemo} className="py-4 px-8 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">
                    Restart Demo
                  </button>
                  <Link href="/app/login" className="py-4 px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
                    Start Printing For Real <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </SectionContainer>
  );
}
