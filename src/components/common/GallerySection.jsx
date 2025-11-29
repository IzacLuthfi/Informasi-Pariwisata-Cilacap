import { useState, useRef, useEffect } from 'react';
import { Image, X, ZoomIn, Plus, Loader2, Camera } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

// TERIMA PROPS itemId dan itemType untuk keperluan upload
export default function GallerySection({ images, itemId, itemType }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [localImages, setLocalImages] = useState(images || []);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const fileInputRef = useRef(null);

  // Cek Login saat komponen dimuat
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    checkUser();
    // Sync local images dengan props
    setLocalImages(images || []);
  }, [images]);

  // Fungsi Upload Foto User
  const handleUserUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!userId) return alert("Silakan login untuk menambahkan foto.");

    setUploading(true);
    try {
      // 1. Upload ke Storage
      const fileName = `user_upload_${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('content').upload(fileName, file);
      
      if (uploadError) throw uploadError;

      // 2. Dapatkan URL
      const { data: urlData } = supabase.storage.from('content').getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;

      // 3. Panggil Fungsi SQL (RPC) untuk update database
      const { error: dbError } = await supabase.rpc('append_gallery_image', {
        table_name: itemType, // 'wisata' atau 'kuliner'
        row_id: itemId,
        new_url: publicUrl
      });

      if (dbError) throw dbError;

      // 4. Update UI Langsung
      setLocalImages(prev => [...prev, publicUrl]);
      alert("Foto berhasil ditambahkan! Terima kasih.");

    } catch (err) {
      console.error(err);
      alert("Gagal upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-800">Galeri Foto</h3>
        </div>
        {/* Tombol Upload Kecil di Header (Opsional) */}
        {userId && (
           <span className="text-[10px] text-slate-400">Bagikan momenmu disini</span>
        )}
      </div>

      {/* Grid Foto */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
        
        {/* TOMBOL TAMBAH FOTO (Hanya jika Login) */}
        {userId ? (
           <div 
             onClick={() => fileInputRef.current.click()}
             className="relative h-24 md:h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
           >
              {uploading ? (
                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
              ) : (
                <>
                  <div className="p-2 bg-white rounded-full shadow-sm mb-1 group-hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-600">Tambah</span>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleUserUpload} 
                accept="image/*" 
                className="hidden" 
                disabled={uploading}
              />
           </div>
        ) : (
           // Jika belum login, tampilkan placeholder ajakan login (Opsional)
           <div onClick={() => alert("Login untuk upload foto")} className="relative h-24 md:h-32 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50">
              <span className="text-[10px] text-slate-400 text-center px-2">Login untuk tambah foto</span>
           </div>
        )}

        {/* List Foto */}
        {localImages.map((imgUrl, index) => (
          <div 
            key={index}
            onClick={() => setSelectedImage(imgUrl)}
            className="relative h-24 md:h-32 rounded-xl overflow-hidden cursor-pointer group shadow-sm"
          >
            <img 
              src={imgUrl} 
              alt={`Galeri ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => e.target.style.display = 'none'} // Sembunyikan jika error
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-white drop-shadow-md" />
            </div>
          </div>
        ))}
      </div>

      {/* --- LIGHTBOX --- */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
        >
            <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-5 right-5 p-2 bg-white/10 rounded-full text-white hover:bg-white/30 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
            
            <img 
                src={selectedImage} 
                alt="Preview Besar" 
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl animate-scale-up"
            />
        </div>
      )}
    </div>
  );
}