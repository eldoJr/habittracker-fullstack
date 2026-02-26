import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

interface CookieToSet {
  name: string
  value: string
  options?: CookieOptions
}

export async function POST(request: Request) {
  console.log('[API LOGIN] Request received')
  const { email, password } = await request.json()
  console.log('[API LOGIN] Email:', email)
  
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const allCookies = cookieStore.getAll()
          console.log('[API LOGIN] Getting cookies:', allCookies.length)
          return allCookies
        },
        setAll(cookiesToSet: CookieToSet[]) {
          console.log('[API LOGIN] Setting cookies:', cookiesToSet.length)
          cookiesToSet.forEach(({ name, value, options }: CookieToSet) => {
            cookieStore.set(name, value, options)
            console.log('[API LOGIN] Set cookie:', name)
          })
        },
      },
    }
  )

  console.log('[API LOGIN] Calling signInWithPassword...')
  const { error, data } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error('[API LOGIN] Error:', error.message)
    return NextResponse.json({ success: false, message: error.message }, { status: 401 })
  }

  console.log('[API LOGIN] Success, user:', data.user?.id)
  return NextResponse.json({ success: true })
}
