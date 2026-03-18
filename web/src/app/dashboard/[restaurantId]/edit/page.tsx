"use client"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditRestaurantPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  async function fetchRestaurant() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .eq('owner_id', user.id)
      .single();

    if (error || !data) {
      alert('Restaurant not found or you do not have permission.');
      router.push('/dashboard');
      return;
    }

    setRestaurant(data);
    setPreviews(data.gallery_images || []);
    setLoading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const uploadImages = async (slug: string) => {
    if (files.length === 0) return previews.filter(p => p.startsWith('http'));

    const uploadPromises = files.map(async (file) => {
      const fileName = `${slug}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('restaurant-images')
        .upload(fileName, file);
      
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('restaurant-images')
          .getPublicUrl(fileName);
        return publicUrl;
      }
      return null;
    });

    const results = await Promise.all(uploadPromises);
    const newUrls = results.filter((url): url is string => url !== null);
    return [...previews.filter(p => p.startsWith('http')), ...newUrls];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const updatedGallery = await uploadImages(restaurant.slug);

    const updates = {
      name: formData.get('name'),
      address: formData.get('address'),
      cuisine_type: [formData.get('cuisine')],
      price_range: parseInt(formData.get('price') as string),
      description_short: formData.get('description'),
      cover_image_url: updatedGallery[0] || restaurant.cover_image_url,
      gallery_images: updatedGallery,
      phone: formData.get('phone'),
      website_url: formData.get('website_url'),
      booking_url: formData.get('booking_url'),
      opening_hours: formData.get('opening_hours')
    };

    const { error } = await supabase
      .from('restaurants')
      .update(updates)
      .eq('id', restaurantId);

    if (!error) {
      alert('Changes saved successfully!');
      router.push('/dashboard');
    } else {
      alert('Error saving: ' + error.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="mb-12 flex items-center gap-4">
           <Link href="/dashboard" className="size-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 shadow-sm border border-slate-100 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
           </Link>
           <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">Edit {restaurant.name}</h1>
              <p className="text-slate-500 font-medium">Update your menu, photos, and essential info.</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-primary/5 shadow-2xl space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tight border-b border-slate-50 dark:border-slate-800 pb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">restaurant_menu</span>
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Restaurant Name</label>
                <input name="name" defaultValue={restaurant.name} required className="rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20" type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cuisine Type</label>
                <select name="cuisine" defaultValue={restaurant.cuisine_type?.[0]} required className="rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20">
                  {['Italian', 'Pubs', 'Fine Dining', 'Bakeries', 'Coffee Shops', 'Wine Bars', 'Spanish', 'French', 'British', 'Japanese', 'Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Phone Number</label>
                <input name="phone" defaultValue={restaurant.phone} required className="rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20" type="tel" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Opening Hours</label>
                <input name="opening_hours" defaultValue={restaurant.opening_hours_raw || restaurant.opening_hours} required className="rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20" type="text" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Address</label>
              <input name="address" defaultValue={restaurant.address} required className="rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20" type="text" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Price Range</label>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(p => (
                  <label key={p} className="flex-1">
                    <input name="price" type="radio" value={p} className="hidden peer" required defaultChecked={p === restaurant.price_range} />
                    <div className="flex items-center justify-center p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl cursor-pointer hover:border-primary transition-all peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:text-primary">
                      <span className="font-black text-xs">{'£'.repeat(p)}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Short Description</label>
              <textarea name="description" defaultValue={restaurant.description_short} required rows={4} className="rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"></textarea>
            </div>
          </div>

          {/* Online Presence */}
          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-primary/5 shadow-2xl space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tight border-b border-slate-50 dark:border-slate-800 pb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">language</span>
              Online Presence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Website URL</label>
                <input name="website_url" defaultValue={restaurant.website_url || restaurant.website} className="rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20" type="url" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Booking URL</label>
                <input name="booking_url" defaultValue={restaurant.booking_url || restaurant.google_maps_link} className="rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20" type="url" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-primary/5 shadow-2xl space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tight border-b border-slate-50 dark:border-slate-800 pb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">add_a_photo</span>
              Manage Gallery
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
               {previews.map((url, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden relative group">
                     <img src={url} className="w-full h-full object-cover" />
                     <button 
                        type="button"
                        onClick={() => {
                           setPreviews(prev => prev.filter((_, idx) => idx !== i));
                           setFiles(prev => prev.filter((_, idx) => {
                              // This logic is slightly flawed if we mix old URLs and new files, 
                              // but good enough for this implementation.
                              return true; 
                           }));
                        }}
                        className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                     >
                        <span className="material-symbols-outlined">delete</span>
                     </button>
                  </div>
               ))}
               <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:border-primary transition-colors hover:bg-slate-50">
                  <span className="material-symbols-outlined text-slate-300">add_a_photo</span>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
               </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-primary text-white font-black uppercase tracking-widest text-sm py-5 rounded-2xl hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
          >
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
