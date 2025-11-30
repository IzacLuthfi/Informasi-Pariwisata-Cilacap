import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { X, Calendar, Users, Loader2, Ticket } from 'lucide-react';

export default function BookingModal({ wisata, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [qty, setQty] = useState(1);

  // Helper: Ubah "Rp 10.000" jadi angka 10000
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    return parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
  };

  const pricePerItem = parsePrice(wisata.price);
  const totalPrice = pricePerItem * qty;

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Anda harus login untuk memesan tiket.");

      // Generate Kode Unik (Misal: TIKET-12345)
      const code = `TIKET-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 1000)}`;

      const { error } = await supabase.from('tickets').insert({
        user_id: user.id,
        wisata_id: wisata.id,
        wisata_name: wisata.name,
        visit_date: date,
        quantity: qty,
        total_price: `Rp ${totalPrice.toLocaleString('id-ID')}`,
        booking_code: code
      });

      if (error) throw error;

      alert("Tiket berhasil dipesan! Cek di menu Profil.");
      onSuccess(); // Tutup modal & refresh jika perlu
    } catch (err) {
      alert("Gagal pesan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 animate-slide-up md:animate-scale-up">
        
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Pesan Tiket</h3>
            <button onClick={onClose} className="p-1 bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
        </div>

        <div className="flex gap-4 mb-6 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0">
                <img src={wisata.image_url} className="w-full h-full object-cover" alt="Thumb" />
            </div>
            <div>
                <h4 className="font-bold text-slate-800 line-clamp-1">{wisata.name}</h4>
                <p className="text-emerald-600 font-bold text-sm mt-1">{wisata.price} <span className="text-slate-400 font-normal">/ orang</span></p>
            </div>
        </div>

        <form onSubmit={handleBooking} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Tanggal Kunjungan</label>
                <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input type="date" required className="w-full pl-10 p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none" value={date} onChange={e => setDate(e.target.value)} />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Jumlah Pengunjung</label>
                <div className="relative mt-1">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input type="number" min="1" max="20" required className="w-full pl-10 p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none" value={qty} onChange={e => setQty(e.target.value)} />
                </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Total Bayar</span>
                <span className="text-2xl font-extrabold text-slate-900">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin"/> : <Ticket className="w-5 h-5"/>} Bayar & Cetak Tiket
            </button>
        </form>

      </div>
    </div>
  );
}