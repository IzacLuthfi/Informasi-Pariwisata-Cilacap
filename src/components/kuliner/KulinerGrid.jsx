import { MapPin, Star, ArrowUpRight, Tag } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import defaultImage from '../../assets/pantai.jpg'; 

export default function KulinerGrid({ kulinerList, onItemClick }) {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  useEffect(() => {
    setVisibleCards(new Set());
    cardRefs.current = cardRefs.current.slice(0, kulinerList.length);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setTimeout(() => { setVisibleCards(prev => new Set(prev).add(index)); }, (index % 3) * 150);
        }
      });
    }, { threshold: 0.1 });
    cardRefs.current.forEach((ref, index) => { if (ref) { ref.dataset.index = index; observer.observe(ref); } });
    return () => observer.disconnect();
  }, [kulinerList]);

  if (kulinerList.length === 0) return <div className="py-20 text-center"><p className="text-slate-400 text-lg">Menu tidak ditemukan 🍛</p></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kulinerList.map((item, index) => (
        <div key={item.id} ref={el => cardRefs.current[index] = el} onClick={() => onItemClick(item.id)} className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 border border-slate-100 transition-all duration-500 cursor-pointer ${visibleCards.has(index) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="relative h-48 overflow-hidden">
            {/* GAMBAR DINAMIS */}
            <img 
                src={item.image_url || defaultImage} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.target.src = defaultImage; }}
            />
            <div className="absolute top-3 left-3"><span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-800 rounded-lg shadow-sm uppercase tracking-wider">{item.category}</span></div>
            <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center text-xs font-bold"><Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />4.9</div>
          </div>
          <div className="p-5 flex flex-col h-[180px]">
            <div className="mb-3"><h3 className="font-bold text-slate-800 text-lg line-clamp-1 group-hover:text-emerald-600 transition-colors">{item.name}</h3><div className="flex items-center mt-1 text-emerald-600 font-bold text-sm"><Tag className="w-3.5 h-3.5 mr-1" />{item.price_range}</div></div>
            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-auto">{item.description}</p>
            <div className="pt-4 border-t border-slate-50 mt-4 flex items-center justify-between">
               <div className="flex items-center text-slate-400 text-xs max-w-[60%]"><MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" /><span className="truncate">{item.location}</span></div>
               <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300"><ArrowUpRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}