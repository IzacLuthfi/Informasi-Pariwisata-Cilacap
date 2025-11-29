import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Search, Loader2, Drama, Map, Grid, Music, Users, Utensils } from 'lucide-react'; // Tambah Icon
import defaultImage from '../assets/pantai.jpg';
import BudayaDetail from '../components/budaya/BudayaDetail';
import Pagination from '../components/common/Pagination';
import CategoryFilter from '../components/common/CategoryFilter'; // Import Komponen Kategori Baru

export default function BudayaPage() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // State untuk Detail View
  const [selectedData, setSelectedData] = useState(null);

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6; // Batas 6 data per halaman

  // --- DEFINISI KATEGORI BUDAYA (DENGAN IKON & WARNA) ---
  const categories = [
    { name: 'Semua', icon: Grid, gradient: 'from-slate-600 to-slate-800', shadow: 'shadow-slate-500/30' },
    { name: 'Tarian', icon: Music, gradient: 'from-pink-500 to-rose-400', shadow: 'shadow-pink-500/30' },
    { name: 'Adat Istiadat', icon: Users, gradient: 'from-amber-500 to-orange-400', shadow: 'shadow-amber-500/30' },
    { name: 'Makanan Tradisional', icon: Utensils, gradient: 'from-emerald-500 to-teal-400', shadow: 'shadow-emerald-500/30' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // Reset halaman ke 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('budaya').select('*').order('id', { ascending: true });
      if (error) throw error;
      setDataList(data || []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  // Filter Logic
  const filteredData = dataList.filter(item => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // --- LOGIKA PAGINATION (POTONG DATA) ---
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- TAMPILKAN DETAIL JIKA ADA YANG DIPILIH ---
  if (selectedData) {
    return <BudayaDetail data={selectedData} onBack={() => setSelectedData(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 dark:bg-slate-900 transition-colors">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 pt-8 px-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                    <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full mb-2">
                        <Drama className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">Kearifan Lokal</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">Budaya Cilacap</h1>
                </div>
                
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" 
                      placeholder="Cari budaya..." 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                    />
                </div>
            </div>

            {/* --- MENGGUNAKAN COMPONENT KATEGORI BARU --- */}
            <CategoryFilter 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
                title="Jelajahi Budaya"
            />
        </div>
      </div>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>
        ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Menampilkan <span className="font-bold text-slate-800 dark:text-white">
                      {filteredData.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
                    </span> dari <span className="font-bold text-slate-800 dark:text-white">{filteredData.length}</span> budaya
                  </p>
                  <div className="hidden md:flex items-center text-xs text-slate-400 gap-1">
                    <Map className="w-3 h-3" />
                    <span>Database Supabase</span>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentData.map(item => (
                      <div 
                          key={item.id}
                          onClick={() => { setSelectedData(item); window.scrollTo(0,0); }}
                          className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 border border-slate-100 dark:border-slate-700 cursor-pointer transition-all duration-500"
                      >
                          <div className="relative h-64 overflow-hidden">
                              <img 
                                  src={item.image_url || defaultImage} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  onError={(e) => e.target.src = defaultImage}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                              <div className="absolute bottom-4 left-4 right-4">
                                  <span className="inline-block px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded mb-2 uppercase tracking-wide">{item.category}</span>
                                  <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-emerald-300 transition-colors">{item.title}</h3>
                              </div>
                          </div>
                          <div className="p-5">
                              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                  {item.description}
                              </p>
                              <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                  Baca Selengkapnya →
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

              {/* PAGINATION COMPONENT */}
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