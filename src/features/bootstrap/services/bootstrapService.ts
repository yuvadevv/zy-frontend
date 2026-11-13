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
  food_service_main_locked: boolean;
  food_service_testing_allowed: boolean;
  food_service_status: 'active' | 'locked';
  food_service_lock_message?: string;
  is_food_locked_for_current_client: boolean;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export function isTestingEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === 'testing' || 
           process.env.VERCEL_GIT_COMMIT_REF === 'testing' ||
           process.env.NODE_ENV === 'development';
  }
  const host = window.location.hostname.toLowerCase();
  const search = window.location.search.toLowerCase();
  return host.includes('localhost') || 
         host.includes('127.0.0.1') || 
         host.includes('git-testing') || 
         host.includes('testing') ||
         search.includes('branch=testing');
}

export async function fetchBootstrapConfig(): Promise<{ success: boolean; data: BootstrapConfig }> {
  const isTesting = isTestingEnvironment();

  try {
    const rawResponse = await workerClient.getPlatformStatus();
    const response = rawResponse.data || rawResponse;

    const isMaintenance = typeof response.maintenance_mode === 'object' && response.maintenance_mode !== null
      ? Boolean((response.maintenance_mode as any).enabled)
      : Boolean(response.maintenance_mode);

    const isComingSoon = typeof response.coming_soon === 'object' && response.coming_soon !== null
      ? Boolean((response.coming_soon as any).enabled)
      : Boolean(response.coming_soon);

    let foodServiceEnabled = true;
    if (response.food_service_enabled !== undefined) {
      foodServiceEnabled = Boolean(response.food_service_enabled);
    } else if (response.service_timings?.food_service_enabled !== undefined) {
      foodServiceEnabled = Boolean(response.service_timings.food_service_enabled);
    }

    let foodServiceMainLocked = true;
    if (response.food_service_main_locked !== undefined) {
      foodServiceMainLocked = Boolean(response.food_service_main_locked);
    } else if (response.service_timings?.food_service_main_locked !== undefined) {
      foodServiceMainLocked = Boolean(response.service_timings.food_service_main_locked);
    }

    // Determine lock for THIS client:
    // If master switch disabled -> locked everywhere
    // Else if on testing environment -> UNLOCKED (allowed)
    // Else (main branch / production) -> LOCKED if food_service_main_locked is true (default)
    let isFoodLockedForCurrentClient = false;
    if (!foodServiceEnabled) {
      isFoodLockedForCurrentClient = true;
    } else if (isTesting) {
      isFoodLockedForCurrentClient = false;
    } else {
      isFoodLockedForCurrentClient = foodServiceMainLocked;
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
        food_service_main_locked: foodServiceMainLocked,
        food_service_testing_allowed: foodServiceEnabled,
        food_service_status: isFoodLockedForCurrentClient ? 'locked' : 'active',
        food_service_lock_message: foodLockMessage,
        is_food_locked_for_current_client: isFoodLockedForCurrentClient,
        social_links: response.social_links || {}
      }
    };
  } catch (err) {
    console.warn('Failed to fetch platform status (fallback active):', err);
    // On main fallback -> locked; On testing fallback -> unlocked
    const isFoodLockedForCurrentClient = !isTesting;

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
        food_service_enabled: true,
        food_service_main_locked: true,
        food_service_testing_allowed: true,
        food_service_status: isFoodLockedForCurrentClient ? 'locked' : 'active',
        food_service_lock_message: 'Campus Food ordering is launching soon! Please check back later.',
        is_food_locked_for_current_client: isFoodLockedForCurrentClient,
        social_links: {}
      }
    };
  }
}
