import { workerClient } from '@/lib/api/workerClient';

export interface BootstrapConfig {
  maintenance: boolean;
  maintenance_message?: string;
  coming_soon: boolean;
  minimum_version: string;
  latest_version: string;
  force_update: boolean;
  feature_flags: Record<string, boolean>;
  support: string;
  server_time: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export async function fetchBootstrapConfig(): Promise<{ success: boolean; data: BootstrapConfig }> {
  try {
    const rawResponse = await workerClient.getPlatformStatus();
    const response = rawResponse.data || rawResponse;

    const isMaintenance = typeof response.maintenance_mode === 'object' && response.maintenance_mode !== null
      ? Boolean((response.maintenance_mode as any).enabled)
      : Boolean(response.maintenance_mode);

    const isComingSoon = typeof response.coming_soon === 'object' && response.coming_soon !== null
      ? Boolean((response.coming_soon as any).enabled)
      : Boolean(response.coming_soon);

    return {
      success: true,
      data: {
        maintenance: isMaintenance,
        maintenance_message: response.maintenance_message,
        coming_soon: isComingSoon,
        minimum_version: "1.0.0",
        latest_version: "1.0.0",
        force_update: false,
        feature_flags: {},
        support: response.support_email || "",
        server_time: new Date().toISOString(),
        social_links: response.social_links || {}
      }
    };
  } catch (err) {
    console.warn('Failed to fetch platform status (fallback active):', err);
    // Fallback if worker is completely down
    return {
      success: false,
      data: {
        maintenance: true,
        maintenance_message: "Platform is temporarily unavailable.",
        coming_soon: false,
        minimum_version: "1.0.0",
        latest_version: "1.0.0",
        force_update: false,
        feature_flags: {},
        support: "",
        server_time: new Date().toISOString(),
        social_links: {}
      }
    };
  }
}