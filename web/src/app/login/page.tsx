"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = view === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });

    if (authError) {
      setError(authError.message);
    } else {
      if (view === 'login') {
        router.push('/');
        router.refresh();
      } else {
        setView('login');
        setError('Verification email sent! Please check your inbox.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-primary/10 p-10 relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-orange-500 to-primary"></div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
              {view === 'login' ? 'Welcome Back' : 'Join Bermondish'}
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              {view === 'login' ? 'Sign in to manage your favorites and reviews.' : 'Create an account to explore SE1 like a local.'}
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-xl text-xs font-bold border ${
              error.includes('sent') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Email Address</label>
              <div className="relative">
                 <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">mail</span>
                 <input 
                  type="email" 
                  required 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
                {view === 'login' && (
                  <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</button>
                )}
              </div>
              <div className="relative">
                 <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">lock</span>
                 <input 
                  type="password" 
                  required 
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">autorenew</span>
              ) : (
                view === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-500 text-xs font-medium">
              {view === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                className="ml-2 text-primary font-black uppercase tracking-widest hover:underline"
              >
                {view === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
