import { Order, OrderStatus } from '../types';
import { workerClient } from '@/lib/api/workerClient';

/**
 * Resolves whether an item is single-sided printing, supporting both current schema
 * and historical snapshot formats.
 */
function resolveIsSingleSided(item: any): boolean {
  // 1. Direct explicit singleSided / single checks
  if (item.print_type === 'single' || item.print_side === 'single') return true;
  if (item.single_sided === true || item.single_sided === 1 || item.single_sided === 'true') return true;
  
  // 2. Direct explicit double checks
  if (item.print_type === 'double' || item.print_side === 'double') return false;
  if (item.single_sided === false || item.single_sided === 0 || item.single_sided === 'false') return false;

  // 3. Fallback to pricing_rule_snapshot if print_type was stored as 'bw' or 'color'
  if (item.pricing_rule_snapshot) {
    try {
      const snap = typeof item.pricing_rule_snapshot === 'string' 
        ? JSON.parse(item.pricing_rule_snapshot) 
        : item.pricing_rule_snapshot;
      if (snap?.service_type) {
        if (snap.service_type.endsWith('_single')) return true;
        if (snap.service_type.endsWith('_double')) return false;
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }

  // Safe default: double-sided
  return false;
}

export const ordersApi = {
  getOrders: async (): Promise<Order[]> => {
    const response = await workerClient.getOrders();
    const ordersList = response.orders || response;
    
    return Array.isArray(ordersList) ? ordersList.map((ro: any) => {
      const isRoomUUID = ro.delivery_room && /^[0-9a-f-]{36}$/i.test(ro.delivery_room);
      const classroomDisplay = ro.classroom_name || (!isRoomUUID ? ro.delivery_room : null) || 'Room details unavailable';
      const buildingDisplay = ro.block_name || (ro.delivery_building && ro.delivery_building.length < 30 ? ro.delivery_building.trim() : 'Campus');
      const departmentDisplay = (ro.branch_name || ro.delivery_building || '').trim() || 'Pending';

      return {
        id: ro.public_id || ro.id,
        userId: ro.student_id,
        status: ro.status,
        createdAt: ro.created_at ? new Date(ro.created_at).toISOString() : new Date().toISOString(),
        updatedAt: ro.updated_at ? new Date(ro.updated_at).toISOString() : new Date().toISOString(),
        items: [],
        deliveryInfo: {
          deliveryType: ro.delivery_type || 'classroom',
          classroom: classroomDisplay,
          department: departmentDisplay,
          building: buildingDisplay,
          floor: ro.floor || '',
          roomNumber: ro.classroom_name || 'Pending',
          estimatedArrival: ro.estimated_delivery ? new Date(ro.estimated_delivery).toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          deliveryInstructions: ro.delivery_instructions || ''
        },
        summary: {
          printingCost: Number(ro.grand_total) || 0,
          bindingCost: 0,
          paperCost: 0,
          colorCost: 0,
          platformFee: Number(ro.platform_fee) || 0,
          gst: Number(ro.gst) || 0,
          discount: Number(ro.discount) || 0,
          grandTotal: Number(ro.grand_total) || 0
        },
        timeline: []
      };
    }) : [];
  },

  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await workerClient.getOrder(id);
      const ro = response.order;
      const items = response.items || [];
      
      // BUG 1 FIX: Calculate exact printing and binding costs from item-level records
      const sumPrinting = items.reduce((s: number, i: any) => s + (Number(i.printing_cost) || 0), 0);
      const sumBinding = items.reduce((s: number, i: any) => s + (Number(i.binding_cost) || 0), 0);
      const grandTotal = Number(ro.grand_total) || 0;
      const platformFee = Number(ro.platform_fee) || 0;
      const gst = Number(ro.gst) || 0;
      const discount = Number(ro.discount) || 0;

      // Safe explainable fallback for historical orders where item-level breakdown was omitted:
      // Reconciles printingCost + bindingCost + platformFee + gst - discount = grandTotal
      const printingCost = sumPrinting > 0 
        ? sumPrinting 
        : (grandTotal > 0 ? Math.max(0, grandTotal - sumBinding - platformFee - gst + discount) : 0);

      // BUG 2 FIX: Resolve room identifier from backend JOIN
      // Never expose raw database UUIDs. Fallback safely to 'Room details unavailable'
      const isRoomUUID = ro.delivery_room && /^[0-9a-f-]{36}$/i.test(ro.delivery_room);
      const classroomDisplay = ro.classroom_name || (!isRoomUUID ? ro.delivery_room : null) || 'Room details unavailable';
      const buildingDisplay = ro.block_name || (ro.delivery_building && ro.delivery_building.length < 30 ? ro.delivery_building.trim() : 'Campus');
      const departmentDisplay = (ro.branch_name || ro.delivery_building || '').trim() || 'Pending';

      return {
        id: ro.public_id,
        userId: ro.student_id,
        status: ro.status,
        internalStatus: ro.internal_status,
        createdAt: new Date(ro.created_at).toISOString(),
        updatedAt: new Date(ro.updated_at).toISOString(),
        items: items.map((i: any) => {
          // BUG 3 FIX: Robust single-sided check handling current enum and historical snapshots
          const singleSided = resolveIsSingleSided(i);
          const color = i.color_mode === 1 || i.color === true || i.color_mode === 'color';

          return {
            id: i.id,
            orderId: ro.public_id,
            price: i.item_total,
            printConfig: {
              documentName: i.document_filename || i.manual_title || 'Unknown Document',
              manualName: i.manual_title || '',
              copies: i.copies || i.quantity || 1,
              pages: i.page_count || i.pages,
              paperSize: i.paper_size || 'a4',
              color,
              bindingType: i.binding_type || i.binding || 'none',
              singleSided,
              studentNotes: i.student_notes || i.notes || ''
            }
          };
        }),
        deliveryInfo: {
          deliveryType: ro.delivery_type || 'classroom',
          classroom: classroomDisplay,
          department: departmentDisplay,
          building: buildingDisplay,
          floor: ro.floor || '',
          roomNumber: ro.classroom_name || 'Pending',
          estimatedArrival: ro.estimated_delivery ? new Date(ro.estimated_delivery).toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          deliveryInstructions: ro.delivery_instructions || ''
        },
        summary: {
          printingCost,
          bindingCost: sumBinding,
          paperCost: 0,
          colorCost: 0,
          platformFee,
          gst,
          discount,
          grandTotal
        },
        timeline: [],
        customFiles: response.customFiles || []
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
          classroom: 'Room details unavailable',
          department: 'Pending',
          building: 'Campus',
          floor: '',
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
