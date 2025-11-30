import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Search, Loader2, AlertCircle, Grid, Waves, Landmark, Mountain, Drama, Map } from 'lucide-react';

// Import Komponen
import WisataGrid from '../components/wisata/WisataGrid';
import WisataDetail from '../components/wisata/WisataDetail';
import Pagination from '../components/common/Pagination';
import CategoryFilter from '../components/common/CategoryFilter'; 

export default function ObjekWisata() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [wisataList, setWisataList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State Detail View
  const [selectedWisataId, setSelectedWisataId] = useState(null); 

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9; 

  // --- DEFINISI KATEGORI ---
  const categories = [
    { name: 'Semua', icon: Grid, gradient: 'from-slate-600 to-slate-800', shadow: 'shadow-slate-500/30' },
    { name: 'Pantai', icon: Waves, gradient: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/30' },
    { name: 'Sejarah', icon: Landmark, gradient: 'from-amber-500 to-orange-400', shadow: 'shadow-amber-500/30' },
    { name: 'Alam', icon: Mountain, gradient: 'from-green-500 to-lime-400', shadow: 'shadow-green-500/30' },
    { name: 'Budaya', icon: Drama, gradient: 'from-rose-500 to-pink-400', shadow: 'shadow-rose-500/30' },
  ];

  // --- FETCH DATA ---
  useEffect(() => {
    fetchWisata();
  }, []);

  // Reset halaman ke 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const fetchWisata = async () => {
    setLoading(true);
    try {
      // 1. Ambil Data Wisata
      const { data: wisataData, error: errWisata } = await supabase
        .from('wisata')
        .select('*')
        .order('id', { ascending: false });
      
      if (errWisata) throw errWisata;

      // 2. Ambil Data Review (Hanya Rating) untuk Wisata
      const { data: reviewsData, error: errReviews } = await supabase
        .from('reviews')
        .select('item_id, rating')
        .eq('item_type', 'wisata');

      if (errReviews) throw errReviews;

      // 3. Gabungkan Rating ke Data Wisata
      const mergedData = wisataData.map(item => {
        // Cari semua review untuk item ini
        const itemReviews = reviewsData.filter(r => r.item_id === item.id);
        
        // Hitung Rata-rata
        const totalRating = itemReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = itemReviews.length > 0 
            ? (totalRating / itemReviews.length).toFixed(1) 
            : 'New'; // Jika belum ada review, tampilkan 'New'

        return { 
            ...item, 
            rating: avgRating, 
            total_reviews: itemReviews.length 
        };
      });

      setWisataList(mergedData || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal memuat data wisata.');
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIKA FILTER ---
  const filteredWisata = wisataList.filter(item => {
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // --- LOGIKA PAGINATION ---
  const totalPages = Math.ceil(filteredWisata.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredWisata.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- TAMPILAN DETAIL ---
  if (selectedWisataId) {
    return (
      <WisataDetail 
        wisataId={selectedWisataId} 
        onBack={() => { 
            setSelectedWisataId(null); 
            fetchWisata(); // Refresh data saat kembali (agar rating terupdate jika baru memberi ulasan)
            window.scrollTo(0,0); 
        }} 
      />
    );
  }

  // --- TAMPILAN UTAMA ---
  return (
    <div className="min-h-screen bg-slate-50 pb-24 dark:bg-slate-900 transition-colors">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 pt-8 px-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                Destinasi <span className="text-emerald-600 dark:text-emerald-400">Wisata</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base max-w-lg">
                Temukan surga tersembunyi di Cilacap.
              </p>
            </div>
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:text-white transition-all shadow-inner"
                placeholder="Cari tempat wisata..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Kategori Filter */}
          <CategoryFilter 
             categories={categories} 
             selectedCategory={selectedCategory} 
             onSelectCategory={setSelectedCategory} 
             title="Kategori Wisata"
          />

        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">Sedang mengambil data...</span>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 p-6 rounded-2xl text-center text-red-600 border border-red-100">
            <AlertCircle className="w-10 h-10 mx-auto mb-2" />
            <p>{error}</p>
            <button onClick={fetchWisata} className="mt-4 text-sm font-bold underline">Coba Lagi</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Menampilkan <span className="font-bold text-slate-800 dark:text-white">
                  {filteredWisata.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredWisata.length)}
                </span> dari <span className="font-bold text-slate-800 dark:text-white">{filteredWisata.length}</span> destinasi
              </p>
              <div className="hidden md:flex items-center text-xs text-slate-400 gap-1">
                <Map className="w-3 h-3" />
                <span>Database Supabase</span>
              </div>
            </div>
            
            {/* Grid Wisata */}
            <WisataGrid 
                wisataList={currentData} 
                onItemClick={(id) => setSelectedWisataId(id)} 
            />

            {/* Pagination */}
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />
          </>
        )}
      </main>
    </div>
  );
}