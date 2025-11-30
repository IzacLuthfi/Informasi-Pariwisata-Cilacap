import { Camera, Loader2 } from 'lucide-react';

export default function ProfileHeader({ profile, uploading, onUploadClick, fileInputRef, onFileChange }) {
  return (
    <>
      {/* Header Banner */}
      <div className="relative h-60 w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop")' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-emerald-900/20 to-emerald-900/60" />
        </div>
      </div>

      <div className="px-4 relative z-10 -mt-20 max-w-xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden transition-colors duration-300">
          
          {/* Avatar Area */}
          <div className="flex flex-col items-center pt-8 pb-6 px-6 text-center border-b border-slate-50 dark:border-slate-700">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full p-1 bg-white dark:bg-slate-700 shadow-lg">
                <div className="w-full h-full rounded-full bg-slate-200 overflow-hidden relative">
                  <img src={profile?.avatar_url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} className="w-full h-full object-cover" alt="Profile" />
                  {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="w-6 h-6 text-white animate-spin" /></div>}
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
              <button onClick={onUploadClick} disabled={uploading} className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-md hover:bg-emerald-600 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-4">{profile?.full_name || "Pengguna"}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{profile?.email}</p>
            
            {profile?.role === 'admin' && (
               <span className="mt-2 inline-block px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-full uppercase">Administrator</span>
            )}
          </div>

          {/* Static Stats Grid */}
          <div className="grid grid-cols-3 divide-x divide-slate-50 dark:divide-slate-700 py-4">
            <div className="flex flex-col items-center p-2"><span className="text-lg font-bold text-slate-800 dark:text-white">0</span><span className="text-[10px] text-slate-400 uppercase">Trip</span></div>
            <div className="flex flex-col items-center p-2"><span className="text-lg font-bold text-slate-800 dark:text-white">0</span><span className="text-[10px] text-slate-400 uppercase">Disukai</span></div>
            <div className="flex flex-col items-center p-2"><span className="text-lg font-bold text-slate-800 dark:text-white">0</span><span className="text-[10px] text-slate-400 uppercase">Ulasan</span></div>
          </div>
        </div>
      </div>
    </>
  );
}