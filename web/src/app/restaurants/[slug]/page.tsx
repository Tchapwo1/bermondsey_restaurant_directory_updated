import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

export default async function RestaurantProfile({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !restaurant) {
    return notFound();
  }

  const priceSymbol = '£'.repeat(restaurant.price_range || 2);
  const rating = restaurant.ratings?.tripadvisor?.value || "4.8";

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="px-4 py-6">
              <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden rounded-xl shadow-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: `url("${restaurant.cover_image_url}")` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            </div>

            <div className="px-6 py-8 flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="size-24 rounded-xl shadow-lg border-4 border-white dark:border-background-dark overflow-hidden -mt-16 relative z-10 bg-white">
                    <div 
                      className="w-full h-full bg-cover bg-center" 
                      style={{ backgroundImage: `url("${restaurant.cover_image_url}")` }}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-4xl font-extrabold tracking-tight">{restaurant.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-slate-600 dark:text-slate-400">
                      <span className="font-medium text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span> 
                        {rating} ({restaurant.ratings?.tripadvisor?.review_count || '100+'}+ reviews)
                      </span>
                      <span>•</span>
                      <span>{restaurant.cuisine_type?.join(', ')}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{priceSymbol}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400 font-medium">
                  <span className="material-symbols-outlined shrink-0 text-primary">location_on</span>
                  <p>{restaurant.address}, {restaurant.postcode}</p>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <a 
                  href={restaurant.google_maps_link} 
                  target="_blank"
                  className="w-full md:min-w-[200px] bg-primary text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">calendar_month</span>
                  Book Now
                </a>
              </div>
            </div>

            <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 py-8 border-t border-primary/5">
              <div className="lg:col-span-2 space-y-12">
                <section>
                  <h3 className="text-2xl font-bold mb-4 uppercase tracking-wide">About the Restaurant</h3>
                  <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    {restaurant.description_short}
                  </p>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold uppercase tracking-wide">Menu Highlights</h3>
                    <span className="text-primary font-bold flex items-center gap-1">
                      View Full Menu <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {restaurant.menu_specialties?.map((item: string, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-white dark:bg-background-dark/50 border border-primary/5 shadow-sm">
                        <h4 className="font-bold text-lg">{item}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">A house specialty prepared with fresh, local Bermondsey ingredients.</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-6 uppercase tracking-wide">Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {restaurant.tags?.map((tag: string) => (
                      <span key={tag} className="px-4 py-2 bg-primary/10 rounded-full text-sm font-bold text-primary capitalize">
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-8">
                <div className="p-6 rounded-2xl bg-white dark:bg-background-dark border border-primary/10 shadow-xl sticky top-24">
                  <h4 className="text-xl font-bold mb-4">Information</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-2">Opening Hours</h5>
                      <p className="text-sm font-medium">{restaurant.opening_hours_raw}</p>
                    </div>
                    {restaurant.website && (
                      <div className="pt-4 border-t border-primary/5">
                        <h5 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-2">Website</h5>
                        <a href={restaurant.website} className="text-primary font-bold hover:underline" target="_blank">{restaurant.website}</a>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
