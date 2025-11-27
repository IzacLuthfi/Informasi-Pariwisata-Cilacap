import logoUrl from '../../assets/LOGORN.png'; 

export default function LogoContainer() {
  return (
    <div className="mb-12 relative group">
      {/* Glass Box Container */}
      <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-900/50 transform transition-all duration-700 hover:scale-105 hover:bg-white/20 hover:border-emerald-300/30">
        
        {/* Glow Effect di belakang logo */}
        <div className="absolute inset-0 bg-emerald-400/20 rounded-[2rem] blur-xl animate-pulse" />

        <img 
          src={logoUrl} 
          alt="Logo Pariwisata"
          className="relative z-10 w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        />
      </div>

      {/* Orbiting Particles */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full blur-sm animate-bounce" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-300 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0.5s' }} />
    </div>
  );
}