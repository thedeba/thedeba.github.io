import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function verifyAdminAuth(request?: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: any[]) {
            cookiesToSet.forEach(({ name, value, ...options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return false
    }
    
    // You can add additional checks here, like checking if the user email is authorized
    // For example: return session.user.email === 'admin@example.com'
    
    return true
  } catch (error) {
    console.error('Auth verification error:', error)
    return false
  }
}

export function createAuthResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' }, 
    { status: 401 }
  )
}
