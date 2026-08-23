import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number; // percentage
    isPositive: boolean;
    label?: string; // e.g. "vs last month"
  };
  isLoading?: boolean;
}

export default function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  isLoading
}: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-100 rounded w-40"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 tracking-wide">{label}</h3>
        <div className="w-10 h-10 bg-[#FF6B00]/10 text-[#FF6B00] rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {value || '0'}
        </div>
        
        {trend && (
          <div className="flex items-center text-sm">
            <span className={`flex items-center font-medium ${
              trend.isPositive ? 'text-green-600' : 
              trend.value === 0 ? 'text-gray-500' : 'text-red-600'
            }`}>
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : trend.value === 0 ? (
                <Minus className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-gray-400 ml-2">{trend.label || 'vs previous'}</span>
          </div>
        )}
        {!trend && (
          <div className="h-5"></div> // Maintain vertical spacing
        )}
      </div>
    </div>
  );
}
