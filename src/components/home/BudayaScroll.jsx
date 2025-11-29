import { Drama } from 'lucide-react';
import defaultImage from '../../assets/pantai.jpg'; 

export default function BudayaScroll({ budayaList, onItemClick }) {
  return (
    <section className="py-8 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Drama className="w-6 h-6 text-emerald-600" /> 
            Kearifan Lokal 
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Kenali tradisi dan budaya unik Cilacap</p>
      </div>

      <div className="flex overflow-x-auto px-4 pb-6 space-x-4 hide-scrollbar snap-x snap-mandatory">
        {budayaList.map((item) => (
          <div 
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className="flex-shrink-0 w-60 md:w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden snap-center group hover:shadow-md transition-all cursor-pointer"
          >
            <div className="h-40 overflow-hidden relative">
              <img 
                src={item.image_url || defaultImage} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => { e.target.src = defaultImage; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3">
                 <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                    {item.category}
                 </span>
                 <h3 className="text-white font-bold text-sm mt-1 line-clamp-2 leading-snug">
                    {item.title}
                 </h3>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed h-12">
                {item.description}
              </p>
              <button className="mt-3 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider hover:underline">
                  Baca Selengkapnya →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}