import { Home, Map, Utensils, User } from 'lucide-react';

export default function MobileNavbar({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'wisata', label: 'Wisata', icon: Map },         
    { id: 'kuliner', label: 'Kuliner', icon: Utensils },  
    { id: 'profile', label: 'Profil', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-100 px-4 py-1 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-2 px-3 transition-colors duration-200 ${
                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <IconComponent 
                size={20} 
                className={`mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
  return (
    // GANTI BG: dark:bg-slate-950
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20 transition-colors duration-300">
      
      {/* 1. Hero Section (Tetap, karena gambar full) */}
      <HomeHero />

      <div className="relative z-20 -mt-10 md:-mt-16 space-y-10 max-w-7xl mx-auto">
        
        {/* 2. Kategori Cepat: Update BG & Border */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/50 dark:border-slate-700 py-6 rounded-t-3xl md:rounded-3xl md:shadow-lg md:mx-4 transition-colors duration-300">
          <CategoryScroll />
        </div>

        {/* 3. Wisata Trending (Text Header perlu diupdate di dalam komponen TrendingWisata) */}
        <TrendingWisata featuredWisata={trendingWisata} />

        {/* 4. Kuliner Scroll (Perlu update BG Section) */}
        {/* Bungkus KulinerScroll dengan div ini jika perlu background khusus, atau update di dalam komponennya */}
        <div className="bg-slate-50 dark:bg-slate-950">
            <KulinerScroll featuredKuliner={popularKuliner} />
        </div>

        {/* ... Banner Promo tetap ... */}

      </div>
    </div>
  );
}