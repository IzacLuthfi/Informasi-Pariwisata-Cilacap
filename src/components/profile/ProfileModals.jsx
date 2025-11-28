import { X, Loader2, Save, Lock, Key, Shield, Moon, Sun, Bell, HelpCircle, Mail } from 'lucide-react';

export default function ProfileModals({ 
  activeModal, onClose, 
  fullName, setFullName, updateProfileName, 
  oldPassword, setOldPassword, newPassword, setNewPassword, updatePassword,
  isNotifEnabled, toggleNotifications,
  uploading
}) {
  if (!activeModal) return null;

  const renderContent = () => {
    switch (activeModal) {
      case 'edit':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Edit Profil</h3>
            <div>
              <label className="text-xs text-slate-500 font-bold uppercase">Nama Lengkap</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 dark:bg-slate-700 dark:text-white dark:border-slate-600" />
            </div>
            <button onClick={updateProfileName} disabled={uploading} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-emerald-700 transition-colors">
              {uploading ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />} Simpan
            </button>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Keamanan</h3>
            <div>
              <label className="text-xs text-slate-500 font-bold uppercase">Password Lama</label>
              <div className="relative">
                <Key className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full mt-1 pl-10 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 dark:bg-slate-700 dark:text-white dark:border-slate-600" placeholder="Password saat ini" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-bold uppercase">Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full mt-1 pl-10 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 dark:bg-slate-700 dark:text-white dark:border-slate-600" placeholder="Min 6 karakter" />
              </div>
            </div>
            <button onClick={updatePassword} disabled={uploading || newPassword.length < 6} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-slate-900 transition-colors">
              {uploading ? <Loader2 className="animate-spin" /> : <Shield className="w-4 h-4" />} Update Password
            </button>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Pengaturan</h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3"><Bell className={`w-5 h-5 ${isNotifEnabled ? 'text-emerald-500' : 'text-slate-600'}`} /><span className="text-sm font-medium text-slate-700">Notifikasi</span></div>
              <button onClick={toggleNotifications} className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isNotifEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${isNotifEnabled ? 'left-7' : 'left-1'}`} /></button>
            </div>
            <p className="text-xs text-slate-400 text-center pt-2">{isNotifEnabled ? "Anda akan menerima update." : "Aktifkan untuk dapat info terbaru."}</p>
          </div>
        );
      case 'support':
        return (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2"><HelpCircle className="w-8 h-8 text-emerald-600" /></div>
            <h3 className="text-lg font-bold text-slate-800">Butuh Bantuan?</h3>
            <p className="text-sm text-slate-500">Hubungi kami jika ada kendala.</p>
            <div className="flex flex-col gap-2 pt-2">
              <a href="mailto:izacluthfi12@gmail.com" className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100 hover:bg-emerald-50 transition-colors">
                <Mail className="w-4 h-4" /> izacluthfi12@gmail.com
              </a>
              <div className="text-xs text-slate-400 mt-2">Versi 1.0.0 (Beta)</div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-6 relative shadow-2xl animate-scale-up border border-slate-100 dark:border-slate-700">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><X className="w-5 h-5 text-slate-500 dark:text-slate-300" /></button>
        {renderContent()}
      </div>
    </div>
  );
}