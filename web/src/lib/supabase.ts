import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    // In browser, we can't throw at the top level without crashing the whole bundle easily.
    // However, createBrowserClient will handle it if we pass them, or we can log a clear error.
    console.error('Supabase credentials missing. Check your environment variables.');
  }

  return createBrowserClient(
    url || '',
    anonKey || ''
  )
}

// Keep the static export for simple client-side usage if preferred,
// though createClient() is better for SSR consistency.
export const supabase = createClient()
