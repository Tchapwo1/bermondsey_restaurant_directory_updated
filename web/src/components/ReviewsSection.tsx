"use client"
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Review {
  id: number;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    email: string;
  }
}

export default function ReviewsSection({ restaurantId }: { restaurantId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchReviews();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, [restaurantId]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(email)')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to leave a review!');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('reviews')
      .insert([
        { 
          restaurant_id: restaurantId, 
          user_id: user.id, 
          rating, 
          comment 
        }
      ]);

    if (!error) {
      setComment('');
      setRating(5);
      fetchReviews();
    } else {
      alert('Error submitting review: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <section className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">chat</span>
          Community Reviews
        </h3>
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-2">Average</span>
              <span className="text-sm font-black text-primary">
                 {reviews.length > 0 
                   ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                   : '0.0'}
              </span>
           </div>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{reviews.length} Reviews</span>
        </div>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-primary/10 shadow-xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`size-10 rounded-lg flex items-center justify-center transition-all ${
                    rating >= star ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Your Comment</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="What was your favorite dish? How was the service?"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Post Review'}
          </button>
        </form>
      ) : (
        <div className="p-10 bg-slate-100 dark:bg-slate-800/50 rounded-3xl text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
           <p className="text-slate-500 font-medium mb-6">Sign in to share your dining experience with the community.</p>
           <a href="/login" className="inline-block px-8 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-sm hover:shadow-md transition-all">Sign In to Review</a>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm hover:border-primary/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-xs">
                  {review.profiles?.email?.[0] || 'U'}
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">{review.profiles?.email?.split('@')[0]}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`material-symbols-outlined text-xs ${i < review.rating ? 'text-yellow-500' : 'text-slate-200'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
              "{review.comment}"
            </p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="py-12 text-center text-slate-400 font-medium">
             Be the first to review this restaurant!
          </div>
        )}
      </div>
    </section>
  );
}
