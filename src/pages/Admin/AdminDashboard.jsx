import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Plus, Edit, Trash2, MapPin, Loader2, ArrowLeft, Drama } from 'lucide-react';
import AdminForm from './AdminForm'; 

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('wisata'); // 'wisata', 'kuliner', 'budaya'
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Form
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    // Order by ID descending (terbaru diatas)
    const { data, error } = await supabase
      .from(activeTab)
      .select('*')
      .order('id', { ascending: false });
      
    if (error) console.error("Error fetching:", error);
    setDataList(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      const { error } = await supabase.from(activeTab).delete().eq('id', id);
      if (error) alert("Gagal hapus: " + error.message);
      else fetchData(); 
    }
  };

  if (showForm) {
    return (
      <AdminForm 
        tableName={activeTab} 
        initialData={editingItem} 
        onCancel={() => { setShowForm(false); setEditingItem(null); }}
        onSuccess={() => { setShowForm(false); setEditingItem(null); fetchData(); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 px-4 pt-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm"><ArrowLeft className="w-5 h-5"/></button>
            <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      {/* Tabs Navigasi */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm mb-6 border border-slate-200 overflow-x-auto">
        {['wisata', 'kuliner', 'budaya'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            className={`flex-1 py-2 px-4 text-sm font-bold rounded-lg transition-all capitalize ${
              activeTab === tab 
                ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List Data */}
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500"/></div>
      ) : (
        <div className="space-y-4">
          {dataList.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
              
              {/* Gambar Thumbnail */}
              <img 
                src={item.image_url} 
                alt={item.name || item.title} 
                className="w-20 h-20 rounded-xl object-cover bg-slate-200 flex-shrink-0" 
              />
              
              <div className="flex-1 min-w-0">
                {/* Handle Name (Wisata/Kuliner) vs Title (Budaya) */}
                <h3 className="font-bold text-slate-800 truncate">{item.name || item.title}</h3>
                
                {/* Lokasi hanya muncul di Wisata/Kuliner */}
                {item.location && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3 flex-shrink-0" /> {item.location}
                  </p>
                )}

                {/* Kategori Tag */}
                <div className="flex gap-2 mt-2">
                    <span className="inline-block text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200 font-medium uppercase">
                    {item.category}
                    </span>
                    {/* Tag Khusus Budaya */}
                    {activeTab === 'budaya' && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded border border-amber-100 font-bold">
                           <Drama className="w-3 h-3" /> Budaya
                        </span>
                    )}
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4 justify-center">
                <button 
                  onClick={() => { setEditingItem(item); setShowForm(true); }}
                  className="flex-1 sm:flex-none px-6 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-bold text-center"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 sm:flex-none px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold text-center"
                >
                  Hapus
                </button>
              </div>
              
            </div>
          ))}
          
          {dataList.length === 0 && (
             <div className="text-center py-10 text-slate-400 text-sm">Belum ada data di kategori ini.</div>
          )}
        </div>
      )}
    </div>
  );
}