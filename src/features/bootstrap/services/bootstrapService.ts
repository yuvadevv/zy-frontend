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
  food_service_enabled: boolean;
  food_service_status: 'active' | 'locked';
  food_service_lock_message?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export async function fetchBootstrapConfig(): Promise<{ success: boolean; data: BootstrapConfig }> {
  const isMainBranch = 
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === 'main' || 
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
    (typeof window !== 'undefined' && (window.location.hostname === 'blintzy.com' || window.location.hostname.endsWith('.blintzy.com')));

  try {
    const rawResponse = await workerClient.getPlatformStatus();
    const response = rawResponse.data || rawResponse;

    const isMaintenance = typeof response.maintenance_mode === 'object' && response.maintenance_mode !== null
      ? Boolean((response.maintenance_mode as any).enabled)
      : Boolean(response.maintenance_mode);

    const isComingSoon = typeof response.coming_soon === 'object' && response.coming_soon !== null
      ? Boolean((response.coming_soon as any).enabled)
      : Boolean(response.coming_soon);

    let foodServiceEnabled: boolean;
    if (response.food_service_enabled !== undefined) {
      foodServiceEnabled = Boolean(response.food_service_enabled);
    } else if (response.service_timings?.food_service_enabled !== undefined) {
      foodServiceEnabled = Boolean(response.service_timings.food_service_enabled);
    } else if (response.service_timings?.food_service_status !== undefined) {
      foodServiceEnabled = response.service_timings.food_service_status === 'active';
    } else {
      // Default: On main/production -> locked by default. On testing/dev -> allowed.
      foodServiceEnabled = !isMainBranch;
    }

    const foodLockMessage = response.food_service_lock_message || 
      response.service_timings?.food_service_lock_message || 
      'Campus Food ordering is launching soon! Please check back later.';

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
        food_service_enabled: foodServiceEnabled,
        food_service_status: foodServiceEnabled ? 'active' : 'locked',
        food_service_lock_message: foodLockMessage,
        social_links: response.social_links || {}
      }
    };
  } catch (err) {
    console.warn('Failed to fetch platform status (fallback active):', err);
    const foodServiceEnabled = !isMainBranch;
    // Fallback if worker is temporarily unreachable (do not falsely lock users out of public pages)
    return {
      success: false,
      data: {
        maintenance: false,
        maintenance_message: "",
        coming_soon: false,
        minimum_version: "1.0.0",
        latest_version: "1.0.0",
        force_update: false,
        feature_flags: {},
        support: "",
        server_time: new Date().toISOString(),
        food_service_enabled: foodServiceEnabled,
        food_service_status: foodServiceEnabled ? 'active' : 'locked',
        food_service_lock_message: 'Campus Food ordering is launching soon! Please check back later.',
        social_links: {}
      }
    };
  }
}