export type ServiceType = 'manual' | 'hall_ticket' | 'custom' | 'xerox' | 'certificate' | 'other';

export interface CartItemPrintOptions {
  copies: number;
  color: boolean;
  singleSided: boolean;
  bindingType: 'none' | 'spiral' | 'softbound' | 'hardbound';
  paperSize: 'a4' | 'letter' | 'legal';
  [key: string]: unknown; // Open for future extensions
}

export interface PriceBreakdown {
  base: number;
  printing: number;
  binding: number;
  color: number;
  total: number;
}

export type CartItemStatus = 'in_cart' | 'processing' | 'saved_for_later';

export interface CartItem {
  id: string;
  referenceId?: string;
  serviceType: ServiceType;
  title: string;
  subtitle: string;
  thumbnail?: string;
  quantity: number;
  printOptions: CartItemPrintOptions;
  priceBreakdown: PriceBreakdown;
  estimatedDelivery?: string;
  status: CartItemStatus;
  editable: boolean;
  removable: boolean;
}

export interface DeliveryInfo {
  location: string;
  block: string;
  floor: string;
  classroom: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  summary: CartSummary;
  deliveryInfo?: DeliveryInfo;
}

export type CartStateStatus = 'loading' | 'success' | 'empty' | 'error' | 'offline' | 'retry';
