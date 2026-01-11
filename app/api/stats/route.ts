import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth, createAuthResponse } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

// Get the authenticated client from the auth verification
function getSupabaseClient() {
  const authenticatedClient = (global as any).authenticatedSupabaseClient;
  if (authenticatedClient) {
    return authenticatedClient;
  }
  // Fallback to regular client (shouldn't happen if auth is working)
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  );
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data: stats, error } = await supabase
      .from('stats')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching stats:', error);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminAuth(request);
    console.log('PUT auth check:', isAuthenticated);
    if (!isAuthenticated) {
      return createAuthResponse();
    }

    const body = await request.json();
    console.log('PUT request body:', body);

    // Validate required fields
    if (!body.id || body.value === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // First, let's check if the stat exists
    const { data: existingStat, error: fetchError } = await supabase
      .from('stats')
      .select('*')
      .eq('id', body.id)
      .single();

    console.log('Existing stat check:', { existingStat, fetchError });

    if (fetchError) {
      console.error('Error fetching existing stat:', fetchError);
      return NextResponse.json({ error: 'Stat not found' }, { status: 404 });
    }

    // Update stat
    const { data: stat, error } = await supabase
      .from('stats')
      .update({ 
        value: body.value,
        suffix: body.suffix,
        label: body.label 
      })
      .eq('id', body.id)
      .select()
      .maybeSingle();

    console.log('Update result:', { stat, error });

    if (error) {
      console.error('Error updating stat:', error);
      return NextResponse.json({ error: 'Failed to update stat' }, { status: 500 });
    }

    if (!stat) {
      console.error('No stat found with ID:', body.id);
      return NextResponse.json({ error: 'Stat not found' }, { status: 404 });
    }

    return NextResponse.json(stat);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return createAuthResponse();
    }

    const body = await request.json();

    // Validate required fields
    if (!body.label || body.value === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Create new stat
    const { data: stat, error } = await supabase
      .from('stats')
      .insert({
        label: body.label,
        value: body.value,
        suffix: body.suffix || ''
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating stat:', error);
      return NextResponse.json({ error: 'Failed to create stat' }, { status: 500 });
    }

    return NextResponse.json(stat);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return createAuthResponse();
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing stat ID' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Delete stat
    const { error } = await supabase
      .from('stats')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting stat:', error);
      return NextResponse.json({ error: 'Failed to delete stat' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Stat deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
