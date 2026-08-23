// src/features/checkout/services/mockCheckout.ts

import { PaymentMethod, DeliveryMode, DeliveryDetails } from '../types';

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm_upi_1',
    name: 'UPI (GPay, PhonePe, Paytm)',
    type: 'UPI',
    isAvailable: true,
  },
  {
    id: 'pm_card_1',
    name: 'Credit / Debit Card',
    type: 'CREDIT_CARD',
    isAvailable: true,
  },
  {
    id: 'pm_netbank_1',
    name: 'Net Banking',
    type: 'NET_BANKING',
    isAvailable: true,
  },
  {
    id: 'pm_cod_1',
    name: 'Cash on Delivery',
    type: 'COD',
    isAvailable: false,
    unavailableReason: 'COD is disabled for custom printing',
  }
];

export const MOCK_DELIVERY_MODES: DeliveryDetails[] = [
  {
    mode: DeliveryMode.CLASSROOM,
    locationId: 'room_302',
    locationName: 'Classroom Delivery (Room 302)',
    estimatedTime: 'Today, 4:00 PM'
  },
  {
    mode: DeliveryMode.DEPARTMENT_OFFICE,
    locationId: 'dept_cse',
    locationName: 'Pickup from CSE Department Office',
    estimatedTime: 'Today, 3:30 PM'
  }
];
