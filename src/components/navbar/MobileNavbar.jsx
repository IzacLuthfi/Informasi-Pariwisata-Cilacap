// PERBAIKAN: Tambahkan 'Drama' di dalam kurung kurawal import
import { Home, Map, Utensils, User, Drama } from 'lucide-react';

export default function MobileNavbar({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'wisata', label: 'Wisata', icon: Map },
    { id: 'kuliner', label: 'Kuliner', icon: Utensils },
    { id: 'budaya', label: 'Budaya', icon: Drama }, // Sekarang ini tidak akan error
    { id: 'profile', label: 'Profil', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-emerald-100 dark:border-slate-800 px-4 py-1 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-colors duration-300">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-2 px-3 transition-colors duration-200 ${
                isActive 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-emerald-400'
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
}