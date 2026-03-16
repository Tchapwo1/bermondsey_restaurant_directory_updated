"use client"
import dynamicImport from 'next/dynamic';

const RestaurantMap = dynamicImport(() => import('./RestaurantMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-3xl flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest">Loading Interactive Map...</div>
});

export default RestaurantMap;
