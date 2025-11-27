export default function BackgroundPattern({ fadeOut }) {
  return (
    <div className="absolute inset-0 z-0">
      {/* 1. Cinematic Background Image (Pantai/Laut) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-out scale-110 animate-[pulse_10s_ease-in-out_infinite]"
        style={{ 
          // Gambar Pantai (Bisa diganti foto Nusakambangan nanti)
          backgroundImage: 'url("https://images.unsplash.com/photo-1519046904884-53103b34b271?q=80&w=1887&auto=format&fit=crop")',
        }}
      />

      {/* 2. Dark Gradient Overlay (Agar teks putih terbaca jelas) */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-slate-900/60 mix-blend-multiply" />
      
      {/* 3. Ambient Light Glows (Efek Mewah) */}
      <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
         {/* Cahaya Hijau dari pojok atas */}
         <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/30 rounded-full blur-[100px] animate-pulse" />
         {/* Cahaya Biru dari pojok bawah */}
         <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 4. Pattern Grid Halus (Opsional, nambah tekstur) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
    </div>
  );
}