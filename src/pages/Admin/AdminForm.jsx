import { useState, useRef } from 'react';
import { supabase } from '../../services/supabaseClient';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';

export default function AdminForm({ tableName, initialData, onCancel, onSuccess }) {
  const [loading, setLoading] = useState(false);
  
  // State Form
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    location: initialData?.location || '',
    price: initialData?.price || initialData?.price_range || '', // Handle beda nama kolom
    description: initialData?.description || '',
    facilities: initialData?.facilities ? initialData.facilities.join(', ') : '', // Array to String
    map_url: initialData?.map_url || '',
    image_url: initialData?.image_url || ''
  });

  const fileInputRef = useRef(null);

  // Upload Gambar
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('content').upload(fileName, file); // Pastikan bucket 'content' dibuat
      if (error) throw error;
      
      const { data } = supabase.storage.from('content').getPublicUrl(fileName);
      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (err) {
      alert("Gagal upload gambar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format data sebelum kirim
      const payload = {
        name: formData.name,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        image_url: formData.image_url,
        map_url: formData.map_url
      };

      // Penyesuaian kolom khusus
      if (tableName === 'wisata') {
        payload.price = formData.price;
        // Ubah string "Parkir, Toilet" jadi Array ["Parkir", "Toilet"]
        payload.facilities = formData.facilities.split(',').map(f => f.trim());
      } else {
        payload.price_range = formData.price; // Kuliner pakai price_range
      }

      let error;
      if (initialData) {
        // UPDATE MODE
        const { error: updateError } = await supabase.from(tableName).update(payload).eq('id', initialData.id);
        error = updateError;
      } else {
        // INSERT MODE
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
        <h1 className="text-xl font-bold text-slate-800">
          {initialData ? 'Edit Data' : 'Tambah Data'} {tableName === 'wisata' ? 'Wisata' : 'Kuliner'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Image Upload */}
        <div className="w-full h-48 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer" onClick={() => fileInputRef.current.click()}>
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

        {/* Inputs */}
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Nama Tempat</label>
            <input type="text" required className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
                <input type="text" required placeholder="Contoh: Pantai" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">{tableName === 'wisata' ? 'Harga Tiket' : 'Range Harga'}</label>
                <input type="text" required placeholder="Rp 10.000" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
        </div>

        <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Lokasi</label>
            <input type="text" required className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
        </div>

        <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Map URL (Embed Link)</label>
            <input type="text" placeholder="https://www.google.com/maps/embed?..." className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1 text-sm" value={formData.map_url} onChange={e => setFormData({...formData, map_url: e.target.value})} />
        </div>

        <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Deskripsi</label>
            <textarea required rows={4} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        {tableName === 'wisata' && (
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Fasilitas (Pisahkan dengan koma)</label>
                <input type="text" placeholder="Parkir, Toilet, Mushola" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1" value={formData.facilities} onChange={e => setFormData({...formData, facilities: e.target.value})} />
            </div>
        )}

        <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-emerald-600 transition-colors">
            {loading ? <Loader2 className="animate-spin"/> : <Save className="w-5 h-5"/>} Simpan Data
        </button>

      </form>
    </div>
  );
}