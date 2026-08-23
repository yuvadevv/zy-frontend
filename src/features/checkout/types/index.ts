// src/features/checkout/types/index.ts

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  EXPIRED = 'EXPIRED',
}

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  ACCEPTED = 'ACCEPTED',
  PRINTING = 'PRINTING',
  BINDING = 'BINDING',
  QUALITY_CHECK = 'QUALITY_CHECK',
  PACKED = 'PACKED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  REFUNDED = 'REFUNDED',
  ON_HOLD = 'ON_HOLD',
}

export enum DeliveryMode {
  CLASSROOM = 'CLASSROOM',
  DEPARTMENT_OFFICE = 'DEPARTMENT_OFFICE',
  PRINT_SHOP = 'PRINT_SHOP',
  HOSTEL = 'HOSTEL',
  CAMPUS_LOCKER = 'CAMPUS_LOCKER',
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'UPI' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'NET_BANKING' | 'COD' | 'WALLET';
  iconUrl?: string;
  isAvailable: boolean;
  unavailableReason?: string;
}

export interface Coupon {
  code: string;
  type: 'FLAT' | 'PERCENTAGE' | 'WALLET' | 'FIRST_ORDER';
  value: number;
  maxDiscount?: number;
  description: string;
}

export interface DeliveryDetails {
  mode: DeliveryMode;
  locationId?: string; // e.g. branch/room id
  locationName: string; // e.g. "Room 302, CSE Dept"
  contactNumber?: string;
  estimatedTime?: string;
}

export interface CheckoutState {
  deliveryDetails: DeliveryDetails | null;
  paymentMethodId: string | null;
  couponCode: string | null;
  studentNotes: string;
  termsAccepted: boolean;
}

export interface PlaceOrderRequest {
  cartId: string;
  cartItems: any[];
  checkoutState: CheckoutState;
  idempotencyKey: string;
}

export interface CheckoutResponse {
  success: boolean;
  orderId?: string; // e.g. BLT-2026-000001
  trackingId?: string;
  estimatedDelivery?: string;
  paymentStatus?: PaymentStatus;
  paymentIntent?: string;
  paymentUrl?: string;
  errorCode?: string;
  errorMessage?: string;
}
