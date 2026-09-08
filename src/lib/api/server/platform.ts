const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://127.0.0.1:8787';

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

export async function getPublicPlatformStatus() {
  try {
    // Revalidate every 60 seconds to match the client-side cache strategy
    const response = await fetch(`${WORKER_URL}/api/platform/status`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch platform status server-side:', err);
    return null;
  }
}
