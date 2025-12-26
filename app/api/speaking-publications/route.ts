import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { speakingPublicationsOperations } from '@/lib/supabase-data';

export async function GET() {
  try {
    const data = await speakingPublicationsOperations.getAll();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error reading data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Error reading data: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Verify authentication
  const isAuthorized = await verifyAdminAuth(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    // Validate the data structure
    if (!data || typeof data !== 'object' || !('speakingEngagements' in data) || !('publications' in data)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }
    
    const updatedData = await speakingPublicationsOperations.updateAll(data);
    
    return NextResponse.json({ 
      success: true,
      message: 'Data saved successfully',
      data: updatedData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: unknown) {
    console.error('Error saving data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        error: `Error saving data: ${errorMessage}`,
        success: false
      },
      { status: 500 }
    );
  }
}
