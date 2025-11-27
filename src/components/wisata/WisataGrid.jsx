import { MapPin, ArrowRight, Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// IMPORT GAMBAR LOKAL
import defaultImage from '../../assets/pantai.jpg'; 

export default function WisataGrid({ wisataList, onItemClick }) {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  useEffect(() => {
    setVisibleCards(new Set());
    cardRefs.current = cardRefs.current.slice(0, wisataList.length);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setTimeout(() => {
            setVisibleCards(prev => new Set(prev).add(index));
          }, (index % 4) * 100); 
        }
      });
    }, { threshold: 0.1 });

    cardRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.dataset.index = index;
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [wisataList]); 

  if (wisataList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-700">Tidak ditemukan</h3>
        <p className="text-slate-500">Coba ganti kata kunci atau kategori lain.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {wisataList.map((item, index) => (
        <div 
          key={item.id} 
          ref={el => cardRefs.current[index] = el}
          // Event Klik
          onClick={() => onItemClick(item.id)} 
          className={`group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-500 transform cursor-pointer ${
            visibleCards.has(index) 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-12 opacity-0'
          }`}
        >
          {/* Image Container */}
          <div className="relative h-52 overflow-hidden">
            {/* GUNAKAN GAMBAR STATIS */}
            <img 
              src={defaultImage} 
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white/20 backdrop-blur-md border border-white/50 text-white px-6 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Lihat Detail
                </button>
            </div>

            <div className="absolute top-4 left-4">
               <span className="bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                 {item.category}
               </span>
            </div>
            
            <div className="absolute bottom-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg">
                {item.price}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {item.name}
                </h3>
                <div className="flex items-center text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    4.8
                </div>
            </div>

            <div className="flex items-center text-slate-500 text-xs mb-4">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                <span className="line-clamp-1">{item.location}</span>
            </div>

            {/* Fasilitas */}
            <div className="flex flex-wrap gap-2 mb-4">
                {(item.facilities || []).slice(0, 3).map((fac, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100">
                        {fac}
                    </span>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center text-emerald-600 text-sm font-semibold group/link">
                <span>Info Selengkapnya</span>
                <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover/link:translate-x-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}