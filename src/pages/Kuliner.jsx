import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Search, Loader2, AlertCircle, Grid, Utensils, Coffee, ShoppingBag, ArrowUpDown } from 'lucide-react';

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
  const ITEMS_PER_PAGE = 8; 

  // STATE SORTING
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'rating_desc' | 'rating_asc'

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
  }, [searchQuery, selectedCategory, sortBy]);

  const fetchKuliner = async () => {
    setLoading(true);
    try {
      // 1. Ambil Data Kuliner
      let { data: kulinerData, error: errKuliner } = await supabase
        .from('kuliner')
        .select('*')
        .order('id', { ascending: false });
      
      if (errKuliner) throw errKuliner;

      // 2. Ambil Data Review
      const { data: reviewsData, error: errReviews } = await supabase
        .from('reviews')
        .select('item_id, rating')
        .eq('item_type', 'kuliner');

      if (errReviews) throw errReviews;

      // 3. Gabungkan Rating
      const mergedData = kulinerData.map(item => {
        const itemReviews = reviewsData.filter(r => r.item_id === item.id);
        const totalRating = itemReviews.reduce((sum, r) => sum + r.rating, 0);
        
        // Hitung rata-rata (simpan ratingValue sebagai angka untuk sorting)
        const avgRatingNum = itemReviews.length > 0 ? (totalRating / itemReviews.length) : 0;
        const avgRatingStr = itemReviews.length > 0 ? avgRatingNum.toFixed(1) : 'New';

        return { 
            ...item, 
            rating: avgRatingStr,      
            ratingValue: avgRatingNum, 
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

  // --- LOGIKA FILTER & SORTING ---
  const getProcessedData = () => {
    // 1. Filter
    let data = kulinerList.filter(item => {
        const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    // 2. Sorting (Client Side)
    if (sortBy === 'rating_desc') {
        // Rating Tertinggi (B - A)
        data.sort((a, b) => b.ratingValue - a.ratingValue);
    } else if (sortBy === 'rating_asc') {
        // Rating Terendah (A - B) <-- LOGIKA BARU
        data.sort((a, b) => a.ratingValue - b.ratingValue);
    } else {
        // Default: Terbaru (ID)
        data.sort((a, b) => b.id - a.id);
    }

    return data;
  };

  const filteredKuliner = getProcessedData();

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
            fetchKuliner(); 
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
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Menampilkan <span className="font-bold text-slate-800 dark:text-white">
                    {filteredKuliner.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredKuliner.length)}
                  </span> dari <span className="font-bold text-slate-800 dark:text-white">{filteredKuliner.length}</span> kuliner
                </p>

                {/* TOMBOL SORTING */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-bold uppercase">Urutkan:</span>
                    <div className="relative">
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2 pl-4 pr-8 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
                        >
                            <option value="newest">Terbaru</option>
                            <option value="rating_desc">Rating Tertinggi ⭐</option>
                            <option value="rating_asc">Rating Terendah 👎</option>
                        </select>
                        <ArrowUpDown className="w-4 h-4 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                    </div>
                </div>
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