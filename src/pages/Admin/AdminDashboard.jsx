import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Plus, Edit, Trash2, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import AdminForm from './AdminForm'; // Kita buat di Langkah 3

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('wisata'); // 'wisata' or 'kuliner'
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Form (Add/Edit)
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Load Data
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from(activeTab).select('*').order('id', { ascending: false });
    setDataList(data || []);
    setLoading(false);
  };

  // Fungsi Hapus
  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      const { error } = await supabase.from(activeTab).delete().eq('id', id);
      if (error) alert("Gagal hapus: " + error.message);
      else fetchData(); // Reload data
    }
  };

  // Jika sedang membuka Form
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
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Tambah Baru
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm mb-6 border border-slate-200">
        <button 
          onClick={() => setActiveTab('wisata')} 
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'wisata' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'}`}
        >
          Wisata
        </button>
        <button 
          onClick={() => setActiveTab('kuliner')} 
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'kuliner' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'}`}
        >
          Kuliner
        </button>
      </div>

      {/* List Content */}
      {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500"/></div> : (
        <div className="space-y-4">
          {dataList.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
              <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-slate-200" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 truncate">{item.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {item.location}
                </p>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200">
                  {item.category}
                </span>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <button 
                  onClick={() => { setEditingItem(item); setShowForm(true); }}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}