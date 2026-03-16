"use client"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingRestaurants, setTrendingRestaurants] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchTrending() {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .order('id', { ascending: false }) 
          .limit(3);
        
        if (error) {
          console.error('[Home] Supabase Error fetching trending:', error);
        } else if (data) {
          setTrendingRestaurants(data);
        }
      } catch (err) {
        console.error('[Home] Unexpected error fetching trending:', err);
      }
    }
    fetchTrending();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/restaurants?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <main className="flex-1">
          <section className="w-full px-4 md:px-20 py-8">
            <div className="@container">
              <div className="relative overflow-hidden rounded-2xl">
                <div 
                  className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-6 text-center" 
                  style={{ 
                    backgroundImage: 'linear-gradient(rgba(34, 22, 16, 0.6) 0%, rgba(34, 22, 16, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAFZSoJiaO1okJtUrDcY_OKfyjtDsB5GQYoc86XKxsP2qnadvLzmCxycS8tYI-vvaIlHCSqxJL77YAY-Act5_lAVWQZ45sT-fQIMgY64twwvyU0xjmD_GGnsViMhOir6ZTTvAZxRNkg3D9NTMz2FJWOVe4MfrDd3wnOTohzaRu-EviqnsTblgzVVxAPIPa7oYMLOhjEIjiJ560lmJYcroRKId1OyrqU8TmCUW0L3YOV6tNI2c4V1pUhDzwlb9FS8m3nZBtIWjoUl2iM")' 
                  }}
                >
                  <div className="flex flex-col gap-4 max-w-3xl">
                    <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight uppercase">
                      Find your next meal in Bermondsey
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                      Discover the finest dining experiences, hidden gems, and local favorites in the heart of London SE1.
                    </p>
                  </div>
                  <div className="w-full max-w-2xl mt-4">
                    <form onSubmit={handleSearch} className="flex items-stretch bg-white rounded-xl p-2 shadow-2xl">
                      <div className="flex items-center pl-4 text-slate-400">
                        <span className="material-symbols-outlined">search</span>
                      </div>
                      <input 
                        className="flex-1 border-none focus:ring-0 text-slate-900 text-base px-4 py-3 placeholder:text-slate-400" 
                        placeholder="Search cuisines, restaurants, or bars..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button type="submit" className="bg-primary text-white px-8 rounded-lg font-bold hover:bg-primary/90 transition-all">
                        Search
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="categories" className="px-6 md:px-20 py-10 border-b border-primary/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight uppercase">Explore by Category</h2>
              <Link className="text-primary font-bold text-sm hover:underline" href="/restaurants">View All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[
                { name: 'Italian', icon: 'restaurant' },
                { name: 'Pubs', icon: 'sports_bar' },
                { name: 'Fine Dining', icon: 'dinner_dining' },
                { name: 'Bakeries', icon: 'bakery_dining' },
                { name: 'Coffee Shops', icon: 'local_cafe' }
              ].map((cat) => (
                <Link 
                  key={cat.name} 
                  href={`/restaurants?category=${cat.name}`}
                  className="flex shrink-0 items-center gap-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-4 cursor-pointer hover:border-primary transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-primary">{cat.icon}</span>
                  <span className="text-slate-900 dark:text-slate-100 font-semibold">{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="px-6 md:px-20 py-10 bg-primary/5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">trending_up</span>
                <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight uppercase">Trending Now</h2>
              </div>
              <Link href="/restaurants" className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1 hover:text-primary transition-colors">
                Full list <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingRestaurants.length > 0 ? (
                trendingRestaurants.map((res) => (
                  <TrendingCard 
                    key={res.id}
                    title={res.name} 
                    slug={res.slug}
                    category={res.cuisine_type?.[0] || 'Local Favorite'} 
                    rating={res.ratings?.tripadvisor?.value || "4.8"} 
                    desc={res.description_short} 
                    location={res.neighbourhood || 'Bermondsey'} 
                    price={'£'.repeat(res.price_range || 2)}
                    img={res.cover_image_url}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500 font-medium">Loading local gems...</div>
              )}
            </div>
          </section>

          <section className="px-6 md:px-20 py-20 bg-white dark:bg-background-dark">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight uppercase">Why Bermondish?</h2>
                <div className="space-y-8">
                  <Benefit icon="verified_user" title="Expert Curation" text="Our team personally visits every venue to ensure only the highest quality establishments make our directory." />
                  <Benefit icon="favorite" title="Locally Focused" text="We live and breathe Bermondsey. Our guides are built from the ground up by SE1 residents." />
                  <Benefit icon="event_available" title="Instant Reservations" text="Book your table directly through our platform with exclusive member-only benefits." />
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="aspect-square bg-primary/10 rounded-3xl relative overflow-hidden shadow-2xl">
                  <img 
                    className="absolute inset-0 w-full h-full object-cover rounded-3xl" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwPz_rB-Ok73HHju4K2eOuaffMenGgkus_TToZwkSKMrRE2FtydFj6oB7choNIkX95r0tgVtmmW0s7L2KkaAioC_UYlcmlAjBhs1x2P8v7p-8PsZfU6-V3YzLkoouIyeZbICVk4h1NsWD8mUBZoEB9CM0JrDozKy0huiKQVUTtQEij3IZ8-Tig33LRmN6OXbXDd2AIQl3BSy7sk_J4ZuSFkwOiw1Qts2U6HuMTt4JP7qywSOy5w7uQ2t6Ai0eU81DZXVL03p7GS05D" 
                    alt="People laughing and enjoying food at a restaurant"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border border-primary/10 max-w-[240px]">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="flex -space-x-2">
                          <div className="size-8 rounded-full border-2 border-white bg-slate-200" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop")', backgroundSize: 'cover' }}></div>
                          <div className="size-8 rounded-full border-2 border-white bg-slate-200" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop")', backgroundSize: 'cover' }}></div>
                       </div>
                       <span className="text-xs font-bold text-slate-500">5k+ Community</span>
                    </div>
                    <p className="text-sm font-medium italic text-slate-700 dark:text-slate-300">"The only guide you need for SE1 dining."</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function TrendingCard({ title, slug, category, rating, desc, location, price, img }: any) {
  return (
    <Link href={`/restaurants/${slug}`} className="group block">
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 h-full">
        <div className="relative h-56 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url("${img}")` }}
          />
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-primary border border-primary/10 shadow-sm">{category}</div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">{title}</h3>
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-sm font-bold">{rating}</span>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{desc}</p>
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
            <span className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">location_on</span> {location}
            </span>
            <span className="text-slate-900 dark:text-white font-black text-xs uppercase">{price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Benefit({ icon, title, text }: any) {
  return (
    <div className="flex gap-5">
      <div className="bg-primary/10 p-4 rounded-2xl shrink-0 h-fit text-primary shadow-sm shadow-primary/5">
        <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
      </div>
      <div>
        <h4 className="font-extrabold text-xl mb-1 uppercase tracking-tight">{title}</h4>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
