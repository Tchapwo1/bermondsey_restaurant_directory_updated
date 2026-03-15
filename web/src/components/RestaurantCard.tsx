import Link from 'next/link';
import Image from 'next/image';

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
  name,
  slug,
  cuisine,
  priceRange,
  rating,
  coverImageUrl,
  descriptionShort,
  neighborhood
}: RestaurantCardProps) {
  const priceSymbol = '£'.repeat(priceRange || 2);
  
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-primary/5 hover:border-primary/20 transition-all hover:shadow-xl hover:-translate-y-1">
      <Link href={`/restaurants/${slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            src={coverImageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"} 
            alt={name}
          />
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{rating || "5.0"}</span>
          </div>
          {rating >= 4.8 && (
            <div className="absolute bottom-3 left-3 flex gap-2">
              <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Top Rated</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
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
