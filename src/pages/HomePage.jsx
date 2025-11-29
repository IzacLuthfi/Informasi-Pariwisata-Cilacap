import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

// --- Import Komponen UI ---
import HomeHero from '../components/home/HomeHero';
import CategoryScroll from '../components/home/CategoryScroll';
import TrendingWisata from '../components/home/TrendingWisata';
import KulinerScroll from '../components/home/KulinerScroll';
import BudayaScroll from '../components/home/BudayaScroll'; // Komponen Budaya

// --- Import Komponen Detail (Untuk fitur klik) ---
import WisataDetail from '../components/wisata/WisataDetail';
import KulinerDetail from '../components/kuliner/KulinerDetail';
import BudayaDetail from '../components/budaya/BudayaDetail';

// --- Import Icons ---
import { Loader2, X, Clock, Ticket, MapPin, Info } from 'lucide-react';

export default function HomePage() {
  // --- STATE MANAGEMENT ---
  const [wisataList, setWisataList] = useState([]);
  const [kulinerList, setKulinerList] = useState([]);
  const [budayaList, setBudayaList] = useState([]); // State Data Budaya
  const [loading, setLoading] = useState(true);

  // State Filter & Search
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal Promo
  const [showPromo, setShowPromo] = useState(false);

  // State Navigasi Detail (Switch View)
  const [detailWisataId, setDetailWisataId] = useState(null);
  const [detailKulinerId, setDetailKulinerId] = useState(null);
  const [detailBudayaData, setDetailBudayaData] = useState(null); // State Detail Budaya

  // --- 1. FETCH DATA DARI SUPABASE ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Ambil data Wisata (Semua, nanti difilter)
        const { data: wisataData } = await supabase
          .from('wisata')
          .select('*')
          .order('id', { ascending: false });
        
        // 2. Ambil data Kuliner (Limit 10 untuk scroll)
        const { data: kulinerData } = await supabase
          .from('kuliner')
          .select('*')
          .limit(10);

        // 3. Ambil data Budaya (Semua data)
        const { data: budayaData } = await supabase
          .from('budaya')
          .select('*')
          .order('id', { ascending: true });

        if (wisataData) setWisataList(wisataData);
        if (kulinerData) setKulinerList(kulinerData);
        if (budayaData) setBudayaList(budayaData);

      } catch (error) {
        console.error("Gagal mengambil data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. LOGIKA FILTER WISATA (Kategori + Search) ---
  const filteredWisata = wisataList.filter(item => {
    const itemName = item.name ? item.name.toLowerCase() : '';
    const itemLocation = item.location ? item.location.toLowerCase() : '';
    const itemCategory = item.category || '';
    const query = searchQuery.toLowerCase();

    const matchCategory = selectedCategory === 'Semua' || itemCategory === selectedCategory;
    const matchSearch = itemName.includes(query) || itemLocation.includes(query);

    return matchCategory && matchSearch;
  });

  // Ambil 5 item teratas untuk bagian "Trending" agar layout pas
  const displayWisata = filteredWisata.slice(0, 5);


  // --- 3. RENDERING KONDISIONAL (DETAIL VIEW) ---
  
  // Jika User Klik Wisata -> Tampilkan Detail Wisata
  if (detailWisataId) {
    return (
      <WisataDetail 
        wisataId={detailWisataId} 
        onBack={() => { 
          setDetailWisataId(null); 
          window.scrollTo(0,0); 
        }} 
      />
    );
  }

  // Jika User Klik Kuliner -> Tampilkan Detail Kuliner
  if (detailKulinerId) {
    return (
      <KulinerDetail 
        kulinerId={detailKulinerId} 
        onBack={() => { 
          setDetailKulinerId(null); 
          window.scrollTo(0,0); 
        }} 
      />
    );
  }

  // Jika User Klik Budaya -> Tampilkan Detail Budaya
  if (detailBudayaData) {
     return (
        <BudayaDetail 
            data={detailBudayaData} 
            onBack={() => { 
                setDetailBudayaData(null); 
                window.scrollTo(0,0); 
            }} 
        />
     );
  }

  // Jika Loading Data Awal
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // --- 4. RENDERING UTAMA (DASHBOARD) ---
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20 transition-colors duration-300">
      
      {/* 1. Hero Section (Search Bar) */}
      <HomeHero 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="relative z-20 -mt-10 md:-mt-16 space-y-10 max-w-7xl mx-auto">
        
        {/* 2. Kategori Cepat */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-white/50 dark:border-slate-700 py-6 rounded-t-3xl md:rounded-3xl md:shadow-lg md:mx-4 transition-colors duration-300">
          <CategoryScroll 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </div>

        {/* 3. Trending Wisata */}
        {displayWisata.length > 0 ? (
          <TrendingWisata 
            featuredWisata={displayWisata} 
            onItemClick={(id) => setDetailWisataId(id)} 
          />
        ) : (
          <div className="text-center py-10 text-slate-400">
            <p>Tidak ada wisata yang cocok dengan pencarian.</p>
          </div>
        )}

        {/* 4. Section Budaya (Scroll Horizontal) */}
        {/* Data diambil dari 'budayaList' */}
        <BudayaScroll 
            budayaList={budayaList} 
            onItemClick={(id) => {
                // Cari data objek lengkap berdasarkan ID untuk dikirim ke detail
                const selected = budayaList.find(b => b.id === id);
                setDetailBudayaData(selected);
            }} 
        />

        {/* 5. Section Kuliner (Scroll Horizontal) */}
        {/* Data diambil dari 'kulinerList' */}
        <div className="bg-slate-50 dark:bg-slate-900/50 py-4 border-t border-slate-100 dark:border-slate-800">
            <KulinerScroll 
              featuredKuliner={kulinerList} 
              onItemClick={(id) => setDetailKulinerId(id)} 
            />
        </div>

        {/* 6. Banner Promosi */}
        <div className="px-4">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 md:p-8 flex items-center justify-between text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
            {/* Hiasan Blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            
            <div className="relative z-10">
              <h3 className="font-bold text-lg md:text-2xl mb-1">Liburan ke Nusakambangan?</h3>
              <p className="text-emerald-100 text-xs md:text-sm">Cek jadwal penyeberangan dan tiket sekarang.</p>
            </div>
            
            <button 
              onClick={() => setShowPromo(true)}
              className="relative z-10 bg-white text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-emerald-50 transition-colors active:scale-95"
            >
              Cek Info
            </button>
          </div>
        </div>

      </div>

      {/* --- MODAL POPUP (Jadwal Nusakambangan) --- */}
      {showPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in px-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Header Modal */}
            <div className="relative h-32 bg-emerald-600 flex items-center justify-center">
                <button 
                  onClick={() => setShowPromo(false)}
                  className="absolute top-4 right-4 bg-black/20 text-white p-1 rounded-full hover:bg-black/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-bold text-white tracking-wide">Info Penyeberangan</h3>
                <div className="absolute bottom-0 w-full h-4 bg-white dark:bg-slate-800 rounded-t-3xl"></div>
            </div>

            {/* Isi Modal */}
            <div className="p-6 pt-2 space-y-5">
                
                {/* Info Jam */}
                <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                        <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Jam Operasional</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Senin - Minggu</p>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">07.00 - 16.00 WIB</p>
                    </div>
                </div>

                {/* Info Harga */}
                <div className="flex items-start gap-4">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl">
                        <Ticket className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Harga Tiket Perahu</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Pulang Pergi (PP)</p>
                        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">Rp 30.000 - Rp 50.000 / orang</p>
                    </div>
                </div>

                {/* Info Lokasi */}
                <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                        <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Titik Kumpul</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            1. Dermaga Seleko<br/>
                            2. Pantai Teluk Penyu
                        </p>
                    </div>
                </div>

                {/* Note */}
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl flex gap-3 items-start border border-slate-100 dark:border-slate-700">
                    <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                        Wajib membawa kartu identitas (KTP/SIM). Patuhi aturan keselamatan.
                    </p>
                </div>

                <button 
                  onClick={() => setShowPromo(false)}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity"
                >
                    Mengerti
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}