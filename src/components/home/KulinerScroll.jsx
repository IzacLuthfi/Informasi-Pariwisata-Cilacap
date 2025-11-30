import { Star } from 'lucide-react';
import defaultImage from '../../assets/pantai.jpg'; 

export default function KulinerScroll({ featuredKuliner, onItemClick }) {
  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Wajib Dibeli🔥</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Tempat Kulineran di Cilacap </p>
      </div>

      <div className="flex overflow-x-auto px-4 pb-6 space-x-4 hide-scrollbar snap-x snap-mandatory">
        {featuredKuliner.map((item) => (
          <div 
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className="flex-shrink-0 w-60 md:w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden snap-center group hover:shadow-md transition-all cursor-pointer"
          >
            <div className="h-32 overflow-hidden relative">
              {/* Image GANTI KE STATIS */}
              <img 
                src={item.image_url || defaultImage} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => { e.target.src = defaultImage; }}
              />
              <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-lg flex items-center shadow-sm">
                <Star className="w-3 h-3 text-amber-500 fill-current mr-1" />
                
                {/* --- UPDATE DISINI: Rating Dinamis --- */}
                <span className="text-xs font-bold text-slate-800">
                  {item.rating || 'New'}
                </span>
                {/* ----------------------------------- */}
                
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-slate-800 dark:text-white mb-1 truncate">{item.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 h-8">
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  {item.price_range?.split('-')[0]}
                </span>
                <button className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}