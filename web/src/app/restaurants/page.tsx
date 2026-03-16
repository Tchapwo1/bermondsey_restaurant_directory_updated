import { createClient } from '@/lib/supabase-server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantCard from '@/components/RestaurantCard';
import Link from 'next/link';
import MapClient from '@/components/MapClient';

// No longer needs local dynamicImport as it's handled in MapClient

export const dynamic = 'force-dynamic';

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string; price?: string; sort?: string; view?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const query = params.query;
  const category = params.category;
  const price = params.price ? parseInt(params.price) : undefined;
  const sort = params.sort || 'name';
  const view = params.view || 'grid';

  let supabaseQuery = supabase.from('restaurants').select('*');

  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description_short.ilike.%${query}%`);
  }

  if (category) {
    supabaseQuery = supabaseQuery.contains('cuisine_type', [category]);
  }

  if (price) {
    supabaseQuery = supabaseQuery.eq('price_range', price);
  }

  // Handle status if applicable (e.g. only show active)
  // supabaseQuery = supabaseQuery.eq('status', 'active');

  // Apply sorting
  if (sort === 'rating') {
    // Rating is stored in a JSONB field: ratings->tripadvisor->value
    supabaseQuery = supabaseQuery.order('ratings->tripadvisor->value', { ascending: false });
  } else if (sort === 'rating_low') {
    supabaseQuery = supabaseQuery.order('ratings->tripadvisor->value', { ascending: true });
  } else {
    supabaseQuery = supabaseQuery.order('name', { ascending: true });
  }

  const { data: restaurants, error } = await supabaseQuery;

  if (error) {
    console.error('Error fetching restaurants:', error);
  }

  const getFilterUrl = (extraParams: Record<string, string | number | undefined | null>) => {
    const newParams = new URLSearchParams();
    if (query) newParams.set('query', query);
    if (category) newParams.set('category', category);
    if (price) newParams.set('price', price.toString());
    if (sort && sort !== 'name') newParams.set('sort', sort);

    Object.entries(extraParams).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });

    return `/restaurants?${newParams.toString()}`;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-200">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link className="hover:text-primary transition-colors" href="/">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold uppercase tracking-tight">Restaurants</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
                {query ? `Search: ${query}` : category ? `${category} Restaurants` : 'All Restaurants'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Discover {restaurants?.length || 0} curated dining spots in Bermondsey.</p>
            </div>
            {/* Quick Internal Search Bar */}
            <div className="w-full md:w-auto">
              <form action="/restaurants" className="flex items-center bg-white dark:bg-slate-900 rounded-xl px-4 py-2 border border-primary/10 shadow-sm">
                <span className="material-symbols-outlined text-slate-400 mr-2">search</span>
                <input 
                  name="query"
                  placeholder="Filter results..." 
                  className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full md:w-48"
                  defaultValue={query}
                />
                {category && <input type="hidden" name="category" value={category} />}
                {price && <input type="hidden" name="price" value={price} />}
                {sort && <input type="hidden" name="sort" value={sort} />}
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-xl">
              <h2 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-tight">
                <span className="material-symbols-outlined text-primary">lunch_dining</span>
                Cuisine
              </h2>
              <div className="space-y-3">
                {['Italian', 'Spanish', 'French', 'Pubs', 'Japanese'].map(cuis => (
                   <Link 
                    key={cuis} 
                    href={getFilterUrl({ category: category === cuis ? undefined : cuis })}
                    className={`flex items-center gap-3 group transition-colors ${category === cuis ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                   >
                    <div className={`size-2 rounded-full ${category === cuis ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'} group-hover:bg-primary transition-colors`}></div>
                    <span className="group-hover:text-primary transition-colors">{cuis}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-xl">
              <h2 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-tight">
                <span className="material-symbols-outlined text-primary">payments</span>
                Price Range
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map(p => (
                  <Link 
                    key={p} 
                    href={getFilterUrl({ price: price === p ? undefined : p })}
                    className={`py-2 text-center rounded-lg border transition-all text-xs font-bold uppercase tracking-widest ${price === p ? 'bg-primary text-white border-primary' : 'border-slate-100 dark:border-slate-800 hover:border-primary hover:text-primary'}`}
                  >
                    {'£'.repeat(p)}
                  </Link>
                ))}
              </div>
            </div>

            {(query || category || price || (sort && sort !== 'name')) && (
               <Link href="/restaurants" className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors">
                 <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                 Clear all filters
               </Link>
            )}
          </aside>

          {/* Restaurant Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-slate-900/50 p-2 rounded-2xl border border-primary/5">
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                 <Link 
                  href={getFilterUrl({ view: 'grid' })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'grid' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   <span className="material-symbols-outlined text-sm">grid_view</span>
                   Grid
                 </Link>
                 <Link 
                  href={getFilterUrl({ view: 'map' })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'map' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   <span className="material-symbols-outlined text-sm">map</span>
                   Map
                 </Link>
              </div>

              <div className="flex items-center gap-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span className="text-primary">{restaurants?.length || 0}</span> results
                </p>
                <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort:</span>
                  <form action="/restaurants" method="get">
                    {query && <input type="hidden" name="query" value={query} />}
                    {category && <input type="hidden" name="category" value={category} />}
                    {price && <input type="hidden" name="price" value={price} />}
                    {view && <input type="hidden" name="view" value={view} />}
                    <select 
                      name="sort"
                      onChange={(e) => e.target.form?.submit()}
                      defaultValue={sort}
                      className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer text-slate-900 dark:text-white py-1"
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="rating">Rating (High-Low)</option>
                      <option value="rating_low">Rating (Low-High)</option>
                    </select>
                  </form>
                </div>
              </div>
            </div>

            {view === 'map' ? (
              <MapClient restaurants={restaurants || []} />
            ) : (
              <>
                {restaurants && restaurants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {restaurants.map((res) => (
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
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="bg-primary/5 p-6 rounded-full mb-6">
                      <span className="material-symbols-outlined text-6xl text-primary/30">search_off</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">No restaurants found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">We couldn't find anything matching your search. Try a different keyword or browse all restaurants.</p>
                    <Link href="/restaurants" className="mt-8 px-8 py-3 bg-primary text-white font-black rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-primary/20">Back to all</Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

