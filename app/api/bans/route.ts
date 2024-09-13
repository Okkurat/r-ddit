import connectDB from '@/lib/mongoose';
import Ban from '@/models/ban';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();

  try {
    const now = new Date();
    
    const result = await Ban.deleteMany({ bannedUntil: { $lt: now } });

    return NextResponse.json({
      message: `Processed ${result.deletedCount} expired bans`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error processing expired bans:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}