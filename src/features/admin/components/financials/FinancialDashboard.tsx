'use client';

import React, { useState } from 'react';
import VendorPricingConfig from './VendorPricingConfig';
import EarningsSummary from './EarningsSummary';

export default function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState<'pricing' | 'earnings'>('earnings');

  // Trigger TS update
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financials & Vendor Margins</h1>
          <p className="text-gray-500 mt-1">Manage vendor costs and view platform revenue</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('earnings')}
              className={`w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'earnings'
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Earnings & Revenue Reports
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pricing'
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vendor Pricing Rules
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'earnings' ? <EarningsSummary /> : <VendorPricingConfig />}
        </div>
      </div>
    </div>
  );
}
