import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const supabase = await createClient();

    // 1. Fetch some restaurant data to provide context
    const { data: restaurants } = await supabase
      .from('restaurants')
      .select('name, slug, cuisine_type, neighbourhood, description_short, status')
      .eq('status', 'active');

    if (!restaurants) return NextResponse.json({ reply: "I'm having trouble finding restaurant information right now." });

    const q = query.toLowerCase();

    // 2. Simple Rule-based matching for now (simulating "Natural Language")
    let matchingRestaurant = null;
    let reply = "I'm not exactly sure about that one! Bermondsey has so many gems. Could you try asking for a specific cuisine, like 'Italian' or 'Japanese'?";

    if (q.includes('quiet') || q.includes('romantic') || q.includes('fine dining')) {
       matchingRestaurant = restaurants.find(r => r.cuisine_type?.includes('Fine Dining') || r.description_short?.toLowerCase().includes('quiet'));
       reply = matchingRestaurant 
         ? `For a quiet or fine dining experience, I highly recommend ${matchingRestaurant.name}. It's perfect for a special evening in Bermondsey.`
         : "Bermondsey has some great quiet spots. I'd suggest checking out our 'Fine Dining' category for the best atmosphere.";
    } else if (q.includes('italian') || q.includes('pasta') || q.includes('pizza')) {
       matchingRestaurant = restaurants.find(r => r.cuisine_type?.includes('Italian'));
       reply = matchingRestaurant 
         ? `${matchingRestaurant.name} is a fantastic choice for authentic Italian in SE1. Shall I show you their menu?`
         : "We have some amazing Italian spots! You might want to explore the list of Italian restaurants in the directory.";
    } else if (q.includes('cheap') || q.includes('affordable') || q.includes('quick')) {
       reply = "Bermondsey Street has some great quick bites! Bakeries like 'Casse-Croûte' are fantastic for something delicious and fast.";
    } else if (q.includes('london bridge')) {
       reply = "Near London Bridge, you're spoilt for choice. The restaurants near Borough Market and the bottom of Bermondsey Street are all within a 5-minute walk!";
    }

    // 3. If we found a specific match in the query
    const specificMatch = restaurants.find(r => q.includes(r.name.toLowerCase()));
    if (specificMatch) {
       matchingRestaurant = specificMatch;
       reply = `Oh, ${specificMatch.name} is wonderful! Would you like to see more details or book a table there?`;
    }

    return NextResponse.json({ 
      reply,
      restaurantSlug: matchingRestaurant?.slug 
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ reply: "Oops, something went wrong on my end." });
  }
}
