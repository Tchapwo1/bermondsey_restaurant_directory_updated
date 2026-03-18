"use client"
import { useState } from 'react';

interface BookButtonProps {
  restaurantId: string;
  bookingUrl: string;
}

export default function BookButton({ restaurantId, bookingUrl }: BookButtonProps) {
  const [tracking, setTracking] = useState(false);

  const handleBookClick = async (e: React.MouseEvent) => {
    // If it's a maps link or something external, we still want to track it
    // We'll use fetch with keepalive or just wait a tiny bit
    setTracking(true);
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          eventType: 'book_button_click',
          metadata: { timestamp: new Date().toISOString() }
        }),
        // keepalive: true // ENSURE TRACKING FINISHES EVEN IF PAGE UNLOADS
      });
    } catch (err) {
      console.error('Failed to track click:', err);
    } finally {
      setTracking(false);
      // The link will naturally follow its href unless we prevented default.
      // But since this is a button-styled <a> usually, we might just let it go.
      // If we use an <a> tag, we don't need to manually redirect if we don't preventDefault.
    }
  };

  return (
    <a 
      href={bookingUrl} 
      target="_blank"
      onClick={handleBookClick}
      className={`w-full md:min-w-[240px] bg-primary text-white font-black py-5 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm ${tracking ? 'opacity-80' : ''}`}
    >
      <span className="material-symbols-outlined">calendar_month</span>
      {tracking ? 'Processing...' : 'Book a Table'}
    </a>
  );
}
