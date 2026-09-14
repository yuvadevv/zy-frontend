import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, clear } = body;

    const response = NextResponse.json({ success: true });

    if (clear) {
      response.cookies.set({
        name: 'bl_auth_token',
        value: '',
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 0
      });
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

