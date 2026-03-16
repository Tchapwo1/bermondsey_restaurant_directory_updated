import { createClient } from '@/lib/supabase-server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantCard from '@/components/RestaurantCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
  const supabase = await createClient();
  
  // Get current session user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Middleware should handle this, but defensive check
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-black uppercase">Please sign in</h1>
          <Link href="/login" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl">Sign In</Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch favorite restaurant IDs for this user
  const { data: favorites, error } = await supabase
    .from('favorites')
    .select('restaurant_id, restaurants(*)')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching favorites:', error);
  }

  const savedRestaurants = favorites?.map(f => f.restaurants) || [];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link className="hover:text-primary transition-colors" href="/">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold uppercase tracking-tight">My Favorites</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Your Saved Spots</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Quick access to the Bermondsey flavors you love.</p>
        </div>

        {savedRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedRestaurants.map((res: any) => (
              <RestaurantCard 
                key={res.id}
                id={res.id}
                name={res.name}
                slug={res.slug}
                cuisine={res.cuisine_type}
                priceRange={res.price_range}
                rating={res.ratings?.tripadvisor?.value || 4.5}
                coverImageUrl={res.cover_image_url}
                descriptionShort={res.description_short}
                neighborhood={res.neighbourhood}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 rounded-3xl border border-primary/5 shadow-xl">
             <div className="bg-primary/5 p-6 rounded-full mb-6">
                <span className="material-symbols-outlined text-6xl text-primary/30">favorite</span>
             </div>
             <h3 className="text-2xl font-black uppercase tracking-tight mb-2">No favorites yet</h3>
             <p className="text-slate-500 max-w-xs mx-auto mb-8">Start exploring the directory and heart your favorite spots to see them here!</p>
             <Link href="/restaurants" className="px-10 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">Explore Restaurants</Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
