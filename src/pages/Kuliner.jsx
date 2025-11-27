import { useState, useEffect } from 'react';
import KulinerGrid from '../components/kuliner/KulinerGrid';
import KulinerDetail from '../components/kuliner/KulinerDetail'; // Import Baru
import { Search, UtensilsCrossed, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function Kuliner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [kulinerList, setKulinerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // STATE BARU: ID Kuliner yang dipilih
  const [selectedKulinerId, setSelectedKulinerId] = useState(null);

  const categories = ['Semua', 'Makanan Berat', 'Jajanan', 'Oleh-oleh'];

  useEffect(() => {
    fetchKuliner();
  }, []);

  const fetchKuliner = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase.from('kuliner').select('*');
      if (error) throw error;
      setKulinerList(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal memuat data kuliner.');
    } finally {
      setLoading(false);
    }
  };

  const filteredKuliner = kulinerList.filter(item => {
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // --- LOGIKA TAMPILAN DETAIL ---
  if (selectedKulinerId) {
    return (
      <KulinerDetail 
        kulinerId={selectedKulinerId} 
        onBack={() => {
            setSelectedKulinerId(null);
            window.scrollTo(0, 0);
        }} 
      />
    );
  }

  // --- LOGIKA TAMPILAN GRID ---
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-100 pt-8 pb-6 px-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-100/50 px-3 py-1 rounded-full mb-3">
                <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Cita Rasa Nusantara</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-2">
                Kuliner <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Cilacap</span>
              </h1>
            </div>

            <div className="w-full md:w-96 bg-slate-50 p-2 rounded-2xl border border-slate-200 flex items-center">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input 
                type="text"
                className="w-full px-3 py-2 text-slate-700 bg-transparent focus:outline-none placeholder-slate-400"
                placeholder="Cari makanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-white border-slate-800 shadow-lg'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <span className="text-slate-500">Menyiapkan hidangan...</span>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 p-6 rounded-2xl text-center text-red-600">
             <AlertCircle className="w-10 h-10 mx-auto mb-2" />
             <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
           <KulinerGrid 
             kulinerList={filteredKuliner} 
             onItemClick={(id) => setSelectedKulinerId(id)} 
           />
        )}
      </main>
    </div>
  );
}