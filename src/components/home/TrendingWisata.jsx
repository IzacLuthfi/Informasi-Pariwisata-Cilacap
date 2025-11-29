import { MapPin, ArrowUpRight } from 'lucide-react';
// Jangan lupa import gambar default

export default function TrendingWisata({ featuredWisata, onItemClick }) {
  return (
    <section className="px-4">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Sedang Hits 🔥</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Wisata paling banyak dikunjungi minggu ini</p>
        </div>
      </div>

      {/* Grid Layout: Pas untuk 5 Item */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredWisata.slice(0, 5).map((item, index) => (
          <div 
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`group relative h-64 md:h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg ${
              // Item pertama (index 0) akan memanjang 2 kolom
              index === 0 ? 'md:col-span-2' : ''
            }`}
          >
            {/* Background Image */}
            <img 
              src={item.image_url || defaultImage} 
              alt={item.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => { e.target.src = defaultImage; }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

            {/* Content Floating Top Right */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>

            {/* Content Bottom */}
            <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
              <span className="inline-block px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded mb-2 uppercase tracking-wide">
                {item.category}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight">
                {item.name}
              </h3>
              <div className="flex items-center text-slate-300 text-xs md:text-sm">
                <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                <span className="truncate max-w-[200px]">{item.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}