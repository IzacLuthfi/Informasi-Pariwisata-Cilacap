import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { 
  ArrowLeft, MapPin, Tag, Star, Utensils, Share2, Heart, Bookmark, 
  Loader2, Navigation, X 
} from 'lucide-react';
import defaultImage from '../../assets/pantai.jpg'; 
import ReviewSection from '../common/ReviewSection';
import GallerySection from '../common/GallerySection';

export default function KulinerDetail({ kulinerId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // --- FUNGSI ---
  const fetchDetail = async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase.from('kuliner').select('*').eq('id', kulinerId).single();
      if (error) throw error;
      setData(result);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const checkInteractions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    const { data } = await supabase.from('user_interactions').select('*').eq('user_id', user.id).eq('item_id', kulinerId).eq('item_type', 'kuliner');
    if (data) {
      setIsBookmarked(data.some(i => i.interaction_type === 'bookmark'));
      setIsFavorited(data.some(i => i.interaction_type === 'favorite'));
    }
  };

  const toggleInteraction = async (type) => {
    if (!userId) return alert("Silakan login dulu.");
    const currentState = type === 'bookmark' ? isBookmarked : isFavorited;
    const setState = type === 'bookmark' ? setIsBookmarked : setIsFavorited;
    setState(!currentState);
    if (currentState) await supabase.from('user_interactions').delete().match({ user_id: userId, item_id: kulinerId, item_type: 'kuliner', interaction_type: type });
    else await supabase.from('user_interactions').insert({ user_id: userId, item_id: kulinerId, item_type: 'kuliner', interaction_type: type });
  };

  const handleOpenMap = () => {
    if (data.map_url) setShowMap(true);
    else alert("Maaf, peta lokasi belum tersedia.");
  };

  // --- FITUR SHARE ---
  const handleShare = async () => {
    const shareData = {
        title: data.name,
        text: `Cobain kuliner enak ini: ${data.name} di Cilacap!`,
        url: window.location.href
    };
    try {
        if (navigator.share) await navigator.share(shareData);
        else {
            await navigator.clipboard.writeText(`${shareData.text} Cek aplikasinya!`);
            alert('Info kuliner disalin ke clipboard!');
        }
    } catch (err) { console.log('Share cancelled'); }
  };

  useEffect(() => {
    if (kulinerId) { fetchDetail(); checkInteractions(); }
  }, [kulinerId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-white pb-24 animate-fade-in-up">
      
      {/* Hero Image */}
      <div className="relative h-[45vh] w-full">
        <img src={data.image_url || defaultImage} alt={data.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = defaultImage; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        
        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <button onClick={onBack} className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-emerald-600 border border-white/30 transition-all"><ArrowLeft className="w-6 h-6" /></button>
          
          <div className="flex gap-3">
            {/* Share Button */}
            <button onClick={handleShare} className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-blue-500 border border-white/30 transition-all">
                <Share2 className="w-5 h-5" />
            </button>

            <button onClick={() => toggleInteraction('bookmark')} className={`backdrop-blur-md p-2.5 rounded-full border border-white/30 transition-all ${isBookmarked ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/20 text-white'}`}><Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} /></button>
            <button onClick={() => toggleInteraction('favorite')} className={`backdrop-blur-md p-2.5 rounded-full border border-white/30 transition-all ${isFavorited ? 'bg-pink-500 text-white border-pink-500' : 'bg-white/20 text-white'}`}><Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} /></button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-3"><span className="bg-amber-500 text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg text-white">{data.category}</span><div className="flex items-center bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg"><Star className="w-3 h-3 text-yellow-400 fill-current mr-1" /><span className="text-xs font-bold">4.9</span></div></div>
            <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">{data.name}</h1>
        </div>
      </div>
      
      {/* Konten */}
      <div className="max-w-4xl mx-auto px-5 py-8 -mt-6 relative z-10 bg-white rounded-t-3xl">
         <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100"><div><p className="text-xs text-emerald-600 font-bold uppercase tracking-wide mb-1">Kisaran Harga</p><p className="text-xl font-bold text-slate-800">{data.price_range}</p></div><div className="bg-white p-3 rounded-full shadow-sm"><Utensils className="w-6 h-6 text-emerald-500" /></div></div>
                <div><h3 className="text-lg font-bold text-slate-800 mb-3">Tentang Hidangan</h3><p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify">{data.description || "Deskripsi belum tersedia."}</p></div>
                
                <GallerySection images={data.gallery} itemId={kulinerId} itemType="kuliner" />
                <ReviewSection itemId={kulinerId} itemType="kuliner" />
            </div>

            <div className="md:w-80 flex-shrink-0">
                <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-6 sticky top-24">
                    <h3 className="font-bold text-slate-800 text-lg mb-4">Lokasi Rekomendasi</h3>
                    <div className="flex items-start gap-3 mb-6"><MapPin className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" /><div><p className="text-sm font-semibold text-slate-700">{data.location}</p><p className="text-xs text-slate-400 mt-1">Jawa Tengah</p></div></div>
                    <button onClick={handleOpenMap} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center gap-2 mb-6"><Navigation className="w-4 h-4" /> Buka Peta Besar</button>
                    {data.map_url ? (<div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-inner"><iframe src={data.map_url} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Mini Map" className="grayscale hover:grayscale-0 transition-all duration-500"></iframe></div>) : (<div className="w-full h-48 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xs">Peta tidak tersedia</div>)}
                </div>
            </div>
         </div>
      </div>

      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in px-4"><div className="bg-white w-full max-w-3xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl relative animate-scale-up flex flex-col"><div className="bg-slate-900 p-4 flex justify-between items-center text-white"><h3 className="font-bold text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-400"/> Peta Kuliner</h3><button onClick={() => setShowMap(false)} className="p-1 bg-white/20 rounded-full hover:bg-red-500 transition-colors"><X className="w-5 h-5" /></button></div><div className="flex-1 bg-slate-200"><iframe src={data.map_url} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Map Besar"></iframe></div></div></div>
      )}
    </div>
  );
}