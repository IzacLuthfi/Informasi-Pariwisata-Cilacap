import { Tag, Clock, MapPin, Navigation } from 'lucide-react';

export default function DetailSidebar({ price, mapUrl, onOpenMap, isKuliner }) {
  return (
    <div className="md:w-80 flex-shrink-0">
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl p-6 sticky top-24">
            <h3 className="font-bold text-slate-800 text-lg mb-4">{isKuliner ? 'Info Menu' : 'Informasi Tiket'}</h3>
            
            <div className="flex justify-between mb-4 pb-4 border-b border-slate-50">
                <div className="flex items-center text-slate-500"><Tag className="w-4 h-4 mr-2" /><span className="text-sm">{isKuliner ? 'Range Harga' : 'Harga Tiket'}</span></div>
                <span className="text-xl font-bold text-emerald-600">{price}</span>
            </div>
            
            {!isKuliner && (
              <div className="flex justify-between mb-6">
                  <div className="flex items-center text-slate-500"><Clock className="w-4 h-4 mr-2" /><span className="text-sm">Jam Buka</span></div>
                  <span className="text-sm font-semibold text-slate-800">08.00 - 17.00 WIB</span>
              </div>
            )}
            
            <button onClick={onOpenMap} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center gap-2 mb-6">
                {isKuliner ? <Navigation className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                {isKuliner ? 'Navigasi Maps' : 'Petunjuk Arah'}
            </button>

            {/* Mini Map */}
            {mapUrl ? (
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group cursor-pointer" onClick={onOpenMap}>
                <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0, pointerEvents: 'none' }} title="Mini Map" className="grayscale group-hover:grayscale-0 transition-all duration-500"></iframe>
              </div>
            ) : (
              <div className="w-full h-48 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xs">Peta tidak tersedia</div>
            )}
        </div>
    </div>
  );
}