import React from 'react';

type SemanticStatus = 
  | 'success' // Delivered, Paid, Active
  | 'warning' // Pending, Quality Check, Review
  | 'danger' // Cancelled, Failed, Suspended
  | 'info' // Printing, Binding, Processing
  | 'neutral'; // Draft, Inactive, Unknown

interface StatusBadgeProps {
  status: string;
  variant?: SemanticStatus;
}

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  // Auto-detect variant if not provided
  let currentVariant: SemanticStatus = variant || 'neutral';
  
  if (!variant) {
    const normalized = status.toLowerCase();
    
    // Success matches
    if (['delivered', 'paid', 'active', 'ready', 'completed', 'success'].some(s => normalized.includes(s))) {
      currentVariant = 'success';
    } 
    // Warning matches
    else if (['pending', 'quality check', 'review', 'hold'].some(s => normalized.includes(s))) {
      currentVariant = 'warning';
    }
    // Danger matches
    else if (['cancelled', 'failed', 'suspended', 'error', 'rejected'].some(s => normalized.includes(s))) {
      currentVariant = 'danger';
    }
    // Info matches
    else if (['printing', 'binding', 'processing', 'out for delivery', 'in progress'].some(s => normalized.includes(s))) {
      currentVariant = 'info';
    }
  }

  const variantStyles: Record<SemanticStatus, string> = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[currentVariant]}`}>
      {status}
    </span>
  );
}
