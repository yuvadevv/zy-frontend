import { Order } from '../types';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2236-3159',
    userId: 'user-123',
    status: 'printing',
    createdAt: '2026-07-29T10:00:00.000Z',
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    items: [
      {
        id: 'item-1',
        orderId: 'ORD-2236-3159',
        printConfig: {
          documentName: 'Computer Networks Lab Manual',
          manualName: 'CS-401 CN Lab',
          copies: 1,
          pages: 100,
          paperSize: 'a4',
          color: false,
          bindingType: 'spiral',
          singleSided: false,
          studentNotes: 'Please make sure binding is strong'
        },
        price: 180
      }
    ],
    deliveryInfo: {
      deliveryType: 'classroom',
      classroom: 'CS-302',
      department: 'Computer Science',
      building: 'Block A',
      floor: '3rd Floor',
      roomNumber: '302',
      estimatedArrival: new Date(Date.now() + 7200000).toISOString(),
      deliveryInstructions: 'Call me when you reach the building'
    },
    summary: {
      printingCost: 100,
      bindingCost: 35,
      paperCost: 0,
      colorCost: 0,
      platformFee: 10,
      gst: 35,
      discount: 0,
      grandTotal: 180
    },
    timeline: [
      {
        eventId: 'evt-1',
        status: 'received',
        title: 'Order Received',
        description: 'We have received your order.',
        timestamp: '2026-07-29T10:00:00.000Z',
        updatedBy: 'system',
        isCurrentStage: false
      },
      {
        eventId: 'evt-2',
        status: 'accepted',
        title: 'Order Accepted',
        description: 'Vendor has accepted the order and will start processing soon.',
        timestamp: '2026-07-29T10:30:00.000Z',
        updatedBy: 'vendor',
        isCurrentStage: false
      },
      {
        eventId: 'evt-3',
        status: 'printing',
        title: 'Printing in Progress',
        description: 'Your document is currently being printed.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        updatedBy: 'vendor',
        isCurrentStage: true,
        estimatedCompletion: new Date(Date.now() + 1800000).toISOString()
      },
      {
        eventId: 'evt-4',
        status: 'binding',
        title: 'Binding',
        description: 'Your document will be bound next.',
        timestamp: '',
        updatedBy: 'system',
        isCurrentStage: false
      },
      {
        eventId: 'evt-5',
        status: 'quality_check',
        title: 'Quality Check',
        description: 'Checking for any print errors.',
        timestamp: '',
        updatedBy: 'system',
        isCurrentStage: false
      },
      {
        eventId: 'evt-6',
        status: 'packed',
        title: 'Packed & Ready',
        description: 'Your order is packed and ready for delivery.',
        timestamp: '',
        updatedBy: 'system',
        isCurrentStage: false
      },
      {
        eventId: 'evt-7',
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Delivery executive is on the way.',
        timestamp: '',
        updatedBy: 'system',
        isCurrentStage: false
      },
      {
        eventId: 'evt-8',
        status: 'delivered',
        title: 'Delivered',
        description: 'Enjoy your prints!',
        timestamp: '',
        updatedBy: 'system',
        isCurrentStage: false
      }
    ]
  }
];
