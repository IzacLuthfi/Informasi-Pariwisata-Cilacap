import logoUrl from '../../assets/LOGORN.png'; 

export default function DesktopNavbar({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'wisata', label: 'Objek Wisata' }, 
    { id: 'kuliner', label: 'Kuliner' },     
    { id: 'profile', label: 'Profil' }
  ];

  return (
    <nav className="hidden md:block shadow-lg border-b border-emerald-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {}
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="relative group">
              <img
                src={logoUrl}
                alt="Logo Pariwisata"
                className="w-12 h-12 object-contain filter drop-shadow-md transform transition-transform duration-300 group-hover:scale-110"
              />
              {}
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping opacity-60" />
              <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-teal-300 rounded-full animate-ping opacity-50" style={{ animationDelay: '300ms' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
                Cilacap
              </h1>
              <h2 className="text-base font-semibold bg-gradient-to-r from-emerald-600 via-teal-500 to-teal-400 bg-clip-text text-transparent -mt-1">
                Bercahaya
              </h2>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-3 text-base font-medium transition-all duration-200 border-b-2 ${
                  currentPage === item.id
                    ? 'text-emerald-600 border-emerald-500' 
                    : 'text-slate-600 border-transparent hover:text-emerald-500 hover:border-emerald-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
        </div>
      </div>
    </nav>
  );
  return (
    // Update Class: dark:bg-slate-900/95 dark:border-slate-800
    <nav className="hidden md:block shadow-lg border-b border-emerald-100 dark:border-slate-800 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onNavigate('home')}>
            {/* ... Gambar Logo tetap ... */}
            <div>
              {/* Update Text Colors */}
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Cilacap
              </h1>
              {/* ... Subtitle tetap ... */}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-3 text-base font-medium transition-all duration-200 border-b-2 ${
                  currentPage === item.id
                    ? 'text-emerald-600 border-emerald-500' 
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-emerald-500 hover:border-emerald-300' // Dark text updated
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
        </div>
      </div>
    </nav>
);
}