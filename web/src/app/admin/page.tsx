"use client"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, active: 0 });

  useEffect(() => {
    // Middleware handles route protection and role check server-side.
    // We add a client-side check for defense-in-depth and better UX.
    checkRole();
  }, []);

  async function checkRole() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login?error=Session Expired');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      router.push('/login?error=Access Denied');
      return;
    }

    await fetchRestaurants();
  }

  async function fetchRestaurants() {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      setRestaurants(data);
      setStats({
        pending: data.filter(r => r.status === 'pending').length,
        active: data.filter(r => r.status === 'active').length
      });
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('restaurants')
      .update({ status })
      .eq('id', id);

    if (!error) {
      fetchRestaurants();
    } else {
      alert('Error updating status: ' + error.message);
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-slate-500 font-medium">Manage restaurant submissions and directory listings.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-sm border border-primary/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Pending</span>
                <span className="text-2xl font-black text-orange-500">{stats.pending}</span>
             </div>
             <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-sm border border-primary/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Active</span>
                <span className="text-2xl font-black text-green-500">{stats.active}</span>
             </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
             <span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-primary/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Restaurant</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Cuisine</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {restaurants.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-6">
                        <div className="font-bold text-slate-900 dark:text-white mb-1">{res.name}</div>
                        <div className="text-xs text-slate-500 font-medium">{res.address}</div>
                      </td>
                      <td className="px-6 py-6 font-medium text-slate-600 dark:text-slate-400">
                         {res.cuisine_type?.join(', ') || 'N/A'}
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          res.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 
                          res.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {res.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex justify-end gap-2">
                           {res.status !== 'active' && (
                             <button 
                               onClick={() => updateStatus(res.id, 'active')}
                               className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors shadow-lg shadow-green-500/20"
                               title="Approve"
                             >
                               <span className="material-symbols-outlined text-sm">check</span>
                             </button>
                           )}
                           {res.status !== 'pending' && (
                             <button 
                               onClick={() => updateStatus(res.id, 'pending')}
                               className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors shadow-lg shadow-orange-500/20"
                               title="Set to Pending"
                             >
                               <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                             </button>
                           )}
                           <button 
                             onClick={() => updateStatus(res.id, 'rejected')}
                             className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-lg shadow-red-500/20"
                             title="Reject"
                           >
                             <span className="material-symbols-outlined text-sm">close</span>
                           </button>
                           <Link 
                            href={`/restaurants/${res.slug}`}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 p-2 rounded-lg transition-colors"
                            title="View"
                           >
                             <span className="material-symbols-outlined text-sm">visibility</span>
                           </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {restaurants.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                        No restaurants found in the directory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
