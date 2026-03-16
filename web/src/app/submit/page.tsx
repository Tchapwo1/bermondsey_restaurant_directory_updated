"use client"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SubmitRestaurantPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const uploadImages = async (folderName: string) => {
    const urls: string[] = [];
    for (const file of files) {
      const fileName = `${folderName}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('restaurant-images')
        .upload(fileName, file);
      
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('restaurant-images')
          .getPublicUrl(fileName);
        urls.push(publicUrl);
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    // Upload images first
    const uploadedUrls = await uploadImages(slug);

    const data = {
      name: name,
      slug: slug,
      address: formData.get('address'),
      cuisine_type: [formData.get('cuisine')],
      price_range: parseInt(formData.get('price') as string),
      description_short: formData.get('description'),
      cover_image_url: uploadedUrls[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      gallery_images: uploadedUrls,
      status: 'pending'
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
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-slate-50 dark:bg-background-dark">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">List Your Restaurant</h1>
          <p className="text-slate-500 text-lg font-medium">Join the premier SE1 directory and connect with local diners in Bermondsey.</p>
        </div>

        {submitted ? (
          <div className="bg-white dark:bg-slate-900 border border-green-100 p-12 rounded-3xl text-center shadow-2xl">
             <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
             </div>
             <h2 className="text-3xl font-black mb-4 uppercase">Submission Received!</h2>
             <p className="text-slate-500 font-medium max-w-sm mx-auto">Our team will review your application and notify you via email within 48 hours. Thank you for joining the SE1 community!</p>
             <Link href="/restaurants" className="mt-10 inline-block px-10 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-primary/20">Return to Directory</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-primary/5 shadow-2xl space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tight border-b border-slate-50 dark:border-slate-800 pb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">restaurant_menu</span>
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Restaurant Name</label>
                  <input name="name" required className="rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20" type="text" placeholder="e.g. The Bermondsey Bistro" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cuisine Type</label>
                  <select name="cuisine" required className="rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20">
                    <option value="Italian">Italian</option>
                    <option value="Spanish">Spanish</option>
                    <option value="British">British</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Address</label>
                <input name="address" required className="rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20" type="text" placeholder="123 Bermondsey Street, SE1" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Price Range</label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map(p => (
                    <label key={p} className="flex-1">
                      <input name="price" type="radio" value={p} className="hidden peer" required defaultChecked={p === 2} />
                      <div className="flex items-center justify-center p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl cursor-pointer hover:border-primary transition-all peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:text-primary">
                        <span className="font-black text-xs">{'£'.repeat(p)}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Short Description</label>
                <textarea name="description" required rows={4} className="rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20" placeholder="Tell diners what makes your SE1 spot unique..."></textarea>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-primary/5 shadow-2xl space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tight border-b border-slate-50 dark:border-slate-800 pb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_a_photo</span>
                Visuals & Photos
              </h3>
              
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Upload Photos (Max 5)</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 transition-colors hover:border-primary flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">cloud_upload</span>
                  <p className="text-sm font-medium text-slate-500 mb-4">Drag and drop or click to upload</p>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden" 
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer bg-slate-100 dark:bg-slate-800 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-200">
                    Select Files
                  </label>
                </div>
                
                {previews.length > 0 && (
                  <div className="grid grid-cols-5 gap-4 mt-4">
                    {previews.map((url, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden relative shadow-sm">
                         <img src={url} className="w-full h-full object-cover" alt="preview" />
                         <button 
                          type="button"
                          onClick={() => {
                            setFiles(files.filter((_, idx) => idx !== i));
                            setPreviews(previews.filter((_, idx) => idx !== i));
                          }}
                          className="absolute top-1 right-1 size-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                         >
                           <span className="material-symbols-outlined text-[10px]">close</span>
                         </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white font-black uppercase tracking-widest text-sm py-5 rounded-2xl hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-lg">autorenew</span>
                  <span>Uploading & Processing...</span>
                </div>
              ) : 'List My Restaurant'}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
