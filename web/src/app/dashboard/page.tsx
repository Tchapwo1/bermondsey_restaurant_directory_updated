"use client"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OwnerDashboard() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login?error=Session Expired');
      return;
    }
    setUser(user);

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Allow owners and admins to see this dashboard
    if (!profile || (profile.role !== 'owner' && profile.role !== 'admin')) {
      // If they are just a 'user', maybe they want to become an owner?
      // For now, redirect or show "Not an owner"
      // router.push('/login?error=Access Denied');
      // return;
    }

    await fetchMyRestaurants(user.id);
  }

  async function fetchMyRestaurants(userId: string) {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*, analytics(count)')
      .eq('owner_id', userId)
      .order('name', { ascending: true });

    if (!error && data) {
      setRestaurants(data);
    }
    setLoading(false);
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Owner Dashboard</h1>
            <p className="text-slate-500 font-medium">Manage your restaurant listings and view performance.</p>
          </div>
          <div className="flex gap-4">
             <Link 
                href="/submit" 
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
             >
                <span className="material-symbols-outlined">add</span>
                List New Restaurant
             </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
             <span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((res) => (
              <div key={res.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-primary/5 overflow-hidden flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={res.cover_image_url} 
                    alt={res.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-primary border border-primary/10">
                    {res.status}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-2">{res.name}</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Book Clicks</span>
                      <span className="text-2xl font-black text-primary">{res.analytics?.[0]?.count || 0}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto flex gap-3">
                    <Link 
                      href={`/dashboard/${res.id}/edit`}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit
                    </Link>
                    <Link 
                      href={`/restaurants/${res.slug}`}
                      className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary font-bold py-3 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {restaurants.length === 0 && (
              <div className="col-span-full bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-slate-800 mb-4">restaurant</span>
                <h3 className="text-xl font-bold mb-2">No restaurants yet</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't listed any restaurants or been assigned as an owner yet.</p>
                <Link 
                  href="/submit" 
                  className="inline-flex bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
