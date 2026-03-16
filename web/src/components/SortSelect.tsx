"use client"

import { useRouter } from 'next/navigation';

interface SortSelectProps {
  defaultValue: string;
}

export default function SortSelect({ defaultValue }: SortSelectProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    const url = new URL(window.location.href);
    url.searchParams.set('sort', sort);
    router.push(url.pathname + url.searchParams.toString() ? `?${url.searchParams.toString()}` : '');
  };

  return (
    <select 
      name="sort"
      onChange={handleChange}
      defaultValue={defaultValue}
      className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer text-slate-900 dark:text-white py-1"
    >
      <option value="name">Name (A-Z)</option>
      <option value="rating">Rating (High-Low)</option>
      <option value="rating_low">Rating (Low-High)</option>
    </select>
  );
}
