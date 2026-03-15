"use client"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SubmitRestaurantPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      restaurant_name: formData.get('name'),
      slug: (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
      address: formData.get('address'),
      cuisine_type: [formData.get('cuisine')],
      price_range: parseInt(formData.get('price') as string),
      description_short: formData.get('description'),
      status: 'pending' // As per spec
    };

    const { error } = await supabase.from('restaurants').insert([data]);

    if (!error) {
      setSubmitted(true);
    } else {
      alert('Error submitting: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black mb-4 uppercase tracking-tight">List Your Restaurant</h1>
          <p className="text-slate-500 text-lg">Join the premier SE1 directory and connect with local diners.</p>
        </div>

        {submitted ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 p-8 rounded-2xl text-center">
             <span className="material-symbols-outlined text-6xl text-green-600 mb-4">check_circle</span>
             <h2 className="text-2xl font-bold mb-2">Submission Received!</h2>
             <p className="text-slate-600 dark:text-slate-400">Our team will review your application and notify you within 48 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-primary/10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-slate-500">Restaurant Name*</label>
                <input name="name" required className="rounded-lg border-slate-200" type="text" placeholder="e.g. The Bermondsey Bistro" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-slate-500">Cuisine Type*</label>
                <select name="cuisine" required className="rounded-lg border-slate-200">
                  <option value="Italian">Italian</option>
                  <option value="Spanish">Spanish</option>
                  <option value="British">British</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-slate-500">Address*</label>
              <input name="address" required className="rounded-lg border-slate-200" type="text" placeholder="123 Bermondsey Street, SE1" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-slate-500">Price Range*</label>
              <div className="flex gap-4">
                 {[1, 2, 3, 4].map(p => (
                   <label key={p} className="flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:border-primary peer-checked:bg-primary">
                     <input name="price" type="radio" value={p} className="hidden peer" required defaultChecked={p === 2} />
                     <span className="font-bold text-sm">{'£'.repeat(p)}</span>
                   </label>
                 ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-slate-500">Short Description*</label>
              <textarea name="description" required rows={3} className="rounded-lg border-slate-200" placeholder="Tell diners what makes you special..."></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Restaurant'}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
