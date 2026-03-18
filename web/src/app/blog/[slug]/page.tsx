import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  // For demo if DB is empty
  const demoPost = {
    title: "Top 5 Secret Pasta Spots in Bermondsey",
    category: "Listicle",
    cover_image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=1200",
    content: `
      <p className="text-xl font-medium mb-8 leading-relaxed">Bermondsey Street has long been a culinary destination, but beyond the well-known names lie some of London's most incredible Italian experiences.</p>
      
      <h2 className="text-3xl font-black uppercase tracking-tight mt-12 mb-6">1. The Drunken Pasta</h2>
      <p className="mb-6 leading-relaxed">Located in a converted railway arch, this spot focuses on tradition with a twist. Their carbonara is legendary among SE1 residents.</p>
      
      <h2 className="text-3xl font-black uppercase tracking-tight mt-12 mb-6">2. Flour & Grape</h2>
      <p className="mb-6 leading-relaxed">While not a 'secret' per se, their seasonal menu always surprises. Pro tip: Arrive early to avoid the queue.</p>
      
      <blockquote>"Food is the soul of Bermondsey. Every archway tells a story." - Roberto, Head Chef</blockquote>
    `,
    created_at: new Date().toISOString()
  };

  const currentPost = (post || (slug === 'top-5-pasta-spots' ? demoPost : null));

  if (!currentPost) {
    return notFound();
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-background-dark overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <article>
           {/* Post Header */}
           <header className="max-w-4xl mx-auto px-6 py-20 text-center">
              <div className="mb-6 inline-block bg-primary/5 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest text-primary border border-primary/10">
                 {currentPost.category}
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8">
                 {currentPost.title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                 <span>{new Date(currentPost.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                 <span>•</span>
                 <span>5 min read</span>
              </div>
           </header>

           {/* Hero Image */}
           <div className="max-w-6xl mx-auto px-6 mb-20">
              <div className="relative aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl">
                 <Image 
                    src={currentPost.cover_image} 
                    alt={currentPost.title}
                    fill
                    className="object-cover"
                 />
              </div>
           </div>

           {/* Content */}
           <div className="max-w-3xl mx-auto px-6 pb-32">
              <div 
                className="prose prose-xl prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: currentPost.content }}
              />
              
              <div className="mt-20 pt-10 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-slate-100" />
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest text-primary">Written By</p>
                       <p className="font-bold">Bermondish Editorial</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button className="size-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary/5 transition-colors">
                       <span className="material-symbols-outlined text-sm">share</span>
                    </button>
                 </div>
              </div>
           </div>
        </article>

        {/* Suggestion Section */}
        <section className="bg-slate-50 py-24 px-6">
           <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-12">More from the Blog</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  {/* Reuse some preview cards here or simplified ones */}
                  <Link href="/blog" className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-1 transition-all">
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Back to Blog</p>
                     <h3 className="text-xl font-black uppercase tracking-tight">Explore all guides and interviews</h3>
                  </Link>
              </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
