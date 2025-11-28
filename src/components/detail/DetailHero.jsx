import { ArrowLeft, Heart, Bookmark, Star, MapPin } from 'lucide-react';
import defaultImage from '../../assets/pantai.jpg'; 

export default function DetailHero({ data, onBack, isBookmarked, isFavorited, onToggle }) {
  return (
    <div className="relative h-[40vh] md:h-[50vh] w-full">
      <img src={defaultImage} alt={data.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      
      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center">
        <button onClick={onBack} className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-emerald-600 border border-white/30 transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex gap-3">
          <button onClick={() => onToggle('bookmark')} className={`backdrop-blur-md p-2.5 rounded-full border border-white/30 transition-all ${isBookmarked ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/20 text-white hover:bg-white/40'}`}>
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button onClick={() => onToggle('favorite')} className={`backdrop-blur-md p-2.5 rounded-full border border-white/30 transition-all ${isFavorited ? 'bg-pink-500 text-white border-pink-500' : 'bg-white/20 text-white hover:bg-white/40'}`}>
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Text Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">{data.category}</span>
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg"><Star className="w-3 h-3 text-yellow-400 fill-current mr-1" /><span className="text-xs font-bold">4.9</span></div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight drop-shadow-lg">{data.name}</h1>
          <div className="flex items-center text-emerald-100 text-sm md:text-base"><MapPin className="w-4 h-4 mr-2" />{data.location}</div>
      </div>
    </div>
  );
}