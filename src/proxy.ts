import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseJwt(token: string) {
  try {
    if (!token) return null;
    const cleanToken = decodeURIComponent(token).replace(/^Bearer\s+/i, '').trim();
    const parts = cleanToken.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
    const raw = atob(padded);
    const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);
    if (parsed.exp && Date.now() / 1000 > parsed.exp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function refreshSupabaseToken(refreshToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wpikxgrsinwtvpjjjkhl.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.access_token) {
        return {
          access_token: data.access_token,
          refresh_token: data.refresh_token || refreshToken,
          user: data.user
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

function applySessionCookies(response: NextResponse, tokens: { access_token: string; refresh_token: string }, isSecure: boolean) {
  response.cookies.set({
    name: 'bl_auth_token',
    value: tokens.access_token,
    httpOnly: false,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 2592000 // 30 days
  });
  response.cookies.set({
    name: 'bl_refresh_token',
    value: tokens.refresh_token,
    httpOnly: false,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 2592000 // 30 days
  });
}

export async function proxy(request: NextRequest) {
  const isSecure = request.nextUrl.protocol === 'https:' || process.env.NODE_ENV === 'production';
  const token = request.cookies.get('bl_auth_token')?.value;
  let user = token ? parseJwt(token) : null;
  let refreshedTokens: { access_token: string; refresh_token: string } | null = null;

  // If access token is expired or missing, attempt to refresh using the refresh token cookie
  if (!user) {
    const refreshToken = request.cookies.get('bl_refresh_token')?.value;
    if (refreshToken) {
      const refreshed = await refreshSupabaseToken(refreshToken);
      if (refreshed) {
        user = parseJwt(refreshed.access_token);
        refreshedTokens = {
          access_token: refreshed.access_token,
          refresh_token: refreshed.refresh_token
        };
      }
    }
  }

  const isPublicRoute = 
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname === '/forgot-password' ||
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/auth/confirm');

  // If user is authenticated and visits public landing or auth page, redirect to app home
  if (isPublicRoute && user && !request.nextUrl.pathname.startsWith('/api')) {
    const redirectRes = NextResponse.redirect(new URL('/app/home', request.url));
    if (refreshedTokens) {
      applySessionCookies(redirectRes, refreshedTokens, isSecure);
    }
    return redirectRes;
  }

  // If user is not authenticated and tries to access protected /app route, redirect to login
  if (!isPublicRoute && !user && request.nextUrl.pathname.startsWith('/app')) {
    const loginRedirect = NextResponse.redirect(new URL('/login', request.url));
    // If token exists but refresh failed (definitely invalid), clear cookies
    if (token || request.cookies.get('bl_refresh_token')) {
      loginRedirect.cookies.delete('bl_auth_token');
      loginRedirect.cookies.delete('bl_refresh_token');
    }
    return loginRedirect;
  }

  // Profile completion check for onboarding
  if (user && request.nextUrl.pathname.startsWith('/app')) {
    const isCompleted = 
      request.cookies.get('bl_profile_completed')?.value === 'true' || 
      Boolean(user.user_metadata?.profile_completed);

    if (!isCompleted && !request.nextUrl.pathname.startsWith('/app/onboarding')) {
      const onboardingRedirect = NextResponse.redirect(new URL('/app/onboarding', request.url));
      if (refreshedTokens) {
        applySessionCookies(onboardingRedirect, refreshedTokens, isSecure);
      }
      return onboardingRedirect;
    }

    if (isCompleted && request.nextUrl.pathname.startsWith('/app/onboarding')) {
      const homeRedirect = NextResponse.redirect(new URL('/app/home', request.url));
      if (refreshedTokens) {
        applySessionCookies(homeRedirect, refreshedTokens, isSecure);
      }
      return homeRedirect;
    }
  }

  const response = NextResponse.next();
  if (refreshedTokens) {
    applySessionCookies(response, refreshedTokens, isSecure);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
