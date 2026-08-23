import { TrackingStatus, TimelineEvent } from '../types';
import { trackingApi } from '../api/trackingApi';
import { timelineApi } from '../api/timelineApi';

export const trackingService = {
  getTrackingStatus: async (orderId: string): Promise<TrackingStatus> => {
    return await trackingApi.getTrackingStatus(orderId);
  },

  getTimeline: async (orderId: string): Promise<TimelineEvent[]> => {
    return await timelineApi.getTimeline(orderId);
  }
};
