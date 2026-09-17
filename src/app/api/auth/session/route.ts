import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig } from '@/lib/utils/envValidator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, clear } = body;

    const response = NextResponse.json({ success: true });

    if (clear) {
      response.cookies.delete('bl_auth_token');
      // Also forcefully set the header just in case
      response.cookies.set({
        name: 'bl_auth_token',
        value: '',
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 0,
        expires: new Date(0)
      });
      // Forcefully clear Supabase cookies in case the client failed to do it
      const config = getSupabaseConfig();
      const projectId = config.url.match(/https:\/\/([^\.]+)\.supabase\.co/)?.[1] || '';
      if (projectId) {
        response.cookies.delete(`sb-${projectId}-auth-token`);
      }
    } else if (token) {
      response.cookies.set({
        name: 'bl_auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 2592000 // 30 days
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to set session' }, { status: 500 });
  }
}

