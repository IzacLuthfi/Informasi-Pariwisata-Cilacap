import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { useDetailLogic } from '../../hooks/useDetailLogic';

// --- IMPORT KOMPONEN TAMPILAN ---
import DetailHero from '../detail/DetailHero';
import DetailSidebar from '../detail/DetailSidebar';
import DetailMapModal from '../detail/DetailMapModal';
import ReviewSection from '../common/ReviewSection'; // <-- Pastikan ini cuma satu kali import

export default function WisataDetail({ wisataId, onBack }) {
  // Panggil Logic Hook (Tabel: 'wisata')
  const { data, loading, isBookmarked, isFavorited, toggleInteraction } = useDetailLogic(wisataId, 'wisata');
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
            
            {/* 2. Konten Kiri (Info & Review) */}
            <div className="flex-1 space-y-8">
                
                {/* Deskripsi */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-l-4 border-emerald-500 pl-3">Tentang Destinasi</h3>
                    <p className="text-slate-600 leading-relaxed text-sm text-justify">{data.description || "Deskripsi belum tersedia."}</p>
                </div>

                {/* Fasilitas (Khusus Wisata) */}
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

                {/* --- REVIEW SECTION DISINI --- */}
                <ReviewSection itemId={wisataId} itemType="wisata" />
            </div>

            {/* 3. Sidebar Kanan (Info & Map) */}
            <DetailSidebar 
              price={data.price} 
              mapUrl={data.map_url} 
              onOpenMap={() => setShowMap(true)} 
              isKuliner={false} 
            />
         </div>
      </div>

      {/* 4. Modal Map */}
      {showMap && <DetailMapModal mapUrl={data.map_url} onClose={() => setShowMap(false)} />}
    </div>
  );
}