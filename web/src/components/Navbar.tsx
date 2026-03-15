import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-20 py-4 bg-white dark:bg-background-dark sticky top-0 z-50">
      <div className="flex items-center gap-4 text-primary">
        <div className="size-6">
          <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
          </svg>
        </div>
        <h2 className="text-slate-900 dark:text-slate-100 text-xl font-black leading-tight tracking-tight uppercase">BERMONDISH</h2>
      </div>
      <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
        <nav className="flex items-center gap-8">
          <Link className="text-slate-700 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="/restaurants">Restaurants</Link>
          <Link className="text-slate-700 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="/#categories">Categories</Link>
          <Link className="text-slate-700 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#">Events</Link>
          <Link className="text-slate-700 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="/about">About</Link>
          <Link className="text-slate-700 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="/submit">List Restaurant</Link>
        </nav>
        <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
          <span>Sign In</span>
        </button>
      </div>
      <div className="md:hidden">
        <span className="material-symbols-outlined text-slate-900 dark:text-white">menu</span>
      </div>
    </header>
  );
}
