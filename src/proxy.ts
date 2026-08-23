import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isPublicRoute = 
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname === '/forgot-password' ||
    request.nextUrl.pathname.startsWith('/api/auth');

  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL('/app/home', request.url))
  }

  if (!isPublicRoute && !user && request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Profile completion check for onboarding
  if (user && request.nextUrl.pathname.startsWith('/app')) {
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('profile_completed')
      .eq('user_id', user.id)
      .single()

    const isCompleted = profile?.profile_completed

    // If accessing anything inside /app EXCEPT onboarding, but profile isn't complete
    if (!isCompleted && !request.nextUrl.pathname.startsWith('/app/onboarding')) {
      return NextResponse.redirect(new URL('/app/onboarding', request.url))
    }

    // If accessing onboarding but profile IS complete
    if (isCompleted && request.nextUrl.pathname.startsWith('/app/onboarding')) {
      return NextResponse.redirect(new URL('/app/home', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
