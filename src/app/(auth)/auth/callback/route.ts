import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  console.log('[AUTH CALLBACK] Callback triggered')
  console.log('[AUTH CALLBACK] Code:', code ? 'present' : 'missing')
  console.log('[AUTH CALLBACK] Next:', next)
  console.log('[AUTH CALLBACK] Origin:', origin)

  if (code) {
    const supabase = await createClient()
    console.log('[AUTH CALLBACK] Exchanging code for session...')
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('[AUTH CALLBACK] Session exchange successful, redirecting to:', `${origin}${next}`)
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    console.error('[AUTH CALLBACK] Session exchange error:', error.message)
  }

  console.log('[AUTH CALLBACK] Redirecting to login with error')
  return NextResponse.redirect(`${origin}/login?error=Could not verify email`)
}
