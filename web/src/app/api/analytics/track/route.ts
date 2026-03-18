import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { restaurantId, eventType, metadata } = await request.json();

    if (!restaurantId || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from('analytics').insert([
      {
        restaurant_id: restaurantId,
        event_type: eventType,
        metadata: metadata || {}
      }
    ]);

    if (error) {
      console.error('Analytics Error:', error);
      return NextResponse.json({ error: 'Failed to log analytics' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics Catch Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
