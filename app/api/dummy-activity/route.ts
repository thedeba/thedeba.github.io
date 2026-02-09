import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert dummy data with timestamp
    const { data, error } = await supabase
      .from('dummy_activity')
      .insert({
        activity_data: `Keep-alive ping - ${new Date().toISOString()}`
      })
      .select()

    if (error) {
      console.error('Error inserting dummy activity:', error)
      return NextResponse.json(
        { error: 'Failed to insert dummy activity' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Dummy activity recorded successfully',
        data
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to check latest dummy activity
export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get latest dummy activity
    const { data, error } = await supabase
      .from('dummy_activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error fetching dummy activity:', error)
      return NextResponse.json(
        { error: 'Failed to fetch dummy activity' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        lastActivity: data[0] || null
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
