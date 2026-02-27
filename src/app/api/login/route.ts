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
  const responseCookies = new Map<string, { value: string; options?: any }>()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          const maxAgeSeconds = options && typeof options.maxAge === 'number'
            ? Math.floor(options.maxAge / 1000)
            : options?.maxAge

          const enforcedOptions = {
            ...options,
            maxAge: maxAgeSeconds,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
          }

          responseCookies.set(name, { value, options: enforcedOptions })
        },
        remove(name, options) {
          responseCookies.set(name, { value: '', options: { ...options, maxAge: 0 } })
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
  console.log('[API LOGIN] Cookies to set:', responseCookies.size)
  
  const response = NextResponse.json({ success: true })
  
  responseCookies.forEach(({ value, options }, name) => {
    let cookieString = `${name}=${encodeURIComponent(value)}`
    if (options) {
      if (options.path) cookieString += `; Path=${options.path}`
      if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`
      if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`
      if (options.httpOnly) cookieString += `; HttpOnly`
      if (options.secure) cookieString += `; Secure`
    }
    response.headers.append('Set-Cookie', cookieString)
  })
  
  return response
}
