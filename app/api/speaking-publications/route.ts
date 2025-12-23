import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const dataFilePath = path.join(process.cwd(), 'data/speaking-publications.json');

// Helper function to read data file
async function readDataFile() {
  try {
    const file = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(file);
  } catch (error: unknown) {
    // If file doesn't exist, return default structure
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return { speakingEngagements: [], publications: [] };
    }
    console.error('Error reading data file:', error);
    throw new Error('Failed to read data file');
  }
}

export async function GET() {
  try {
    const data = await readDataFile();
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
  const isAuthorized = await verifyAdminAuth();
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
    
    // Ensure the data directory exists
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    
    // Write the data to the file with proper formatting
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ 
      success: true,
      message: 'Data saved successfully',
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
