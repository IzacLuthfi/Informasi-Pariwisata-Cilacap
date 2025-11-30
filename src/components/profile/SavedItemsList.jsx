import { Bookmark, Heart, Grid, MapPin as IconMap } from 'lucide-react';
import defaultImage from '../../assets/pantai.jpg'; // Pastikan path gambar benar

export default function SavedItemsList({ activeTab, setActiveTab, items, stats, onItemClick }) {
  return (
    <div className="px-4 max-w-xl mx-auto mt-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden transition-colors duration-300">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-700">
          <button 
              onClick={() => setActiveTab('bookmark')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'bookmark' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-slate-400'}`}
          >
              <Bookmark className="w-4 h-4" /> Disimpan ({stats.bookmark})
          </button>
          <button 
              onClick={() => setActiveTab('favorite')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'favorite' ? 'text-pink-500 border-b-2 border-pink-500 bg-pink-50/50 dark:bg-pink-900/10' : 'text-slate-400'}`}
          >
              <Heart className="w-4 h-4" /> Disukai ({stats.favorite})
          </button>
        </div>

        {/* List Content */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 min-h-[200px]">
          {items.length === 0 ? (
              <div className="text-center py-10 text-slate-400 flex flex-col items-center">
                  <Grid className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-xs">Belum ada item {activeTab === 'bookmark' ? 'disimpan' : 'disukai'}.</p>
              </div>
          ) : (
              <div className="space-y-3">
                  {items.map((item, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => onItemClick(item)} // Event Klik untuk Detail
                        className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm flex gap-3 items-center border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                          <img 
                            src={item.image_url || defaultImage} 
                            className="w-16 h-16 rounded-lg object-cover" 
                            alt="Thumb" 
                            onError={(e) => e.target.src = defaultImage}
                          />
                          <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                  <h4 className="font-bold text-slate-800 dark:text-white truncate text-sm">{item.name}</h4>
                                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded uppercase">{item.type}</span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                                  <IconMap className="w-3 h-3 mr-1" /> {item.location}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>
          )}
        </div>
      </div>
    </div>
  );
}