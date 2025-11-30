import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { 
  ArrowLeft, MapPin, Tag, Star, Clock, CheckCircle, 
  Heart, Bookmark, Loader2, X, Ticket 
} from 'lucide-react';

// Gambar Statis
import defaultImage from '../../assets/pantai.jpg'; 

// Komponen Tambahan
import ReviewSection from '../common/ReviewSection';
import GallerySection from '../common/GallerySection';
import BookingModal from './BookingModal'; // <-- IMPORT BARU

export default function WisataDetail({ wisataId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State Interaksi
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [userId, setUserId] = useState(null);

  // State Modal
  const [showMap, setShowMap] = useState(false);
  const [showBooking, setShowBooking] = useState(false); // <-- STATE BARU

  // --- 1. FETCH DATA & CEK USER ---
  useEffect(() => {
    fetchDetail();
    checkInteractions();
  }, [wisataId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase.from('wisata').select('*').eq('id', wisataId).single();
      if (error) throw error;
      setData(result);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const checkInteractions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    const { data } = await supabase.from('user_interactions').select('*').eq('user_id', user.id).eq('item_id', wisataId).eq('item_type', 'wisata');
    if (data) {
      setIsBookmarked(data.some(i => i.interaction_type === 'bookmark'));
      setIsFavorited(data.some(i => i.interaction_type === 'favorite'));
    }
  };

  // --- 2. FUNGSI INTERAKSI ---
  const toggleInteraction = async (type) => {
    if (!userId) return alert("Silakan login untuk menyimpan!");
    const currentState = type === 'bookmark' ? isBookmarked : isFavorited;
    const setState = type === 'bookmark' ? setIsBookmarked : setIsFavorited;
    setState(!currentState);
    if (currentState) await supabase.from('user_interactions').delete().match({ user_id: userId, item_id: wisataId, item_type: 'wisata', interaction_type: type });
    else await supabase.from('user_interactions').insert({ user_id: userId, item_id: wisataId, item_type: 'wisata', interaction_type: type });
  };

  const handleOpenMap = () => {
    if (data.map_url) setShowMap(true);
    else alert("Maaf, peta lokasi belum tersedia di database.");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-white pb-24 animate-fade-in-up">
      
      {/* --- HERO IMAGE --- */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <img 
          src={data.image_url || defaultImage} 
          alt={data.name} 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center">
          <button onClick={onBack} className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-emerald-600 border border-white/30 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-3">
            <button onClick={() => toggleInteraction('bookmark')} className={`backdrop-blur-md p-2.5 rounded-full transition-all border border-white/30 ${isBookmarked ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/20 text-white hover:bg-white/40'}`}>
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button onClick={() => toggleInteraction('favorite')} className={`backdrop-blur-md p-2.5 rounded-full transition-all border border-white/30 ${isFavorited ? 'bg-pink-500 text-white border-pink-500' : 'bg-white/20 text-white hover:bg-white/40'}`}>
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <span className="bg-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block shadow-lg">{data.category}</span>
            <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">{data.name}</h1>
            <div className="flex items-center text-emerald-100 text-sm"><MapPin className="w-4 h-4 mr-2" />{data.location}</div>
        </div>
      </div>

      {/* --- KONTEN --- */}
      <div className="max-w-4xl mx-auto px-5 py-8 -mt-6 relative z-10 bg-white rounded-t-3xl md:rounded-none">
         <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            
            {/* Kiri */}
            <div className="flex-1 space-y-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-l-4 border-emerald-500 pl-3">Tentang Destinasi</h3>
                    <p className="text-slate-600 leading-relaxed text-sm text-justify">{data.description || "Deskripsi belum tersedia."}</p>
                </div>

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

                <GallerySection images={data.gallery} itemId={wisataId} itemType="wisata" />
                <ReviewSection itemId={wisataId} itemType="wisata" />
            </div>

            {/* Kanan */}
            <div className="md:w-80 flex-shrink-0">
                <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-6 sticky top-24">
                    <h3 className="font-bold text-slate-800 text-lg mb-4">Informasi Tiket</h3>
                    
                    <div className="flex justify-between mb-4 pb-4 border-b border-slate-50">
                        <div className="flex items-center text-slate-500"><Tag className="w-4 h-4 mr-2" /><span className="text-sm">Harga Tiket</span></div>
                        <span className="text-xl font-bold text-emerald-600">{data.price}</span>
                    </div>
                    
                    <div className="flex justify-between mb-6">
                        <div className="flex items-center text-slate-500"><Clock className="w-4 h-4 mr-2" /><span className="text-sm">Jam Buka</span></div>
                        <span className="text-sm font-semibold text-slate-800">08.00 - 17.00 WIB</span>
                    </div>
                    
                    {/* TOMBOL BELI TIKET */}
                    <button 
                        onClick={() => setShowBooking(true)}
                        className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center gap-2 mb-3"
                    >
                        <Ticket className="w-4 h-4" />
                        Beli Tiket Sekarang
                    </button>

                    <button onClick={handleOpenMap} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center gap-2 mb-3">
                        <MapPin className="w-4 h-4" /> Petunjuk Arah
                    </button>

                    {/* MINI MAP */}
                    {data.map_url ? (
                      <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                        <iframe src={data.map_url} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Mini Map" className="grayscale hover:grayscale-0 transition-all duration-500"></iframe>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xs">Peta tidak tersedia</div>
                    )}
                </div>
            </div>
         </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. MAP MODAL */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in px-4"><div className="bg-white w-full max-w-3xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl relative animate-scale-up flex flex-col"><div className="bg-slate-900 p-4 flex justify-between items-center text-white"><h3 className="font-bold text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-400"/> Peta Lokasi</h3><button onClick={() => setShowMap(false)} className="p-1 bg-white/20 rounded-full hover:bg-red-500 transition-colors"><X className="w-5 h-5" /></button></div><div className="flex-1 bg-slate-200"><iframe src={data.map_url} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Map Wisata"></iframe></div></div></div>
      )}

      {/* 2. BOOKING MODAL */}
      {showBooking && (
        <BookingModal 
            wisata={data} 
            onClose={() => setShowBooking(false)} 
            onSuccess={() => setShowBooking(false)} 
        />
      )}
    </div>
  );
}