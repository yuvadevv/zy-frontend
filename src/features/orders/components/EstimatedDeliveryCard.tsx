import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { DeliveryInformation } from '../types';
import { formatDate, formatTime } from '../utils/formatters';

interface EstimatedDeliveryCardProps {
  deliveryInfo: DeliveryInformation;
}

export const EstimatedDeliveryCard = ({ deliveryInfo }: EstimatedDeliveryCardProps) => {
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
        <div className="flex flex-col text-sm">
          <span className="font-semibold text-foreground capitalize">
            {deliveryInfo.deliveryType} Delivery
          </span>
          <span className="text-muted-foreground leading-snug">
            {deliveryInfo.building}, {deliveryInfo.floor}
          </span>
          {deliveryInfo.classroom && (
            <span className="text-muted-foreground leading-snug">
              Room {deliveryInfo.classroom} ({deliveryInfo.department})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
