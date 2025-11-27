export default function TitleSection({ fadeIn }) {
  return (
    <div className="text-center mb-16 space-y-2">
      {/* Judul Utama */}
      <h1 className={`text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-lg transform transition-all duration-1000 ${
        !fadeIn ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        Cilacap
      </h1>
      
      {/* Sub Judul dengan Gradient Text */}
      <h2 className={`text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-teal-200 transform transition-all duration-1000 delay-200 ${
        !fadeIn ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        Bercahaya
      </h2>

      {/* Garis Dekorasi */}
      <div className={`flex items-center justify-center gap-2 mt-6 opacity-80 transition-all duration-1000 delay-500 ${!fadeIn ? 'scale-0' : 'scale-100'}`}>
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-emerald-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-emerald-400" />
      </div>
      
      {/* Tagline Kecil */}
      <p className={`text-emerald-100/80 text-sm mt-4 font-light tracking-wider transition-all duration-1000 delay-700 ${
        !fadeIn ? 'opacity-0' : 'opacity-100'
      }`}>
        Permata Wisata Jawa Tengah Selatan
      </p>
    </div>
  );
}