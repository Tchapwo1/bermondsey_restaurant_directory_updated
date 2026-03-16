"use client"
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  latitude?: number;
  longitude?: number;
  cover_image_url: string;
  price_range: number;
}

export default function RestaurantMap({ restaurants }: { restaurants: Restaurant[] }) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Bermondsey center coords
      mapRef.current = L.map('map').setView([51.498, -0.075], 14);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing markers if any
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for each restaurant
    restaurants.forEach((res) => {
      // Fallback coords if missing in DB
      const lat = res.latitude || (51.495 + Math.random() * 0.01);
      const lng = res.longitude || (-0.08 + Math.random() * 0.01);

      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white scale-125 transition-transform hover:scale-150">
                   <div class="size-2 bg-white rounded-full"></div>
                 </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(map);

      const popupContent = `
        <div class="p-2 w-48 font-sans">
          <img src="${res.cover_image_url}" class="w-full h-24 object-cover rounded-lg mb-2" />
          <h3 class="font-black uppercase text-[10px] tracking-widest text-slate-400 mb-1">Restaurant</h3>
          <h2 class="font-black text-xs uppercase mb-1">${res.name}</h2>
          <div class="flex justify-between items-center mt-3">
            <span class="text-[10px] font-black text-primary">${'£'.repeat(res.price_range)}</span>
            <a href="/restaurants/${res.slug}" class="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">View</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        closeButton: false
      });
    });

    return () => {
      // Cleanup on unmount
    };
  }, [restaurants]);

  return (
    <div className="w-full h-full min-h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-primary/10 relative">
      <div id="map" className="w-full h-full z-0"></div>
      
      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-primary/5">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Map Legend</h4>
        <div className="flex items-center gap-3">
           <div className="size-3 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
           <span className="text-[10px] font-bold text-slate-700">Restaurant Location</span>
        </div>
      </div>
      
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 1.5rem !important;
          padding: 0 !important;
          overflow: hidden !important;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-container {
          background-color: #f8fafc !important;
        }
      `}</style>
    </div>
  );
}
