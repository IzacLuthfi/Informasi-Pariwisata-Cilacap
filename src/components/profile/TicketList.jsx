import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Loader2, Calendar, Users, Ticket, X, ScanLine, CheckCircle, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// --- KOMPONEN MODAL PEMBAYARAN ---
function PaymentModal({ ticket, onClose, onPaymentSuccess }) {
  const [isScanning, setIsScanning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(ticket.status === 'paid');

  const handleSimulatePayment = async () => {
    setIsScanning(true);
    
    // 1. Simulasi Delay Scanning (2 detik)
    setTimeout(async () => {
        try {
            // 2. Update Status di Database
            const { error } = await supabase
                .from('tickets')
                .update({ status: 'paid' })
                .eq('id', ticket.id);

            if (error) throw error;

            // 3. Tampilkan Sukses
            setIsScanning(false);
            setIsSuccess(true);
            
            // 4. Refresh data di halaman utama setelah 1.5 detik
            setTimeout(() => {
                onPaymentSuccess();
                onClose();
            }, 1500);

        } catch (err) {
            alert("Gagal pembayaran: " + err.message);
            setIsScanning(false);
        }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative animate-scale-up flex flex-col items-center text-center p-6">
            
            <button onClick={onClose} className="absolute top-4 right-4 p-1 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 transition-colors">
                <X className="w-5 h-5 text-slate-500" />
            </button>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                {isSuccess ? 'Pembayaran Berhasil!' : 'Scan untuk Bayar'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
                {isSuccess ? 'Tiket Anda sudah aktif.' : 'Tunjukkan QR ini ke petugas atau scan.'}
            </p>

            {/* Area QR Code */}
            <div className="relative bg-white p-4 rounded-2xl shadow-inner border border-slate-200 mb-6">
                {isSuccess ? (
                    <div className="w-48 h-48 flex items-center justify-center bg-emerald-50 rounded-xl">
                        <CheckCircle className="w-24 h-24 text-emerald-500 animate-bounce" />
                    </div>
                ) : (
                    <div className="relative">
                         <QRCodeSVG value={ticket.booking_code} size={180} />
                         {/* Garis Scan Animasi */}
                         {isScanning && (
                             <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_10px_#10b981] animate-[scan_2s_infinite_linear]"></div>
                         )}
                    </div>
                )}
            </div>

            <div className="w-full bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl mb-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Total Tagihan</span>
                    <span className="font-bold text-slate-800 dark:text-white">{ticket.total_price}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Kode Booking</span>
                    <span className="font-mono font-bold text-emerald-600">{ticket.booking_code}</span>
                </div>
            </div>

            {/* Tombol Aksi */}
            {!isSuccess && (
                <button 
                    onClick={handleSimulatePayment}
                    disabled={isScanning}
                    className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isScanning ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                        </>
                    ) : (
                        <>
                            <ScanLine className="w-5 h-5" /> Simulasi Bayar
                        </>
                    )}
                </button>
            )}
        </div>
    </div>
  );
}


// --- KOMPONEN UTAMA LIST TIKET ---
export default function TicketList({ isActive }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null); // Untuk Modal

  useEffect(() => {
    if (isActive) fetchTickets();
  }, [isActive]);

  const fetchTickets = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data } = await supabase
            .from('tickets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        setTickets(data || []);
    }
    setLoading(false);
  };

  if (!isActive) return null;

  return (
    <div className="px-4 max-w-xl mx-auto mt-6">
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500"/></div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-10 text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
            <Ticket className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p className="text-xs">Belum ada tiket yang dibeli.</p>
        </div>
      ) : (
        <div className="space-y-4">
            {tickets.map((ticket) => (
                <div 
                    key={ticket.id} 
                    onClick={() => setSelectedTicket(ticket)} // Klik untuk bayar
                    className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700 relative cursor-pointer hover:scale-[1.02] transition-transform"
                >
                    {/* Hiasan Potongan Kertas */}
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 dark:bg-slate-900 rounded-full z-10"></div>
                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-50 dark:bg-slate-900 rounded-full z-10"></div>
                    <div className="absolute top-1/2 left-4 right-4 border-t-2 border-dashed border-slate-200 dark:border-slate-600"></div>

                    {/* Bagian Atas */}
                    <div className="p-5 pb-8">
                        <div className="flex justify-between items-start">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${
                                ticket.status === 'paid' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-amber-100 text-amber-700 animate-pulse'
                            }`}>
                                {ticket.status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                            </span>
                            <QrCode className="w-5 h-5 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-2">{ticket.wisata_name}</h3>
                        <div className="flex gap-4 mt-3">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                                <Calendar className="w-4 h-4" /> {ticket.visit_date}
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                                <Users className="w-4 h-4" /> {ticket.quantity} Orang
                            </div>
                        </div>
                    </div>

                    {/* Bagian Bawah */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Total Bayar</p>
                            <p className="text-lg font-bold text-emerald-600">{ticket.total_price}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Kode: {ticket.booking_code}</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <QRCodeSVG value={ticket.booking_code} size={50} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* MODAL SIMULASI BAYAR */}
      {selectedTicket && (
        <PaymentModal 
            ticket={selectedTicket} 
            onClose={() => setSelectedTicket(null)} 
            onPaymentSuccess={fetchTickets} // Refresh list setelah bayar
        />
      )}
    </div>
  );
}