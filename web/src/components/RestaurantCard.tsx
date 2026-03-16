"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface RestaurantCardProps {
  id: string;
  name: string;
  slug: string;
  cuisine: string[];
  priceRange: number;
  rating: number;
  coverImageUrl: string;
  descriptionShort: string;
  neighborhood: string;
}

export default function RestaurantCard({
  id,
  name,
  slug,
  cuisine,
  priceRange,
  rating,
  coverImageUrl,
  descriptionShort,
  neighborhood
}: RestaurantCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const priceSymbol = '£'.repeat(priceRange || 2);

  useEffect(() => {
    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('restaurant_id', id)
        .single();
      
      if (data) setIsFavorite(true);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Please sign in to favorite restaurants!');
      return;
    }

    setLoading(true);
    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('restaurant_id', id);
      setIsFavorite(false);
    } else {
      await supabase
        .from('favorites')
        .insert([{ user_id: session.user.id, restaurant_id: id }]);
      setIsFavorite(true);
    }
    setLoading(false);
  };
  
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-primary/5 hover:border-primary/20 transition-all hover:shadow-xl hover:-translate-y-1">
      <Link href={`/restaurants/${slug}`}>
        <div className="relative h-56 overflow-hidden">
          <Image
            src={coverImageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <button 
            onClick={toggleFavorite}
            disabled={loading}
            className="absolute top-3 left-3 size-10 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur flex items-center justify-center shadow-lg border border-primary/5 transition-all hover:scale-110 z-20 group/heart"
          >
             <span className={`material-symbols-outlined text-sm transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-400 group-hover/heart:text-red-300'}`} style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
               favorite
             </span>
          </button>

          <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg border border-primary/5">
            <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-xs font-black text-slate-900 dark:text-white">{rating || "5.0"}</span>
          </div>
          {rating >= 4.8 && (
            <div className="absolute bottom-3 left-3 flex gap-2">
              <span className="bg-primary text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-lg">Top Rated</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl group-hover:text-primary transition-colors pr-8">
            <Link href={`/restaurants/${slug}`}>{name}</Link>
          </h3>
          <span className="text-sm text-slate-400">{priceSymbol}</span>
        </div>
        <p className="text-xs text-primary font-semibold mb-3 uppercase tracking-wide">
          {cuisine?.join(' • ') || 'Local Favorite'}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
          {descriptionShort}
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {neighborhood || 'Bermondsey'}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Open Now
          </span>
        </div>
      </div>
    </div>
  );
}
