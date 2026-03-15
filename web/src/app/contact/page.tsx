"use client"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <main className="flex flex-1 justify-center py-10">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 px-6">
            <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-tight mb-8">Get in Touch</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  Have a question about a restaurant? Want to partner with us? Or just want to say hi? Use the form below or reach out directly.
                </p>
                
                <div className="space-y-4">
                  <ContactInfo icon="mail" title="Email Us" text="hello@bermondish.com" />
                  <ContactInfo icon="location_on" title="Visit Us" text="123 Bermondsey St, SE1 3UW" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-primary/10 shadow-xl">
                {submitted ? (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-primary mb-4">check_circle</span>
                    <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                    <p className="text-slate-500">Thank you for reaching out. We'll get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-slate-500">Full Name</label>
                      <input required className="rounded-lg border-slate-200 focus:ring-primary focus:border-primary" type="text" placeholder="Julian Deville" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-slate-500">Email Address</label>
                      <input required className="rounded-lg border-slate-200 focus:ring-primary focus:border-primary" type="email" placeholder="julian@example.com" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-slate-500">Message</label>
                      <textarea required rows={4} className="rounded-lg border-slate-200 focus:ring-primary focus:border-primary" placeholder="How can we help?"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function ContactInfo({ icon, title, text }: any) {
  return (
    <div className="flex gap-4">
      <div className="bg-primary/10 p-3 rounded-xl shrink-0 h-fit">
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100">{title}</h4>
        <p className="text-slate-500">{text}</p>
      </div>
    </div>
  );
}
