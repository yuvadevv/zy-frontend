export type DietaryType = 'veg' | 'non-veg' | 'egg';

export interface FoodVendor {
  id: string;
  name: string;
  shortName: string;
  counterLocation: string;
  badgeText: string;
  pickupInstructions: string;
}

export interface FoodCategory {
  id: string;
  label: string;
  image: string;
  iconName?: string;
}

export interface CustomizationOption {
  label: string;
  extraPrice: number;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  required?: boolean;
  options: CustomizationOption[];
}

export interface FoodProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  vendorId: string;
  vendorName: string;
  counterLocation: string;
  dietary: DietaryType;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  isMeal?: boolean;
  customizationGroups?: CustomizationGroup[];
}

export interface FoodCartItem {
  id: string; // unique cart item key (e.g., productId + customizations)
  productId: string;
  product: FoodProduct;
  quantity: number;
  selectedOptions?: Record<string, CustomizationOption>;
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

export type FoodPaymentMethod = 'ONLINE_UPI' | 'CASH_AT_COUNTER';

export type FoodOrderStatus = 
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'collected'
  | 'cancelled'
  | 'payment_pending'
  | 'PLACED' 
  | 'PREPARING' 
  | 'READY_FOR_PICKUP' 
  | 'COMPLETED';

export interface FoodOrderItemSnapshot {
  id?: string;
  productId?: string;
  product_id?: string;
  name?: string;
  product_name?: string;
  categoryId?: string;
  category_id?: string;
  dietary?: DietaryType;
  unitPrice?: number;
  unit_price?: number;
  quantity: number;
  itemTotal?: number;
  item_total?: number;
  cookingNotes?: string | null;
  cooking_notes?: string | null;
}

export interface FoodOrder {
  id?: string;
  orderId?: string;
  orderNumber?: string;
  order_number?: string;
  tokenNumber: string;
  token_number?: string;
  studentId?: string;
  student_id?: string;
  studentName?: string;
  student_phone?: string;
  studentPhone?: string;
  vendorId: string;
  vendor_id?: string;
  vendorName: string;
  vendor_name?: string;
  counterLocation: string;
  counter_location?: string;
  items: FoodCartItem[] | FoodOrderItemSnapshot[];
  subtotal: number;
  platformFee?: number;
  platform_fee?: number;
  tax?: number;
  grandTotal: number;
  grand_total?: number;
  paymentMethod: FoodPaymentMethod;
  payment_method?: FoodPaymentMethod;
  paymentStatus: 'PAID' | 'PENDING' | 'PENDING_AT_COUNTER' | 'paid' | 'pending' | 'failed';
  payment_status?: string;
  orderStatus?: FoodOrderStatus;
  order_status?: string;
  status?: FoodOrderStatus;
  pickupOtp?: string;
  pickup_otp?: string;
  pickupQrSecret?: string;
  pickup_qr_secret?: string;
  createdAt: number;
  created_at?: number;
  collectedAt?: number;
  collected_at?: number;
  estimatedPickupMinutes?: number;
}
