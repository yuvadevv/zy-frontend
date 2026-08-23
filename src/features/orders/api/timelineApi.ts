import { TimelineEvent } from '../types';
import { ordersApi } from './ordersApi';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const timelineApi = {
  getTimeline: async (orderId: string): Promise<TimelineEvent[]> => {
    // If the backend supported returning a full timeline of events, we would fetch it here.
    // For now, we fetch the current order status and construct a minimal timeline.
    const order = await ordersApi.getOrderById(orderId);
    
    // In a real application, the backend would return a list of status changes
    // Since the API only returns the current status, we'll map the current status 
    // to a deterministic timeline state to maintain the UI correctly without mock data.
    
    const statuses = ['received', 'printing', 'ready_for_pickup', 'delivered'];
    const currentIdx = statuses.indexOf(order.status);
    
    // For backward compatibility / edge statuses, try to infer the closest core stage
    let effectiveIdx = currentIdx;
    if (effectiveIdx === -1) {
      if (['draft', 'pending'].includes(order.status)) effectiveIdx = -1; // Before received
      else if (['accepted'].includes(order.status)) effectiveIdx = 0; // After received, before printing
      else if (['binding', 'quality_check'].includes(order.status)) effectiveIdx = 1; // After printing, before ready
      else if (['packed'].includes(order.status)) effectiveIdx = 2; // Before ready
      else if (['out_for_delivery'].includes(order.status)) effectiveIdx = 3; // Before delivered
      else if (['cancelled', 'rejected', 'refunded', 'failed', 'on_hold'].includes(order.status)) {
        // Find last valid stage in the timeline
        effectiveIdx = 0; // Just fallback
      }
    }

    const timeline: TimelineEvent[] = statuses.map((s, i) => {
      const isPast = i <= effectiveIdx;
      // Use the order's actual updated timestamp for the current stage, otherwise 'hidden' (don't fabricate)
      const timestamp = (isPast && i === effectiveIdx && order.updatedAt) ? order.updatedAt : (isPast ? 'hidden' : '');
      
      return {
        id: `tl-${i}`,
        eventId: `evt-${orderId}-${i}`,
        status: s as any,
        timestamp,
        description: `Order marked as ${s}`,
        location: 'Store',
        title: `Order ${s.replace(/_/g, ' ')}`,
        updatedBy: 'System',
        isCurrentStage: i === effectiveIdx
      };
    });

    return timeline;
  }
};
