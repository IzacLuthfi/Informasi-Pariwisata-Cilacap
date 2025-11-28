import { X, MapPin } from 'lucide-react';

export default function DetailMapModal({ mapUrl, onClose }) {
  if (!mapUrl) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in px-4">
        <div className="bg-white w-full max-w-3xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl relative animate-scale-up flex flex-col">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-400"/> Peta Lokasi</h3>
                <button onClick={onClose} className="p-1 bg-white/20 rounded-full hover:bg-red-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 bg-slate-200">
                <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map Besar"></iframe>
            </div>
        </div>
    </div>
  );
}