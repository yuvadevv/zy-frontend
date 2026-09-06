import React, { useState } from 'react';
import { useCart } from '../providers/CartProvider';
import { Button } from '@/design-system/components/buttons/Button/Button';
import { X } from 'lucide-react';

export const DeliveryCard = () => {
  const { deliveryDetails, setDeliveryDetails } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [tempDetails, setTempDetails] = useState({ building: '', roomNumber: '' });

  const handleEdit = () => {
    setTempDetails({
      building: deliveryDetails?.building || '',
      roomNumber: deliveryDetails?.roomNumber || ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    setDeliveryDetails(tempDetails);
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex flex-col gap-2.5 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-3">
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-[15px] text-gray-900">Delivery Details</h3>
          <button onClick={handleEdit} className="text-[13px] font-bold text-[#FF6B00] hover:text-orange-600 p-1 -m-1">Edit</button>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-[34px] h-[34px] bg-orange-50 rounded-full flex items-center justify-center text-[#FF6B00] shrink-0 mt-0.5 border border-orange-100/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          
          <div className="flex flex-col">
            <span className="font-bold text-[14px] text-gray-900 leading-tight">College Campus</span>
            <span className="text-[12px] font-medium text-gray-500 mt-0.5">
              {deliveryDetails?.building || 'Main Block'} • Room {deliveryDetails?.roomNumber || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Edit Delivery Details</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Building / Block</label>
                <input
                  type="text"
                  value={tempDetails.building}
                  onChange={(e) => setTempDetails({ ...tempDetails, building: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all"
                  placeholder="e.g. Main Block, ECE Block"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room / Classroom</label>
                <input
                  type="text"
                  value={tempDetails.roomNumber}
                  onChange={(e) => setTempDetails({ ...tempDetails, roomNumber: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all"
                  placeholder="e.g. 101, A203"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-[#FF6B00] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#E56000] transition-colors text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
