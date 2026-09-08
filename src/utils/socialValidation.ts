export function validateSocialUrl(url: string | undefined | null, platform: 'linkedin' | 'twitter' | 'instagram'): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return null;

    const hostname = parsed.hostname.toLowerCase();
    
    if (platform === 'linkedin') {
      if (!hostname.includes('linkedin.com')) return null;
    } else if (platform === 'twitter') {
      if (!hostname.includes('twitter.com') && !hostname.includes('x.com')) return null;
    } else if (platform === 'instagram') {
      if (!hostname.includes('instagram.com')) return null;
    }

    return parsed.toString();
  } catch (e) {
    // Invalid URL
    return null;
  }
}
