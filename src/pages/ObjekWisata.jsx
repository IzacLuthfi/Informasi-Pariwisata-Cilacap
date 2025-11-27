import { useState, useEffect } from 'react';
import WisataGrid from '../components/wisata/WisataGrid';
import WisataDetail from '../components/wisata/WisataDetail'; // Import Baru
import { Search, Map, Filter, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient'; 

export default function ObjekWisata() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [wisataList, setWisataList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // STATE BARU: Menyimpan ID wisata yang diklik
  const [selectedWisataId, setSelectedWisataId] = useState(null); 

  const categories = ['Semua', 'Pantai', 'Sejarah', 'Alam', 'Budaya'];

  useEffect(() => {
    fetchWisata();
  }, []);

  const fetchWisata = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase.from('wisata').select('*');
      if (error) throw error;
      setWisataList(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal memuat data wisata.');
    } finally {
      setLoading(false);
    }
  };

  const filteredWisata = wisataList.filter(item => {
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // --- LOGIKA TAMPILAN DETAIL ---
  // Jika ada ID yang dipilih, tampilkan halaman Detail
  if (selectedWisataId) {
    return (
      <WisataDetail 
        wisataId={selectedWisataId} 
        onBack={() => {
            setSelectedWisataId(null); // Tombol Back: Reset ID jadi null
            window.scrollTo(0,0);      // Scroll ke atas
        }} 
      />
    );
  }

  // --- LOGIKA TAMPILAN GRID (DEFAULT) ---
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      
      {/* Header */}
      <div className="bg-white pb-6 pt-8 md:pt-12 px-4 shadow-sm border-b border-slate-100 sticky top-0 md:static z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                Destinasi <span className="text-emerald-600">Wisata</span>
              </h1>
              <p className="text-slate-500 mt-2 text-sm md:text-base max-w-lg">
                Temukan surga tersembunyi di Cilacap.
              </p>
            </div>
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                placeholder="Cari tempat wisata..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar py-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 mr-2">
               <Filter className="w-4 h-4 text-slate-500" />
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0 whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <span className="text-slate-500 font-medium">Sedang mengambil data...</span>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600">
            <AlertCircle className="w-10 h-10 mx-auto mb-2" />
            <p>{error}</p>
            <button onClick={fetchWisata} className="mt-4 text-sm font-bold underline">Coba Lagi</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500">
                Menampilkan <span className="font-bold text-slate-800">{filteredWisata.length}</span> destinasi
              </p>
              <div className="hidden md:flex items-center text-xs text-slate-400 gap-1">
                <Map className="w-3 h-3" />
                <span>Database Supabase</span>
              </div>
            </div>
            
            {/* Pass fungsi onItemClick untuk set ID */}
            <WisataGrid 
                wisataList={filteredWisata} 
                onItemClick={(id) => setSelectedWisataId(id)} 
            />
          </>
        )}
      </main>
    </div>
  );
}