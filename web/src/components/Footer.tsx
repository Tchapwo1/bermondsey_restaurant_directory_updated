import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white px-6 md:px-20 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-4 text-primary mb-6">
            <div className="size-6">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
              </svg>
            </div>
            <h2 className="text-white text-xl font-black tracking-tight tracking-tight uppercase">BERMONDISH</h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">The premier restaurant directory and lifestyle guide for Bermondsey, London.</p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><Link className="hover:text-primary transition-colors" href="/restaurants">Find Restaurants</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/about">Our Story</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="#">Add Business</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Categories</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><Link className="hover:text-primary transition-colors" href="/restaurants?category=Italian">Italian Dining</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/restaurants?category=Pubs">Traditional Pubs</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/restaurants?category=Wine+Bars">Wine Bars</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/restaurants?category=Street+Food">Street Food</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Stay Updated</h4>
          <p className="text-slate-400 text-sm mb-4">Join our newsletter for the latest restaurant openings and events.</p>
          <div className="flex gap-2">
            <input className="bg-slate-800 border-none rounded-lg text-sm flex-1 focus:ring-primary" placeholder="Email address" type="email" />
            <button className="bg-primary px-4 py-2 rounded-lg font-bold">Go</button>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>© 2024 Bermondish. All rights reserved.</p>
        <div className="flex gap-6">
          <Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link>
          <Link className="hover:text-white transition-colors" href="#">Terms of Service</Link>
          <Link className="hover:text-white transition-colors" href="#">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
