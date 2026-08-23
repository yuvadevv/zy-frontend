export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'received'
  | 'accepted'
  | 'printing'
  | 'binding'
  | 'quality_check'
  | 'packed'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'rejected'
  | 'refunded'
  | 'failed'
  | 'on_hold';

export interface PrintConfiguration {
  documentName?: string;
  manualName?: string;
  copies: number;
  pages: number;
  paperSize: string;
  color: boolean;
  bindingType: string;
  singleSided: boolean;
  studentNotes?: string;
  uploadedFileUrl?: string;
}

export interface DeliveryInformation {
  deliveryType: 'classroom' | 'pickup' | 'hostel';
  classroom?: string;
  department?: string;
  building?: string;
  floor?: string;
  roomNumber?: string;
  estimatedArrival?: string;
  deliveryInstructions?: string;
  // Future fields
  deliveryExecutiveName?: string;
  deliveryExecutivePhone?: string;
  liveGpsUrl?: string;
}

export interface OrderSummary {
  printingCost: number;
  bindingCost: number;
  paperCost: number;
  colorCost: number;
  platformFee: number;
  gst: number;
  discount: number;
  couponAmount?: number;
  walletUsed?: number;
  grandTotal: number;
}

export interface SupportInformation {
  phone: string;
  whatsapp: string;
  email: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  printConfig: PrintConfiguration;
  price: number;
}

export interface TimelineEvent {
  eventId: string;
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  updatedBy: string;
  estimatedCompletion?: string;
  isCurrentStage: boolean;
  // Future
  vendorNotes?: string;
  adminNotes?: string;
  images?: string[];
  attachments?: string[];
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  deliveryInfo: DeliveryInformation;
  summary: OrderSummary;
  timeline: TimelineEvent[];
}

export interface TrackingStatus {
  orderId: string;
  currentStatus: OrderStatus;
  estimatedDeliveryDate: string;
  lastUpdated: string;
}
