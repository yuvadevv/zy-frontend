import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseConfig } from '../utils/envValidator';

const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];
const AUTH_CALLBACK_ROUTE = '/api/auth/callback';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  
  const config = getSupabaseConfig();

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const url = request.nextUrl.clone();
  
  const isAppRoute = url.pathname.startsWith('/app');
  const isPublicRoute = PUBLIC_ROUTES.some(route => url.pathname.startsWith(route));
  const isCallback = url.pathname.startsWith(AUTH_CALLBACK_ROUTE);

  // If user is not logged in and tries to access protected app routes
  if (!user && isAppRoute) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in and tries to access login/signup screens
  if (user && isPublicRoute && !isCallback) {
    // Redirect to home. Layout will handle redirecting to onboarding if profile is incomplete.
    url.pathname = '/app/home';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
