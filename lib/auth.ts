import { auth } from './firebase-admin'
import { NextResponse } from 'next/server'

export async function verifyAdminAuth(request?: Request) {
  try {
    let token = null
    
    // Try to get token from Authorization header
    if (request) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }
    
    if (!token) {
      console.log('No token found in authorization header')
      return false
    }
    
    console.log('Attempting to verify token:', token.substring(0, 20) + '...')
    
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(token)
    console.log('Token verified successfully for user:', decodedToken.email)
    
    // You can add additional checks here, like checking if the user email is authorized
    // For now, allow any authenticated user
    // TODO: Add proper admin email checking
    
    // Store the decoded token for use in the API route
    ;(global as any).decodedToken = decodedToken
    
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
