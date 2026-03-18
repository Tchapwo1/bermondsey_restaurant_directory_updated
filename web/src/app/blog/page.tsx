import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const supabase = await createClient();
  
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  // Fallback posts if none exist yet for demo
  const featuredPosts = posts?.length ? posts : [
    {
      id: '1',
      title: "Top 5 Secret Pasta Spots in Bermondsey",
      slug: "top-5-pasta-spots",
      excerpt: "Bermondsey Street is famous for its food, but these hidden gems are where the locals really go for their carbohydrate fix.",
      category: "Listicle",
      cover_image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800&q=80",
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: "Interview: Chef Roberto on the Future of SE1 Dining",
      slug: "interview-chef-roberto",
      excerpt: "We sat down with the mastermind behind 'The Drunken Pasta' to talk about seasonal sourcing and why Bermondsey is the UK's culinary heart.",
      category: "Interview",
      cover_image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80",
      created_at: new Date().toISOString()
    }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-background-dark overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/5 py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">Bermondish Blog</h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Insider guides, chef interviews, and the heart of SE1's culinary scene.</p>
          </div>
        </section>

        {/* Categories / Filter */}
        <section className="py-8 border-b border-primary/5 px-6">
           <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto scrollbar-hide">
              {['All', 'Listicles', 'Interviews', 'News', 'Reviews'].map(cat => (
                 <button key={cat} className="shrink-0 px-6 py-2 rounded-full border border-slate-200 text-sm font-bold hover:border-primary hover:text-primary transition-all">
                    {cat}
                 </button>
              ))}
           </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="h-full flex flex-col">
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-6 shadow-xl shadow-primary/5">
                      <Image 
                        src={post.cover_image} 
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10 shadow-sm">
                        {post.category}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-slate-500 font-medium mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-slate-400">
                         <span className="text-[10px] font-black uppercase tracking-widest">
                            {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                         </span>
                         <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
