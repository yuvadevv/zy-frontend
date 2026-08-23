import { workerClient } from '@/lib/api/workerClient';

export interface BootstrapConfig {
  maintenance: boolean;
  maintenance_message?: string;
  minimum_version: string;
  latest_version: string;
  force_update: boolean;
  feature_flags: Record<string, boolean>;
  support: string;
  server_time: string;
}

export async function fetchBootstrapConfig(): Promise<{ success: boolean; data: BootstrapConfig }> {
  try {
    const response = await workerClient.getPlatformStatus();
    const isMaintenance = typeof response.maintenance_mode === 'object' && response.maintenance_mode !== null
      ? Boolean((response.maintenance_mode as any).enabled)
      : Boolean(response.maintenance_mode);

    return {
      success: true,
      data: {
        maintenance: isMaintenance,
        maintenance_message: response.maintenance_message,
        minimum_version: "1.0.0",
        latest_version: "1.0.0",
        force_update: false,
        feature_flags: {},
        support: response.support_email || "",
        server_time: new Date().toISOString()
      }
    };
  } catch (err) {
    console.error('Failed to fetch platform status:', err);
    // Fallback if worker is completely down
    return {
      success: false,
      data: {
        maintenance: true,
        maintenance_message: "Platform is temporarily unavailable.",
        minimum_version: "1.0.0",
        latest_version: "1.0.0",
        force_update: false,
        feature_flags: {},
        support: "",
        server_time: new Date().toISOString()
      }
    };
  }
}