import { User, Settings, LogOut, HelpCircle, Shield, LayoutDashboard, ChevronRight } from 'lucide-react';

export default function ProfileMenu({ isAdmin, onGoToAdmin, onOpenModal, onLogout }) {
  return (
    <div className="px-4 max-w-xl mx-auto mt-6 space-y-4">
        {isAdmin && (
          <button onClick={onGoToAdmin} className="w-full flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-slate-800 transition-colors">
             <div className="flex gap-3 items-center text-sm font-bold">
               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><LayoutDashboard className="w-4 h-4 text-emerald-400" /></div> 
               Admin Dashboard
             </div>
             <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
           <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Akun Saya</div>
           <button onClick={() => onOpenModal('edit')} className="w-full flex justify-between items-center p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
               <div className="flex gap-3 items-center text-sm font-medium text-slate-700 dark:text-slate-200"><div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><User className="w-4 h-4" /></div> Edit Profil</div>
               <ChevronRight className="w-5 h-5 text-slate-300" />
           </button>
           <button onClick={() => onOpenModal('security')} className="w-full flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
               <div className="flex gap-3 items-center text-sm font-medium text-slate-700 dark:text-slate-200"><div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"><Shield className="w-4 h-4" /></div> Keamanan & Privasi</div>
               <ChevronRight className="w-5 h-5 text-slate-300" />
           </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
           <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lainnya</div>
           <button onClick={() => onOpenModal('settings')} className="w-full flex justify-between items-center p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
               <div className="flex gap-3 items-center text-sm font-medium text-slate-700 dark:text-slate-200"><div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Settings className="w-4 h-4" /></div> Pengaturan</div>
               <ChevronRight className="w-5 h-5 text-slate-300" />
           </button>
           <button onClick={() => onOpenModal('support')} className="w-full flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
               <div className="flex gap-3 items-center text-sm font-medium text-slate-700 dark:text-slate-200"><div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500"><HelpCircle className="w-4 h-4" /></div> Bantuan & Support</div>
               <ChevronRight className="w-5 h-5 text-slate-300" />
           </button>
        </div>

        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl text-red-500 font-bold shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/30">
           <LogOut className="w-5 h-5" /> Keluar Akun
        </button>
    </div>
  );
}