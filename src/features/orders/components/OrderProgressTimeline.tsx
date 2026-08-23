import React from 'react';
import { TimelineEvent } from '../types';
import { motion } from 'framer-motion';
import { Check, CircleDot, Circle } from 'lucide-react';
import { formatTime } from '../utils/formatters';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface OrderProgressTimelineProps {
  timeline: TimelineEvent[];
}

export const OrderProgressTimeline = ({ timeline }: OrderProgressTimelineProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-foreground mb-6">Tracking Details</h3>
      <div className="flex flex-col relative">
        {timeline.map((event, index) => {
          const isLast = index === timeline.length - 1;
          const isCompleted = event.timestamp !== '';
          const isCurrent = event.isCurrentStage;
          const isFuture = !isCompleted && !isCurrent;

          return (
            <div key={event.eventId} className="flex relative pb-8 last:pb-0 group">
              {/* Vertical Line */}
              {!isLast && (
                <div 
                  className={twMerge(
                    "absolute left-4 top-8 bottom-0 w-[2px] -ml-[1px]",
                    isCompleted ? "bg-primary" : "bg-border"
                  )} 
                />
              )}

              {/* Icon / Indicator */}
              <div className="relative shrink-0 w-8 h-8 flex items-center justify-center bg-background rounded-full z-10 mr-4">
                {isCompleted && !isCurrent ? (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : isCurrent ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
                    className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary"
                  >
                    <CircleDot className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center text-muted-foreground">
                    <Circle className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={twMerge(
                "flex flex-col flex-1 pt-1",
                isFuture ? "opacity-50" : "opacity-100"
              )}>
                <div className="flex justify-between items-start">
                  <h4 className={twMerge(
                    "text-sm font-bold",
                    isCurrent ? "text-primary" : "text-foreground"
                  )}>
                    {event.title}
                  </h4>
                  {event.timestamp && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {formatTime(event.timestamp)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed pr-8">
                  {event.description}
                </p>
                {event.estimatedCompletion && isCurrent && (
                  <div className="mt-2 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded w-max">
                    Est. Completion: {formatTime(event.estimatedCompletion)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
