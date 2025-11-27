import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { ArrowLeft, MapPin, Tag, Star, Clock, CheckCircle, Share2, Heart, Loader2 } from 'lucide-react';

// IMPORT GAMBAR LOKAL
import defaultImage from '../../assets/pantai.jpg'; 

export default function WisataDetail({ wisataId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data Detail Berdasarkan ID
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const { data: result, error } = await supabase
          .from('wisata')
          .select('*')
          .eq('id', wisataId)
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
  }, [wisataId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500">Memuat informasi wisata...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-white pb-24 animate-fade-in-up">
      
      {/* --- 1. Hero Image Header --- */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        {/* GUNAKAN GAMBAR STATIS */}
        <img 
          src={defaultImage} 
          alt={data.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        
        {/* Navbar Tombol Back */}
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
            <button className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white hover:text-blue-500 transition-all border border-white/30">
                <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Judul di atas Gambar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <span className="bg-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block shadow-lg">
                {data.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight shadow-black drop-shadow-lg">
                {data.name}
            </h1>
            <div className="flex items-center text-emerald-100 text-sm md:text-base">
                <MapPin className="w-4 h-4 mr-2" />
                {data.location}
            </div>
        </div>
      </div>

      {/* --- 2. Konten Detail --- */}
      <div className="max-w-4xl mx-auto px-5 py-8 -mt-6 relative z-10 bg-white rounded-t-3xl md:rounded-none md:mt-0">
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            
            {/* Kolom Kiri: Info Utama */}
            <div className="flex-1 space-y-8">
                
                {/* Deskripsi */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-l-4 border-emerald-500 pl-3">Tentang Destinasi</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify">
                        {data.description || "Tidak ada deskripsi tersedia untuk tempat ini. Namun tempat ini menawarkan keindahan alam yang wajib Anda kunjungi saat berada di Cilacap."}
                    </p>
                </div>

                {/* Fasilitas */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-emerald-500 pl-3">Fasilitas Tersedia</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {(data.facilities || []).map((fas, idx) => (
                            <div key={idx} className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                                <span className="text-sm text-slate-600 font-medium">{fas}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Kolom Kanan: Info Tiket & Maps */}
            <div className="md:w-80 flex-shrink-0">
                <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl p-6 sticky top-24">
                    <h3 className="font-bold text-slate-800 text-lg mb-4">Informasi Tiket</h3>
                    
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50">
                        <div className="flex items-center text-slate-500">
                            <Tag className="w-4 h-4 mr-2" />
                            <span className="text-sm">Harga Tiket</span>
                        </div>
                        <span className="text-xl font-bold text-emerald-600">{data.price}</span>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center text-slate-500">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="text-sm">Jam Buka</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-800">08.00 - 17.00 WIB</span>
                    </div>

                    <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center gap-2 mb-3">
                        <MapPin className="w-4 h-4" />
                        Petunjuk Arah
                    </button>
                    <p className="text-[10px] text-center text-slate-400">
                        *Harga dapat berubah sewaktu-waktu
                    </p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}