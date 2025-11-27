import { Umbrella, Landmark, Utensils, Waves, Mountain, Camera, Grid } from 'lucide-react';

export default function CategoryScroll({ selectedCategory, onSelectCategory }) {
  
  const categories = [
    { 
      name: 'Semua', 
      icon: Grid, 
      // Kita buat 'Semua' tetap netral (Hitam/Abu) biar beda sendiri
      gradient: 'from-slate-700 to-slate-900', 
      shadow: 'shadow-slate-500/30' 
    },
    { 
      name: 'Pantai', 
      icon: Waves, 
      gradient: 'from-blue-500 to-cyan-400', 
      shadow: 'shadow-blue-500/30' 
    },
    { 
      name: 'Sejarah', 
      icon: Landmark, 
      gradient: 'from-amber-500 to-orange-400', 
      shadow: 'shadow-amber-500/30' 
    },
    { 
      name: 'Alam', 
      icon: Mountain, 
      gradient: 'from-green-500 to-lime-400', 
      shadow: 'shadow-green-500/30' 
    },
    { 
      name: 'Budaya', 
      icon: Camera, 
      gradient: 'from-rose-500 to-pink-400', 
      shadow: 'shadow-rose-500/30' 
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between md:justify-center px-4 mb-5 max-w-4xl mx-auto">
        <h3 className="font-bold text-slate-800 dark:text-white text-lg md:text-2xl">Kategori Wisata</h3>
        <span className="text-xs text-slate-400 md:hidden">Geser 👉</span>
      </div>

      <div className="w-full overflow-x-auto pb-6 hide-scrollbar px-4">
        <div className="flex space-x-5 md:space-x-0 md:gap-8 min-w-max md:min-w-full md:justify-center">
          
          {categories.map((cat, index) => {
            const isActive = selectedCategory === cat.name;

            return (
              <button 
                key={index}
                onClick={() => onSelectCategory(cat.name)}
                className="flex flex-col items-center space-y-2 group"
              >
                {/* PERUBAHAN DISINI: 
                   1. Hapus logic 'bg-white' dan 'grayscale'.
                   2. Gunakan `bg-gradient` untuk SEMUA kondisi.
                   3. Mainkan Opacity & Scale untuk membedakan aktif/tidak.
                */}
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center 
                  transition-all duration-300 border-[3px] 
                  bg-gradient-to-br ${cat.gradient} shadow-md
                  ${isActive 
                    ? `scale-110 border-white ring-2 ring-offset-2 ring-slate-200 dark:ring-slate-700 ${cat.shadow} opacity-100` 
                    : 'border-transparent scale-100 opacity-90 hover:opacity-100 hover:scale-105'
                  }
                `}>
                  {/* Icon selalu putih karena background selalu warna */}
                  <cat.icon className="w-7 h-7 text-white drop-shadow-md" strokeWidth={2} />
                </div>

                <span className={`text-xs font-semibold transition-colors ${
                  isActive 
                    ? 'text-slate-800 dark:text-white font-bold' 
                    : 'text-slate-500 group-hover:text-slate-700 dark:text-slate-400'
                }`}>
                  {cat.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}