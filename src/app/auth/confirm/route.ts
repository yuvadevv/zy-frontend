import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://127.0.0.1:8787';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  const cookieStore = await cookies();
  const nextParam = searchParams.get('next') || cookieStore.get('portal_next')?.value;
  
  const allowedNextPaths = [
    '/login', '/admin/login', '/admin', '/vendor/login', '/vendor', '/app/home', '/app/onboarding'
  ];
  const safeNext = nextParam && allowedNextPaths.includes(nextParam) ? nextParam : '/app/home';
  
  if (cookieStore.get('portal_next')) {
    cookieStore.delete('portal_next');
  }

  if (code) {
    try {
      const res = await fetch(`${WORKER_URL}/api/auth/oauth/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const result = await res.json();
      const token = result.data?.session?.access_token || result.session?.access_token || result.data?.access_token || result.access_token;
      
      if (token) {
        const response = NextResponse.redirect(`${origin}${safeNext}`);
        response.cookies.set('bl_auth_token', token, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          sameSite: 'lax',
          httpOnly: false
        });
        return response;
      }
    } catch (err) {
      console.error('OAuth exchange error in frontend confirm:', err);
    }
    return NextResponse.redirect(`${origin}/login?error=OAuth+exchange+failed`);
  }

  if (safeNext) {
    return NextResponse.redirect(`${origin}${safeNext}`);
  }

  return NextResponse.redirect(`${origin}/login`);
}

