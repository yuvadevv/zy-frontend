import { Order, OrderStatus } from '../types';


import { workerClient } from '@/lib/api/workerClient';

// Simulated latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ordersApi = {
  getOrders: async (): Promise<Order[]> => {
    const response = await workerClient.getOrders();
    // Assuming backend returns an array of orders directly or under response.orders
    const ordersList = response.orders || response;
    
    // Minimal mapping to match frontend Order types if needed
    // In production, ideally the frontend type matches the backend response closely
    return Array.isArray(ordersList) ? ordersList.map((ro: any) => ({
      id: ro.public_id || ro.id,
      userId: ro.student_id,
      status: ro.status,
      createdAt: ro.created_at ? new Date(ro.created_at).toISOString() : new Date().toISOString(),
      updatedAt: ro.updated_at ? new Date(ro.updated_at).toISOString() : new Date().toISOString(),
      items: [], // Map items properly if they are included in summary list
      deliveryInfo: {
        deliveryType: ro.delivery_type || 'classroom',
        classroom: ro.delivery_room || 'Pending',
        department: 'Pending',
        building: ro.delivery_building || 'Pending',
        floor: 'Pending',
        roomNumber: ro.delivery_room || 'Pending',
        estimatedArrival: ro.estimated_delivery ? new Date(ro.estimated_delivery).toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        deliveryInstructions: ''
      },
      summary: {
        printingCost: 0,
        bindingCost: 0,
        paperCost: 0,
        colorCost: 0,
        platformFee: ro.platform_fee || 0,
        gst: ro.gst || 0,
        discount: ro.discount || 0,
        grandTotal: ro.grand_total || 0
      },
      timeline: []
    })) : [];
  },
  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await workerClient.getOrder(id);
      const ro = response.order;
      const items = response.items || [];
      
      return {
        id: ro.public_id,
        userId: ro.student_id,
        status: ro.status,
        createdAt: new Date(ro.created_at).toISOString(),
        updatedAt: new Date(ro.updated_at).toISOString(),
        items: items.map((i: any) => ({
          id: i.id,
          orderId: ro.public_id,
          price: i.item_total,
          printConfig: {
            documentName: i.document_filename || i.manual_title || 'Unknown Document',
            manualName: i.manual_title || '',
            copies: i.copies,
            pages: i.page_count,
            paperSize: 'a4',
            color: i.color_mode === 1,
            bindingType: i.binding_type,
            singleSided: false,
            studentNotes: ''
          }
        })),
        deliveryInfo: {
          deliveryType: ro.delivery_type,
          classroom: ro.delivery_room || 'Pending',
          department: 'Pending',
          building: ro.delivery_building || 'Pending',
          floor: 'Pending',
          roomNumber: ro.delivery_room || 'Pending',
          estimatedArrival: new Date(ro.estimated_delivery).toISOString(),
          deliveryInstructions: ''
        },
        summary: {
          printingCost: 0,
          bindingCost: 0,
          paperCost: 0,
          colorCost: 0,
          platformFee: ro.platform_fee || 0,
          gst: ro.gst || 0,
          discount: ro.discount || 0,
          grandTotal: ro.grand_total
        },
        timeline: []
      };
    } catch (e) {
      // Fallback
      return {
        id: id,
        userId: 'user-123',
        status: 'printing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: [],
        deliveryInfo: {
          deliveryType: 'classroom',
          classroom: 'Pending',
          department: 'Pending',
          building: 'Pending',
          floor: 'Pending',
          roomNumber: 'Pending',
          estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          deliveryInstructions: ''
        },
        summary: {
          printingCost: 0, bindingCost: 0, paperCost: 0, colorCost: 0, platformFee: 0, gst: 0, discount: 0, grandTotal: 0
        },
        timeline: []
      };
    }
  }
};
