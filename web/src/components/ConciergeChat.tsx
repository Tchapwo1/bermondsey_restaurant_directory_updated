"use client"
import { useState, useRef, useEffect } from 'react';

export default function ConciergeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string; link?: string }[]>([
    { role: 'bot', text: "Hi! I'm your Bermondsey Concierge. Looking for a place to eat or drink?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage })
      });
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: data.reply,
          link: data.restaurantSlug ? `/restaurants/${data.restaurantSlug}` : undefined
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 w-[350px] h-[500px] rounded-3xl shadow-2xl border border-primary/10 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-primary p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <span className="material-symbols-outlined">smart_toy</span>
               </div>
               <div>
                  <p className="font-black uppercase tracking-widest text-[10px]">Your Concierge</p>
                  <p className="font-bold text-sm">Bermondish Bot</p>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
               <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-primary text-white font-medium rounded-tr-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-200/50'
                }`}>
                  {m.text}
                  {m.link && (
                    <Link href={m.link} className="block mt-2 font-black text-xs uppercase tracking-widest underline underline-offset-4 decoration-2">
                       View Restaurant
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl animate-pulse">
                    <span className="flex gap-1">
                       <span className="size-1 bg-slate-400 rounded-full animate-bounce"></span>
                       <span className="size-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                       <span className="size-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </span>
                 </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20"
            />
            <button type="submit" className="bg-primary text-white size-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
               <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
           onClick={() => setIsOpen(true)}
           className="size-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
           <span className="material-symbols-outlined text-3xl relative z-10">chat</span>
           <div className="absolute -top-1 -right-1 size-4 bg-orange-500 rounded-full border-2 border-white animate-bounce" />
        </button>
      )}
    </div>
  );
}

// Minimal Link mock if needed for the component
function Link({ href, children, ...props }: any) {
  return <a href={href} {...props}>{children}</a>;
}
