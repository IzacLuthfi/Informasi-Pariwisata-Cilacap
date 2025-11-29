import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Loader2 } from 'lucide-react';

// Import semua komponen detail yang sudah ada
import WisataDetail from '../wisata/WisataDetail';
import KulinerDetail from '../kuliner/KulinerDetail';
import BudayaDetail from '../budaya/BudayaDetail';

export default function ProfileDetailView({ item, onBack }) {
  const [budayaData, setBudayaData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khusus untuk Budaya, kita perlu fetch manual di sini
  // Karena komponen BudayaDetail meminta 'data' object, bukan 'id'
  useEffect(() => {
    if (item.type === 'budaya') {
      const fetchBudaya = async () => {
        setLoading(true);
        const { data } = await supabase
          .from('budaya')
          .select('*')
          .eq('id', item.id)
          .single();
        setBudayaData(data);
        setLoading(false);
      };
      fetchBudaya();
    } else {
      // Untuk Wisata & Kuliner, loading tidak diperlukan di sini
      // karena komponen mereka menghandle loading sendiri
      setLoading(false);
    }
  }, [item]);

  // 1. Tampilan Loading (Khusus fetch budaya)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // 2. Logic Switcher: Tampilkan Detail sesuai Tipe
  switch (item.type) {
    case 'wisata':
      return <WisataDetail wisataId={item.id} onBack={onBack} />;
    
    case 'kuliner':
      return <KulinerDetail kulinerId={item.id} onBack={onBack} />;
    
    case 'budaya':
      // Budaya butuh data object penuh
      return budayaData ? <BudayaDetail data={budayaData} onBack={onBack} /> : null;

    default:
      return null;
  }
}