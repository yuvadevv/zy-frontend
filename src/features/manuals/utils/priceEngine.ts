import { PrintConfig } from '../types';

export interface PriceBreakdown {
  basePrice: number;
  printingCost: number;
  bindingCost: number;
  deliveryCharge: number;
  total: number;
}

export const calculateManualPrice = (basePrice: number, pages: number, config: PrintConfig): PriceBreakdown => {
  // Printing Cost Calculation
  let costPerPage = 1.0; // Base cost for A4 B&W

  if (config.paperSize === 'letter') costPerPage += 0.5;
  if (config.color) costPerPage += 4.0;
  
  // Double sided uses fewer physical pages, so material cost is less.
  const totalPages = config.singleSided ? pages : Math.ceil(pages / 2);
  const printingCost = totalPages * costPerPage * config.copies;
  
  // Binding costs
  let bindingCost = 0;
  if (config.bindingType === 'spiral') {
    bindingCost = 30 * config.copies;
  }
  
  const deliveryCharge = 0; // FREE
  const totalBasePrice = basePrice * config.copies;
  
  return {
    basePrice: totalBasePrice,
    printingCost: Math.ceil(printingCost),
    bindingCost,
    deliveryCharge,
    total: totalBasePrice + Math.ceil(printingCost) + bindingCost + deliveryCharge,
  };
};

export const getEstimatedDelivery = (orderDate: Date = new Date()): string => {
  const deliveryDate = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000);
  const isTomorrow = deliveryDate.getDate() !== orderDate.getDate();
  const timeString = deliveryDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  return `${isTomorrow ? 'Tomorrow' : 'Today'} • ${timeString}`;
};
