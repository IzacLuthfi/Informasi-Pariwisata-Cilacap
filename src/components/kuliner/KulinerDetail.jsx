import { useState } from 'react';
import { Loader2, Utensils } from 'lucide-react';
import { useDetailLogic } from '../../hooks/useDetailLogic';

// --- IMPORT KOMPONEN TAMPILAN ---
import DetailHero from '../detail/DetailHero';
import DetailSidebar from '../detail/DetailSidebar';
import DetailMapModal from '../detail/DetailMapModal';
import ReviewSection from '../common/ReviewSection'; // <-- Pastikan import ini ada

export default function KulinerDetail({ kulinerId, onBack }) {
  // Panggil Logic Hook (Tabel: 'kuliner')
  const { data, loading, isBookmarked, isFavorited, toggleInteraction } = useDetailLogic(kulinerId, 'kuliner');
  const [showMap, setShowMap] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-white pb-24 animate-fade-in-up">
      
      {/* 1. Header Hero */}
      <DetailHero 
        data={data} 
        onBack={onBack} 
        isBookmarked={isBookmarked} 
        isFavorited={isFavorited} 
        onToggle={toggleInteraction} 
      />

      <div className="max-w-4xl mx-auto px-5 py-8 -mt-6 relative z-10 bg-white rounded-t-3xl md:rounded-none">
         <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            
            {/* 2. Konten Kiri (Info Utama & Review) */}
            <div className="flex-1 space-y-6">
                
                {/* Info Harga */}
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide mb-1">Kisaran Harga</p>
                        <p className="text-xl font-bold text-slate-800">{data.price_range}</p>
                    </div>
                    <div className="bg-white p-3 rounded-full shadow-sm"><Utensils className="w-6 h-6 text-emerald-500" /></div>
                </div>

                {/* Deskripsi */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Tentang Hidangan</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify">
                        {data.description || "Deskripsi belum tersedia."}
                    </p>
                </div>

                {/* --- REVIEW SECTION (WAJIB ADA DISINI) --- */}
                <ReviewSection itemId={kulinerId} itemType="kuliner" />

            </div>

            {/* 3. Sidebar Kanan (Info & Map) */}
            <DetailSidebar 
              price={data.price_range} 
              mapUrl={data.map_url} 
              onOpenMap={() => setShowMap(true)} 
              isKuliner={true} 
            />
         </div>
      </div>

      {/* 4. Modal Map */}
      {showMap && <DetailMapModal mapUrl={data.map_url} onClose={() => setShowMap(false)} />}
    </div>
  );
}