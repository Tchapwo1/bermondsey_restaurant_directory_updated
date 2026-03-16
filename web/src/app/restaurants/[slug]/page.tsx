import { createClient } from '@/lib/supabase-server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ReviewsSection from '@/components/ReviewsSection';

export const dynamic = 'force-dynamic';

export default async function RestaurantProfile({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

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

  // Gallery images from DB or cover fallback
  const galleryImages = restaurant.gallery_images?.length > 0 
    ? [...new Set([restaurant.cover_image_url, ...restaurant.gallery_images])]
    : [restaurant.cover_image_url];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="px-4 py-6">
              <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl group">
                <Image 
                  src={restaurant.cover_image_url} 
                  alt={restaurant.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                   <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm font-bold uppercase tracking-widest mb-2">
                      <span className="bg-primary px-3 py-1 rounded-lg text-white">{restaurant.cuisine_type?.[0] || 'Restaurant'}</span>
                      <span>•</span>
                      <span>{restaurant.neighbourhood || 'Bermondsey'}</span>
                   </div>
                   <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">{restaurant.name}</h1>
                </div>
              </div>
            </div>

            <div className="px-6 py-8 flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                  <div className="size-24 rounded-2xl shadow-xl border-4 border-white dark:border-slate-800 overflow-hidden -mt-16 relative z-10 bg-white">
                    <Image 
                      src={restaurant.cover_image_url} 
                      alt={`${restaurant.name} logo`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-slate-600 dark:text-slate-400">
                      <span className="font-black text-primary flex items-center gap-1 text-lg">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span> 
                        {rating}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="font-bold uppercase tracking-widest text-xs">{restaurant.cuisine_type?.join(' • ')}</span>
                      <span className="text-slate-300">|</span>
                      <span className="font-black text-slate-900 dark:text-slate-100">{priceSymbol}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-primary/5">
                  <span className="material-symbols-outlined shrink-0 text-primary">location_on</span>
                  <p>{restaurant.address}, {restaurant.postcode}</p>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <a 
                  href={restaurant.google_maps_link} 
                  target="_blank"
                  className="w-full md:min-w-[240px] bg-primary text-white font-black py-5 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                >
                  <span className="material-symbols-outlined">calendar_month</span>
                  Book a Table
                </a>
              </div>
            </div>

            <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 py-12 border-t border-primary/5">
              <div className="lg:col-span-2 space-y-16">
                <section>
                  <h3 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">info</span>
                    Our Story
                  </h3>
                  <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    {restaurant.description_short}
                  </p>
                </section>

                <section>
                   <h3 className="text-2xl font-black mb-8 uppercase tracking-tight flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">grid_view</span>
                    Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((img, i) => (
                      <div key={i} className={`relative overflow-hidden rounded-2xl aspect-square shadow-md hover:shadow-xl transition-shadow group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                         <Image 
                          src={img} 
                          alt={`${restaurant.name} gallery ${i}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                         />
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
                         </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                       <span className="material-symbols-outlined text-primary">restaurant_menu</span>
                       Menu Highlights
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {restaurant.menu_specialties?.map((item: string, i: number) => (
                      <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-primary/5 shadow-sm hover:border-primary/20 transition-colors">
                        <h4 className="font-black text-lg uppercase tracking-tight mb-2">{item}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">A signature Bermondish dish prepared with seasonal ingredients and culinary expertise.</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary">loyalty</span>
                     Amenities
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {restaurant.tags?.map((tag: string) => (
                      <span key={tag} className="px-5 py-2.5 bg-primary/5 dark:bg-primary/10 rounded-xl text-xs font-black text-primary uppercase tracking-widest border border-primary/10">
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </section>

                <div className="border-t border-primary/5 pt-16">
                   <ReviewsSection restaurantId={restaurant.id} />
                </div>
              </div>

              <aside className="space-y-8">
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-primary/10 shadow-2xl sticky top-24">
                  <h4 className="text-xl font-black mb-8 uppercase tracking-tight">Essential Info</h4>
                  <div className="space-y-8">
                    <div className="flex gap-4">
                       <span className="material-symbols-outlined text-primary">schedule</span>
                       <div>
                          <h5 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-1">Opening Hours</h5>
                          <p className="text-sm font-bold leading-relaxed">{restaurant.opening_hours_raw}</p>
                       </div>
                    </div>
                    
                    {restaurant.website && (
                      <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                         <span className="material-symbols-outlined text-primary">language</span>
                         <div>
                            <h5 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-1">Website</h5>
                            <a href={restaurant.website} className="text-sm font-black text-primary hover:underline break-all" target="_blank">{restaurant.website}</a>
                         </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                       <span className="material-symbols-outlined text-primary">share</span>
                       <div>
                          <h5 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-1">Social</h5>
                          <div className="flex gap-3 mt-2">
                             <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary cursor-pointer transition-colors">
                                <span className="material-symbols-outlined text-sm">public</span>
                             </div>
                             <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary cursor-pointer transition-colors">
                                <span className="material-symbols-outlined text-sm">alternate_email</span>
                             </div>
                          </div>
                       </div>
                    </div>
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
