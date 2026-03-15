import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantCard from '@/components/RestaurantCard';

export default async function RestaurantsPage() {
  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching restaurants:', error);
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-200">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <a className="hover:text-primary" href="/">Home</a>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">Restaurants</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Explore Restaurants in Bermondsey</h1>
          <p className="text-slate-600 dark:text-slate-400">Discover {restaurants?.length || 0} curated dining spots from local hidden gems to world-class cuisine.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Placeholder for now */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase tracking-wide">
                <span className="material-symbols-outlined text-primary">lunch_dining</span>
                Cuisine
              </h2>
              <div className="space-y-3">
                {['Italian', 'Spanish', 'French', 'Pubs', 'Japanese'].map(cuisine => (
                   <label key={cuisine} className="flex items-center gap-3 cursor-pointer group">
                    <input className="rounded text-primary focus:ring-primary border-slate-300" type="checkbox"/>
                    <span className="group-hover:text-primary transition-colors">{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase tracking-wide">
                <span className="material-symbols-outlined text-primary">payments</span>
                Price Range
              </h2>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(p => (
                  <button key={p} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-all text-sm font-semibold">
                    {'£'.repeat(p)}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full py-3 px-4 bg-primary text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20">
              Apply Filters
            </button>
          </aside>

          {/* Restaurant Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <p className="text-sm font-medium">Showing <span className="text-primary">{restaurants?.length || 0}</span> restaurants</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
                <select className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer">
                  <option>Most Popular</option>
                  <option>A-Z</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {restaurants?.map((res) => (
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
