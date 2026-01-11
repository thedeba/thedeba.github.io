import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function verifyAdminAuth(request?: Request) {
  try {
    // First try to get session from cookies (server-side)
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
    
    let { data: { session } } = await supabase.auth.getSession()
    
    // If no session from cookies, try Authorization header (client-side)
    if (!session && request) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        // Create a new client with the token to properly set user context
        const supabaseWithToken = createServerClient(
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
        const { data: { user } } = await supabaseWithToken.auth.getUser(token)
        if (user) {
          // Store the authenticated client for use in the API route
          ;(global as any).authenticatedSupabaseClient = supabaseWithToken
          return true
        }
      }
    }
    
    if (!session) {
      return false
    }
    
    // Store the authenticated client for use in the API route
    ;(global as any).authenticatedSupabaseClient = supabase
    
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
