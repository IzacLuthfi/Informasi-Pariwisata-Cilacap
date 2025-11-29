import { useState, useRef } from 'react';
import { supabase } from '../../services/supabaseClient';
import { ArrowLeft, Upload, Loader2, Save, X, ImagePlus } from 'lucide-react';

export default function AdminForm({ tableName, initialData, onCancel, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  
  // Helper: Cek apakah ini form budaya
  const isBudaya = tableName === 'budaya';

  // State Form
  const [formData, setFormData] = useState({
    name: initialData?.name || initialData?.title || '', 
    category: initialData?.category || '',
    location: initialData?.location || '',
    price: initialData?.price || initialData?.price_range || '', 
    description: initialData?.description || '',
    facilities: initialData?.facilities ? initialData.facilities.join(', ') : '', 
    map_url: initialData?.map_url || '',
    image_url: initialData?.image_url || '',
    gallery: initialData?.gallery || []
  });

  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // 1. Upload Gambar Utama (Single)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const fileName = `main_${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('content').upload(fileName, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from('content').getPublicUrl(fileName);
      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (err) {
      alert("Gagal upload gambar utama: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Upload Galeri (Multiple)
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingGallery(true);
    const newUrls = [];

    try {
      for (const file of files) {
        const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;
        const { error } = await supabase.storage.from('content').upload(fileName, file);
        
        if (!error) {
            const { data } = supabase.storage.from('content').getPublicUrl(fileName);
            newUrls.push(data.publicUrl);
        }
      }

      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...newUrls]
      }));

    } catch (err) {
      alert("Gagal upload galeri: " + err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  // 3. Hapus Satu Foto dari Galeri
  const removeGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
        ...prev,
        gallery: prev.gallery.filter((_, index) => index !== indexToRemove)
    }));
  };

  // 4. Submit Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Base Payload (Semua tabel butuh ini)
      const payload = {
        category: formData.category,
        description: formData.description,
        image_url: formData.image_url,
        gallery: formData.gallery // Pastikan galeri ikut terkirim
      };

      // KONDISI PER TABEL
      if (isBudaya) {
        // Budaya pakai 'title', tidak butuh lokasi/harga
        payload.title = formData.name; 
      } else {
        // Wisata & Kuliner pakai 'name', 'location', 'map_url', 'gallery'
        payload.name = formData.name;
        payload.location = formData.location;
        payload.map_url = formData.map_url;

        if (tableName === 'wisata') {
            payload.price = formData.price;
            // Pastikan facilities dikirim sebagai Array
            payload.facilities = formData.facilities ? formData.facilities.split(',').map(f => f.trim()) : [];
        } else { // kuliner
            payload.price_range = formData.price;
        }
      }

      let error;
      if (initialData) {
        // UPDATE
        const { error: updateError } = await supabase.from(tableName).update(payload).eq('id', initialData.id);
        error = updateError;
      } else {
        // INSERT
        const { error: insertError } = await supabase.from(tableName).insert(payload);
        error = insertError;
      }

      if (error) throw error;
      alert("Berhasil disimpan!");
      onSuccess();

    } catch (err) {
      alert("Gagal simpan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 px-4 pt-8 animate-fade-in-up">
      {/* Header Form */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="p-2 bg-slate-100 rounded-full"><ArrowLeft className="w-5 h-5"/></button>
        <h1 className="text-xl font-bold text-slate-800 capitalize">
          {initialData ? 'Edit' : 'Tambah'} {tableName}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. GAMBAR UTAMA (Semua butuh) */}
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Foto Utama</label>
            <div className="w-full h-48 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-emerald-400 transition-colors" onClick={() => fileInputRef.current.click()}>
            {formData.image_url ? (
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
            ) : (
                <div className="text-center text-slate-400">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <span className="text-xs">Klik untuk upload foto</span>
                </div>
            )}
            {loading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="animate-spin text-white"/></div>}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
        </div>

        {/* 2. GALERI FOTO (Sekarang muncul untuk SEMUA TABEL termasuk Budaya) */}
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Galeri Foto</label>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
                {/* List Foto */}
                {formData.gallery.map((url, idx) => (
                    <div key={idx} className="relative h-24 rounded-xl overflow-hidden group border border-slate-200">
                        <img src={url} alt={`Galeri ${idx}`} className="w-full h-full object-cover" />
                        <button 
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {/* Tombol Tambah */}
                <div 
                    onClick={() => galleryInputRef.current.click()}
                    className="h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-emerald-400 hover:text-emerald-500 transition-colors bg-slate-50"
                >
                    {uploadingGallery ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImagePlus className="w-6 h-6" />}
                    <span className="text-[10px] mt-1 font-medium">Tambah</span>
                </div>
            </div>
            <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} className="hidden" accept="image/*" multiple />
        </div>

        {/* 3. INPUT FIELDS */}
        <div className="space-y-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Nama / Judul</label>
                <input type="text" required className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            {/* Kategori & Harga/Lokasi */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
                    <input type="text" required placeholder={isBudaya ? "Contoh: Tarian" : "Contoh: Pantai"} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                
                {!isBudaya && (
                    <>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">{tableName === 'wisata' ? 'Harga Tiket' : 'Range Harga'}</label>
                            <input type="text" required placeholder="Rp 10.000" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Lokasi</label>
                            <input type="text" required className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Map URL (Embed Link)</label>
                            <input type="text" placeholder="http://googleusercontent.com/maps..." className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1 text-sm" value={formData.map_url} onChange={e => setFormData({...formData, map_url: e.target.value})} />
                        </div>
                    </>
                )}
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Deskripsi</label>
                <textarea required rows={6} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            {tableName === 'wisata' && (
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Fasilitas (Pisahkan koma)</label>
                    <input type="text" placeholder="Parkir, Toilet, Mushola" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1" value={formData.facilities} onChange={e => setFormData({...formData, facilities: e.target.value})} />
                </div>
            )}
        </div>

        <button disabled={loading || uploadingGallery} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg sticky bottom-4">
            {loading ? <Loader2 className="animate-spin"/> : <Save className="w-5 h-5"/>} Simpan Data
        </button>

      </form>
    </div>
  );
}