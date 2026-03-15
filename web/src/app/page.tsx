"use client"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
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
                    <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                      Find your next meal in Bermondsey
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                      Discover the finest dining experiences, hidden gems, and local favorites in the heart of London SE1.
                    </p>
                  </div>
                  <div className="w-full max-w-2xl mt-4">
                    <div className="flex items-stretch bg-white rounded-xl p-2 shadow-2xl">
                      <div className="flex items-center pl-4 text-slate-400">
                        <span className="material-symbols-outlined">search</span>
                      </div>
                      <input 
                        className="flex-1 border-none focus:ring-0 text-slate-900 text-base px-4 py-3 placeholder:text-slate-400" 
                        placeholder="Search cuisines, restaurants, or bars..." 
                      />
                      <button className="bg-primary text-white px-8 rounded-lg font-bold hover:bg-primary/90 transition-all">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="categories" className="px-6 md:px-20 py-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">Explore by Category</h2>
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
                <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight">Trending Now</h2>
              </div>
              <Link href="/restaurants" className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1 hover:text-primary">
                Full list <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Manual Placeholder for now, later fetch from Supabase */}
              <TrendingCard 
                title="The Pasta Room" 
                category="ITALIAN" 
                rating="4.9" 
                desc="Authentic handmade pasta using heritage flour and seasonal British ingredients." 
                location="Bermondsey St" 
                price="£££"
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuCb6qKVXMI5iALzHY0cxyte-AQl47mzKWe_ui7aZ45Bpmk9iC-URMXYIWsKnghYzLXnP6ZgT3bhLKWEwXiAcQtkXxRes7ZdJ2B3unQD34kAjqRsMMdahW3h0ptvKd3WCcbioT_5Qd0vdd43UvC7rbg-T4CEaFbPA_JEdoa0_uyWfrMd0aOhiKpufHk0l9aqEDOlc9CUvaqOdLTwqfp2_-5ExydF-eENtcn9OgfEY_EnKAXHsHVJBYPfELSSPhnpY5PkR6NurCr4HR8U"
              />
              <TrendingCard 
                title="The Antelope" 
                category="PUB" 
                rating="4.7" 
                desc="A local staple known for craft ales and the best Sunday roast in SE1." 
                location="Abbey St" 
                price="££"
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuD39xFGoi1gQMuGfVlbHm-viSX88lex9lp93q17I56U5xaidbqlCrcnyjqK1u5R6fAP2TXZzf8c-84pdIAWx5d635rE3iqskMyKl39JRh66iLQxf0mqtz0aEjtLO4oowJdaFiWtmZAC4S4Ks2OUCWqzAssqrrK8qNkV0n-mh1ZDnIJn1SUDQIiR-Vib792RdHaY40_v0BAy2sYhpRWrlOfqC0Y1tgwTwGHuiG_7OyAMWiXgp7gXxzjYclwuE5ou2wQyyyg12Ku0Cul1"
              />
              <TrendingCard 
                title="Lumina" 
                category="FINE DINING" 
                rating="5.0" 
                desc="Elevated tasting menus that celebrate the intersection of art and cuisine." 
                location="Snowfields" 
                price="££££"
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuBUGKKQQZSg75zqxuE_Upj5w7_12oonf0xzzOgXVM7pzyHz9WF0z7U4ALWdcjekTgWe0nQ2l-3cFPZ077Q74ifkj8Fy7MyIirfp9w46Dc6VTiKnd4pEtbK4_cq5g9dHaxcV374WujiYV7BwJTBg98jJP2s0dVCydxhubJg0xmKVAqJ7dIrRqUGgWjNRzZCzsGH-thXv8FG5oXS5NmwwAMPoqiq_x5FRcrAzcMFkGxDhmDDFW0Vz8a1RRzKyhko1XhZ84A98Sku_SM0i"
              />
            </div>
          </section>

          <section className="px-6 md:px-20 py-20 bg-white dark:bg-background-dark">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Why Bermondish?</h2>
                <div className="space-y-8">
                  <Benefit icon="verified_user" title="Expert Curation" text="Our team personally visits every venue to ensure only the highest quality establishments make our directory." />
                  <Benefit icon="favorite" title="Locally Focused" text="We live and breathe Bermondsey. Our guides are built from the ground up by SE1 residents." />
                  <Benefit icon="event_available" title="Instant Reservations" text="Book your table directly through our platform with exclusive member-only benefits." />
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="aspect-square bg-primary/10 rounded-3xl relative overflow-hidden">
                  <img 
                    className="absolute inset-0 w-full h-full object-cover rounded-3xl" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwPz_rB-Ok73HHju4K2eOuaffMenGgkus_TToZwkSKMrRE2FtydFj6oB7choNIkX95r0tgVtmmW0s7L2KkaAioC_UYlcmlAjBhs1x2P8v7p-8PsZfU6-V3YzLkoouIyeZbICVk4h1NsWD8mUBZoEB9CM0JrDozKy0huiKQVUTtQEij3IZ8-Tig33LRmN6OXbXDd2AIQl3BSy7sk_J4ZuSFkwOiw1Qts2U6HuMTt4JP7qywSOy5w7uQ2t6Ai0eU81DZXVL03p7GS05D" 
                    alt="People laughing and enjoying food at a restaurant"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-[240px]">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="flex -space-x-2">
                          <div className="size-8 rounded-full border-2 border-white bg-slate-200" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC5HYAP-84pwbAYUwrZSnFDkPOo91qDzyZcevB26v-UNw73VaoU5ZoIyqaLkHDVQvjobhWYCmybtKGzqAEuaH932r2Qqs38_jzCnCRG6FdRyn4jfvAX79pm1uBjBdI2CfdGeM5SPjylNLirsS-2_j9SQg2ztXUSkzAHLJThwRTUQepjSBhroMnL7dx7hifqOb0SBoCaa7w5tZcRHwn8tJBFDE83thX_BKt7YeR86p2L05TfcXEGQRhmsRFB-SB5f2UoTgPhw9Bh2xXA")' }}></div>
                          <div className="size-8 rounded-full border-2 border-white bg-slate-200" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDU7OMFWqmnTWfyuyetIFHb_jN_sWES1GSaVYEdtIh8LqJCQpm2ZD3M7WffGyhUDyg02LXRNQ3BAimDP0ytZqIa6MtEF6evYAtD1lDffEk0DgGijhJ7TLApky_-w-5cZpa2HSXBV300tRiLNZYwVAVn8IryusUeEzyLdnlunqWXpA0IWlbDNsjZ36mm41X-SjuQNNufs7ZDQtN1cLT8jn-tCyzjG2vfLvQhOiyX3N-Mjq9BwkQpiltzkDQQII5y63f4TfkvoV7XnRtb")' }}></div>
                       </div>
                       <span className="text-xs font-bold text-slate-500">5k+ Users</span>
                    </div>
                    <p className="text-sm font-medium italic">"The only guide you need for SE1 dining."</p>
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

function TrendingCard({ title, category, rating, desc, location, price, img }: any) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700">
      <div 
        className="relative h-56 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
        style={{ backgroundImage: `url("${img}")` }}
      >
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">{category}</div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          <div className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-sm fill-current">star</span>
            <span className="text-sm font-bold">{rating}</span>
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{desc}</p>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">location_on</span> {location}
          </span>
          <span className="text-slate-900 dark:text-white font-bold text-sm">{price}</span>
        </div>
      </div>
    </div>
  );
}

function Benefit({ icon, title, text }: any) {
  return (
    <div className="flex gap-4">
      <div className="bg-primary/10 p-3 rounded-xl shrink-0 h-fit">
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-1">{title}</h4>
        <p className="text-slate-600 dark:text-slate-400">{text}</p>
      </div>
    </div>
  );
}
