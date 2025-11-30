import { Search, MapPin } from 'lucide-react';
// --- PERBAIKAN: IMPORT INI WAJIB ADA ---
import WeatherWidget from './WeatherWidget'; 

export default function HomeHero({ searchValue, onSearchChange }) {
  return (
    <div className="relative h-[80vh] md:h-[600px] w-full overflow-hidden rounded-b-[2.5rem] shadow-2xl">
      
      {/* --- WIDGET CUACA DIPASANG DISINI --- */}
      <WeatherWidget />

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-[10s] hover:scale-105"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-emerald-900/40 to-black/30" />
      </div>

      {/* Konten Tengah */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-6 animate-fade-in-down">
          <MapPin className="w-4 h-4 text-emerald-300" />
          <span className="text-emerald-50 text-xs font-medium tracking-wider uppercase">Jelajahi Jawa Tengah</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg leading-tight">
          Temukan Surga di <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
            Cilacap Selatan
          </span>
        </h1>

        <p className="text-slate-200 text-sm md:text-lg max-w-lg mb-8 font-light leading-relaxed">
          Dari deburan ombak pantai selatan hingga jejak sejarah kolonial. Petualangan autentik menanti Anda.
        </p>

        {/* Floating Search Bar */}
        <div className="w-full max-w-md bg-white p-2 rounded-2xl shadow-xl shadow-emerald-900/20 flex items-center transform transition-all hover:scale-[1.02]">
          <div className="flex-1 px-4 border-r border-slate-100">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide text-left">Destinasi</label>
            <input 
              type="text" 
              placeholder="Cari Teluk Penyu..." 
              className="w-full text-slate-700 font-medium placeholder-slate-300 focus:outline-none text-sm"
              value={searchValue || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-colors shadow-lg shadow-emerald-600/30">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}