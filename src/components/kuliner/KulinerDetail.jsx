import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { ArrowLeft, MapPin, Utensils, Star, Share2, Heart, Loader2, Navigation } from 'lucide-react';

// IMPORT GAMBAR LOKAL
import defaultImage from '../../assets/pantai.jpg'; 

export default function KulinerDetail({ kulinerId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const { data: result, error } = await supabase
          .from('kuliner')
          .select('*')
          .eq('id', kulinerId)
          .single();
        
        if (error) throw error;
        setData(result);
      } catch (err) {
        console.error("Gagal ambil detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [kulinerId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500">Menyiapkan hidangan...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-white pb-24 animate-fade-in-up">
      
      {/* --- 1. Hero Image --- */}
      <div className="relative h-[45vh] md:h-[55vh] w-full">
        {/* GUNAKAN GAMBAR STATIS */}
        <img 
          src={defaultImage} 
          alt={data.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        
        {/* Navbar Actions */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white hover:text-emerald-600 transition-all border border-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-3">
            <button className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white hover:text-pink-500 transition-all border border-white/30">
                <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg text-white">
                    {data.category}
                </span>
                <div className="flex items-center bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-xs font-bold">4.9 (Populer)</span>
                </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight shadow-black drop-shadow-lg">
                {data.name}
            </h1>
        </div>
      </div>

      {/* --- 2. Konten Detail --- */}
      <div className="max-w-4xl mx-auto px-5 py-8 -mt-6 relative z-10 bg-white rounded-t-3xl md:rounded-none md:mt-0">
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            
            {/* Info Utama */}
            <div className="flex-1 space-y-6">
                
                {/* Price */}
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide mb-1">Kisaran Harga</p>
                        <p className="text-xl font-bold text-slate-800">{data.price_range}</p>
                    </div>
                    <div className="bg-white p-3 rounded-full shadow-sm">
                        <Utensils className="w-6 h-6 text-emerald-500" />
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Tentang Hidangan</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify">
                        {data.description || "Nikmati cita rasa otentik khas Cilacap yang melegenda. Hidangan ini dibuat dengan bumbu rempah pilihan."}
                    </p>
                </div>

            </div>

            {/* Lokasi Card */}
            <div className="md:w-80 flex-shrink-0">
                <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl p-6 sticky top-24">
                    <h3 className="font-bold text-slate-800 text-lg mb-4">Lokasi Rekomendasi</h3>
                    
                    <div className="flex items-start gap-3 mb-6">
                        <MapPin className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-slate-700">{data.location}</p>
                            <p className="text-xs text-slate-400 mt-1">Jawa Tengah, Indonesia</p>
                        </div>
                    </div>

                    <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center gap-2">
                        <Navigation className="w-4 h-4" />
                        Navigasi Google Maps
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}