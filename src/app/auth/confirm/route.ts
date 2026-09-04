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

  // If code is not present, check if client browser received tokens via URL hash (Implicit Grant flow)
  const fallbackHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating...</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fafafa; }
    .card { background: white; padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); text-align: center; max-width: 380px; width: 90%; }
    .spinner { width: 36px; height: 36px; border: 3px solid #f3f3f3; border-top: 3px solid #f97316; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.25rem; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    h2 { font-size: 1.25rem; font-weight: 700; color: #111827; margin: 0 0 0.5rem; }
    p { font-size: 0.875rem; color: #6b7280; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>Authenticating...</h2>
    <p>Securing your BLINTZY session</p>
  </div>
  <script>
    (function() {
      try {
        var hash = window.location.hash;
        if (hash && hash.includes('access_token=')) {
          var params = new URLSearchParams(hash.replace(/^#/, ''));
          var token = params.get('access_token');
          if (token) {
            var parts = token.split('.');
            var user = null;
            if (parts.length >= 2) {
              var payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
              user = { id: payload.sub, email: payload.email, role: payload.role, user_metadata: payload.user_metadata || {} };
            }
            localStorage.setItem('bl_session_token', token);
            if (user) localStorage.setItem('bl_session_user', JSON.stringify(user));
            document.cookie = 'bl_auth_token=' + encodeURIComponent(token) + '; path=/; max-age=2592000; SameSite=Lax';
            window.location.replace('${safeNext}');
            return;
          }
        }
      } catch (e) {
        console.error('Failed to parse hash tokens:', e);
      }
      window.location.replace('/login');
    })();
  </script>
</body>
</html>`;

  return new Response(fallbackHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

