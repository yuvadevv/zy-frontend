import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { DeliveryInformation } from '../types';
import { formatDate, formatTime } from '../utils/formatters';

interface EstimatedDeliveryCardProps {
  deliveryInfo: DeliveryInformation;
  orderStatus?: string;
}

export const EstimatedDeliveryCard = ({ deliveryInfo, orderStatus }: EstimatedDeliveryCardProps) => {
  const isRoomUnavailable = !deliveryInfo.classroom || 
    deliveryInfo.classroom === 'Room details unavailable' || 
    /^[0-9a-f-]{36}$/i.test(deliveryInfo.classroom);
  
  const displayRoom = isRoomUnavailable ? 'Room details unavailable' : deliveryInfo.classroom;

  const formattedStatus = orderStatus 
    ? orderStatus.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) 
    : null;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <h3 className="font-bold text-foreground flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Estimated Delivery
      </h3>
      
      <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-xl p-4 border border-border/50">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium uppercase">Date</span>
          <span className="font-bold text-foreground text-sm">
            {deliveryInfo.estimatedArrival ? formatDate(deliveryInfo.estimatedArrival) : 'TBD'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium uppercase">Time</span>
          <span className="font-bold text-primary text-sm">
            {deliveryInfo.estimatedArrival ? formatTime(deliveryInfo.estimatedArrival) : 'TBD'}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3 mt-2">
        <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col text-sm space-y-0.5">
          <span className="font-semibold text-foreground capitalize">
            {deliveryInfo.deliveryType || 'Classroom'} Delivery
          </span>

          {deliveryInfo.department && deliveryInfo.department !== 'Pending' && (
            <span className="text-foreground font-medium text-xs leading-snug">
              {deliveryInfo.department}
            </span>
          )}

          {deliveryInfo.building && deliveryInfo.building !== 'Pending' && (
            <span className="text-muted-foreground text-xs leading-snug">
              {deliveryInfo.building}{deliveryInfo.floor && deliveryInfo.floor !== 'Pending' ? `, ${deliveryInfo.floor}` : ''}
            </span>
          )}

          <span className={`text-xs leading-snug ${isRoomUnavailable ? 'text-muted-foreground italic' : 'text-foreground font-medium'}`}>
            {isRoomUnavailable ? 'Room details unavailable' : `Room ${displayRoom}`}
          </span>

          {formattedStatus && (
            <span className="text-xs text-muted-foreground pt-1 flex items-center gap-1.5">
              <span>Status:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary capitalize">
                {formattedStatus}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
