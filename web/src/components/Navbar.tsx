"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(profile?.role === 'admin');
      }
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(profile?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-20 py-4 bg-white dark:bg-background-dark sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-4 text-primary hover:opacity-90 transition-opacity">
        <div className="size-6">
          <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
          </svg>
        </div>
        <h2 className="text-slate-900 dark:text-slate-100 text-xl font-black leading-tight tracking-tight uppercase">BERMONDISH</h2>
      </Link>
      <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
        <nav className="flex items-center gap-8">
          <Link className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors" href="/restaurants">Restaurants</Link>
          <Link className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors" href="/#categories">Categories</Link>
          <Link className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors" href="/about">About</Link>
          <Link className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors" href="/submit">List Restaurant</Link>
        </nav>
        
        {user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-slate-100 dark:border-slate-800">
             {isAdmin && (
               <Link href="/admin" className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-100 hover:bg-orange-100 transition-colors">
                 Admin Dashboard
               </Link>
             )}
             <Link href="/favorites" className="flex flex-col items-end group">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary group-hover:underline">My Favorites</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{user.email}</span>
             </Link>
             <button 
              onClick={handleSignOut}
              className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
              title="Sign Out"
             >
               <span className="material-symbols-outlined text-sm">logout</span>
             </button>
          </div>
        ) : (
          <Link 
            href="/login"
            className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-xl h-11 px-6 bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Sign In
          </Link>
        )}
      </div>
      <div className="md:hidden">
        <span className="material-symbols-outlined text-slate-900 dark:text-white">menu</span>
      </div>
    </header>
  );
}
