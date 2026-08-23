'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { SectionContainer, SectionHeading } from './SectionContainer';
import { staggerContainer, fadeInUp } from './animations';

const reviews = [
  {
    name: "Arjun Reddy",
    role: "Computer Science Student",
    image: "https://i.pravatar.cc/150?u=arjun",
    rating: 5,
    text: "BLINTZY saved my life during finals week. I submitted my lab manual PDF from my dorm at 8am and it was delivered to my 9am class just in time!"
  },
  {
    name: "Dr. Kavya Sharma",
    role: "Professor, Engineering",
    image: "https://i.pravatar.cc/150?u=kavya",
    rating: 5,
    text: "We used to deal with constant excuses about print shops being closed. Now, students use BLINTZY and assignments are submitted professionally and on time."
  },
  {
    name: "Ramesh Kumar",
    role: "Campus Print Vendor",
    image: "https://i.pravatar.cc/150?u=ramesh",
    rating: 5,
    text: "Partnering with BLINTZY digitized my entire shop. No more handling cash or dealing with corrupted pen drives. Orders just flow in automatically."
  }
];

export function Testimonials() {
  return (
    <SectionContainer className="bg-gray-50/50">
      <SectionHeading 
        badge="Wall of Love"
        title="Trusted by the Campus." 
        subtitle="Don't just take our word for it. Here is what students, faculty, and partners have to say."
      />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {reviews.map((review, i) => (
          <motion.div 
            key={i}
            variants={fadeInUp}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-6"
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-5 h-5 fill-orange-400 text-orange-400" />
              ))}
            </div>
            
            <p className="text-gray-700 leading-relaxed italic flex-1">
              "{review.text}"
            </p>
            
            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
              <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
              <div>
                <h4 className="font-bold text-gray-900">{review.name}</h4>
                <span className="text-sm text-gray-500">{review.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionContainer>
  );
}
