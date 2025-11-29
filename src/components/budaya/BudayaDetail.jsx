import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { ArrowLeft, Share2, Info, Heart, Bookmark } from 'lucide-react';
import defaultImage from '../../assets/pantai.jpg'; 

// Import Komponen Pendukung
import GallerySection from '../common/GallerySection'; 
import ReviewSection from '../common/ReviewSection';

export default function BudayaDetail({ data, onBack }) {
  // --- STATE INTERAKSI ---
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [userId, setUserId] = useState(null);

  // 1. Cek Status saat komponen dimuat
  useEffect(() => {
    checkInteractions();
  }, [data.id]);

  const checkInteractions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data: interactions } = await supabase
      .from('user_interactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('item_id', data.id)
      .eq('item_type', 'budaya'); // Tipe item: budaya

    if (interactions) {
      setIsBookmarked(interactions.some(i => i.interaction_type === 'bookmark'));
      setIsFavorited(interactions.some(i => i.interaction_type === 'favorite'));
    }
  };

  // 2. Fungsi Toggle (Simpan/Hapus)
  const toggleInteraction = async (type) => {
    if (!userId) {
      alert("Silakan login untuk menyimpan.");
      return;
    }

    const currentState = type === 'bookmark' ? isBookmarked : isFavorited;
    const setState = type === 'bookmark' ? setIsBookmarked : setIsFavorited;

    // Optimistic UI Update
    setState(!currentState);

    if (currentState) {
      // Hapus
      await supabase.from('user_interactions').delete()
        .match({ 
            user_id: userId, 
            item_id: data.id, 
            item_type: 'budaya', 
            interaction_type: type 
        });
    } else {
      // Simpan
      await supabase.from('user_interactions').insert({
        user_id: userId,
        item_id: data.id,
        item_type: 'budaya',
        interaction_type: type
      });
    }
  };

  // 3. Fungsi Share
  const handleShare = async () => {
    try {
        await navigator.share({
            title: data.title,
            text: `Belajar budaya ${data.title} khas Cilacap!`,
            url: window.location.href
        });
    } catch (err) {
        console.log('Share closed');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 animate-fade-in-up">
      
      {/* 1. Hero Image Full Screen */}
      <div className="relative h-[50vh] w-full">
        <img 
          src={data.image_url || defaultImage} 
          alt={data.title} 
          className="w-full h-full object-cover"
          onError={(e) => e.target.src = defaultImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-90" />
        
        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
          <button onClick={onBack} className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-emerald-600 border border-white/20 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex gap-3">
             {/* Tombol Share */}
             <button onClick={handleShare} className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-blue-500 border border-white/20 transition-all">
                <Share2 className="w-5 h-5" />
             </button>

             {/* Tombol Bookmark */}
             <button 
                onClick={() => toggleInteraction('bookmark')} 
                className={`backdrop-blur-md p-3 rounded-full border border-white/20 transition-all ${
                    isBookmarked ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
             >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
             </button>

             {/* Tombol Favorite */}
             <button 
                onClick={() => toggleInteraction('favorite')} 
                className={`backdrop-blur-md p-3 rounded-full border border-white/20 transition-all ${
                    isFavorited ? 'bg-pink-500 text-white border-pink-500' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
             >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
             </button>
          </div>
        </div>

        {/* Title & Category */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
            <span className="inline-block px-4 py-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-4 uppercase tracking-widest shadow-lg">
                {data.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-xl">
                {data.title}
            </h1>
        </div>
      </div>

      {/* 2. Content Description */}
      <div className="max-w-3xl mx-auto px-6 py-10 -mt-6 relative z-10 bg-white rounded-t-[2.5rem]">
         
         <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />

         <div className="prose prose-slate prose-lg mx-auto">
            <div className="flex items-start gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Info className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <p className="text-sm text-slate-600 m-0 italic">
                    "Budaya adalah identitas bangsa. Mari lestarikan kekayaan budaya Cilacap agar tidak hilang ditelan zaman."
                </p>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-emerald-500 pl-4">
                Mengenal {data.title}
            </h3>
            
            <p className="text-slate-600 leading-loose text-justify whitespace-pre-line mb-8">
                {data.description}
            </p>

            {/* GALERI FOTO */}
            <GallerySection 
                images={data.gallery} 
                itemId={data.id} 
                itemType="budaya" 
            />

            {/* ULASAN / KOMENTAR (Tanpa Rating Bintang) */}
            <ReviewSection 
                itemId={data.id} 
                itemType="budaya" 
                hideRating={true} 
            />
            
         </div>
      </div>
    </div>
  );
}