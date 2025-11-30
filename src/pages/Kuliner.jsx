import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Search, Loader2, AlertCircle, Grid, Utensils, Coffee, ShoppingBag } from 'lucide-react';

// Import Komponen
import KulinerGrid from '../components/kuliner/KulinerGrid';
import KulinerDetail from '../components/kuliner/KulinerDetail';
import Pagination from '../components/common/Pagination';
import CategoryFilter from '../components/common/CategoryFilter'; 

export default function Kuliner() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [kulinerList, setKulinerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State Detail View
  const [selectedKulinerId, setSelectedKulinerId] = useState(null);

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8; // 8 Data per halaman

  // Definisi Kategori
  const categories = [
    { name: 'Semua', icon: Grid, gradient: 'from-slate-600 to-slate-800', shadow: 'shadow-slate-500/30' },
    { name: 'Makanan Berat', icon: Utensils, gradient: 'from-orange-500 to-amber-400', shadow: 'shadow-orange-500/30' },
    { name: 'Jajanan', icon: Coffee, gradient: 'from-pink-500 to-rose-400', shadow: 'shadow-pink-500/30' },
    { name: 'Oleh-oleh', icon: ShoppingBag, gradient: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/30' },
  ];

  // --- FETCH DATA ---
  useEffect(() => {
    fetchKuliner();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const fetchKuliner = async () => {
    setLoading(true);
    try {
      // 1. Ambil Data Kuliner
      let { data: kulinerData, error: errKuliner } = await supabase
        .from('kuliner')
        .select('*')
        .order('id', { ascending: false });
      
      if (errKuliner) throw errKuliner;

      // 2. Ambil Data Review (Hanya Rating) untuk Kuliner
      const { data: reviewsData, error: errReviews } = await supabase
        .from('reviews')
        .select('item_id, rating')
        .eq('item_type', 'kuliner'); // Filter khusus kuliner

      if (errReviews) throw errReviews;

      // 3. Gabungkan Rating ke Data Kuliner
      const mergedData = kulinerData.map(item => {
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

      setKulinerList(mergedData || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal memuat data kuliner.');
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIKA FILTER ---
  const filteredKuliner = kulinerList.filter(item => {
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // --- LOGIKA PAGINATION ---
  const totalPages = Math.ceil(filteredKuliner.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredKuliner.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- TAMPILAN DETAIL ---
  if (selectedKulinerId) {
    return (
      <KulinerDetail 
        kulinerId={selectedKulinerId} 
        onBack={() => { 
            setSelectedKulinerId(null); 
            fetchKuliner(); // Refresh data saat kembali agar rating terupdate
            window.scrollTo(0, 0); 
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
              <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full mb-2">
                <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Cita Rasa Nusantara</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">Kuliner Cilacap</h1>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input 
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                placeholder="Cari makanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Kategori Filter Baru */}
          <CategoryFilter 
             categories={categories} 
             selectedCategory={selectedCategory} 
             onSelectCategory={setSelectedCategory} 
             title="Jenis Kuliner"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <span className="text-slate-500 dark:text-slate-400">Menyiapkan hidangan...</span>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 p-6 rounded-2xl text-center text-red-600 border border-red-100">
             <AlertCircle className="w-10 h-10 mx-auto mb-2" />
             <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
           <>
             <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Menampilkan <span className="font-bold text-slate-800 dark:text-white">
                    {filteredKuliner.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredKuliner.length)}
                  </span> dari <span className="font-bold text-slate-800 dark:text-white">{filteredKuliner.length}</span> kuliner
                </p>
             </div>

             {/* GRID KULINER */}
             <KulinerGrid 
               kulinerList={currentData} 
               onItemClick={(id) => setSelectedKulinerId(id)} 
             />
             
             {/* PAGINATION */}
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