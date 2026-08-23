import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseConfig } from '@/lib/utils/envValidator';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  const cookieStore = await cookies()
  const nextParam = searchParams.get('next') || cookieStore.get('portal_next')?.value
  
  const allowedNextPaths = [
    '/login', '/admin/login', '/admin', '/vendor/login', '/vendor', '/app/home', '/app/onboarding'
  ];
  const safeNext = nextParam && allowedNextPaths.includes(nextParam) ? nextParam : null;
  
  let errorRedirect = `${origin}/login?error=Authentication%20failed`;
  if (safeNext?.startsWith('/admin')) errorRedirect = `${origin}/admin/login?error=Authentication%20failed`;
  if (safeNext?.startsWith('/vendor')) errorRedirect = `${origin}/vendor/login?error=Authentication%20failed`;
  
  if (code) {
    // Clear the portal_next cookie once consumed
    if (cookieStore.get('portal_next')) {
      cookieStore.delete('portal_next')
    }

    const config = getSupabaseConfig()
    const supabase = createServerClient(config.url, config.anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    })
    
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {
      if (safeNext) {
        return NextResponse.redirect(`${origin}${safeNext}`)
      }

      // Check if profile exists and is completed (only for students, i.e. no safeNext provided)
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('profile_completed')
        .eq('user_id', user.id)
        .single()
        
      if (profile?.profile_completed) {
        return NextResponse.redirect(`${origin}/app/home`)
      } else {
        return NextResponse.redirect(`${origin}/app/onboarding`)
      }
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(errorRedirect)
}
