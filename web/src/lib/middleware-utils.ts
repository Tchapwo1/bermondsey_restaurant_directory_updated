import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.error('Middleware Error: Supabase credentials missing.')
    return response // If config is broken, we might want to return 500 or redirect to error page, but let's at least not crash.
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // PROTECT ROUTES
    const isFavoritesRoute = request.nextUrl.pathname.startsWith('/favorites')
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')

    if (isFavoritesRoute || isAdminRoute || isDashboardRoute) {
      // REQUIRE LOGGED IN USER FOR ALL
      if (userError || !user) {
        return NextResponse.redirect(new URL('/login?error=Session Expired', request.url))
      }

      // ADDITIONAL CHECK FOR ADMIN ONLY
      if (isAdminRoute) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profileError || !profile || profile.role !== 'admin') {
          console.warn(`Unauthorized access attempt to /admin by ${user.email}`)
          return NextResponse.redirect(new URL('/login?error=Access Denied', request.url))
        }
      }
    }
  } catch (err) {
    console.error('Middleware Critical Error:', err)
    // If we're on an admin route and something breaks, we MUST fail-closed.
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login?error=Security Error', request.url))
    }
  }

  return response
}
