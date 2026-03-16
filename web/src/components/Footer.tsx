import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white px-6 md:px-20 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-4 text-primary mb-6 hover:opacity-90 transition-opacity">
            <div className="size-6">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
              </svg>
            </div>
            <h2 className="text-white text-xl font-black tracking-tight uppercase">BERMONDISH</h2>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">The premier restaurant directory and lifestyle guide for Bermondsey, London.</p>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-slate-500">Quick Links</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            <li><Link className="hover:text-primary transition-colors" href="/restaurants">Find Restaurants</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/about">Our Story</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/submit">Add Business</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/contact">Contact Us</Link></li>
            <li><Link className="hover:text-primary transition-colors opacity-50 hover:opacity-100" href="/admin">Admin Console</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-slate-500">Categories</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            <li><Link className="hover:text-primary transition-colors" href="/restaurants?category=Italian">Italian Dining</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/restaurants?category=Pubs">Traditional Pubs</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/restaurants?category=Wine+Bars">Wine Bars</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/restaurants?category=Bakeries">Local Bakeries</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-slate-500">Stay Updated</h4>
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">Join our newsletter for the latest restaurant openings and events in SE1.</p>
          <form className="flex gap-2">
            <input required className="bg-slate-800 border-none rounded-lg text-sm flex-1 focus:ring-primary py-3 px-4" placeholder="Email address" type="email" />
            <button type="submit" className="bg-primary px-6 py-3 rounded-lg font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all">Go</button>
          </form>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
        <p className="text-[10px] uppercase font-bold tracking-widest">© 2026 Bermondish. All rights reserved.</p>
        <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest">
          <Link className="hover:text-white transition-colors" href="/about">Privacy</Link>
          <Link className="hover:text-white transition-colors" href="/about">Terms</Link>
          <Link className="hover:text-white transition-colors" href="/contact">Support</Link>
        </div>
      </div>
    </footer>
  );
}
