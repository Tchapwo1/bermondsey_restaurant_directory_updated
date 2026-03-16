"use client"

export default function RefetchButton() {
  return (
    <button 
      onClick={() => window.location.reload()} 
      className="mt-10 inline-block px-10 py-4 bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-red-200 hover:bg-red-700 transition-colors"
    >
      Retry Connection
    </button>
  );
}
