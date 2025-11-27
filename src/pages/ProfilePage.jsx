import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  User, Settings, LogOut, Heart, Map, Edit3, ChevronRight, 
  HelpCircle, Shield, Camera, Loader2, X, Save, Lock, 
  Bell, Mail, Key 
} from 'lucide-react';

export default function ProfilePage({ onLogout }) {
  // --- STATE MANAGEMENT ---
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'edit', 'security', 'settings', 'support'

  // Form States
  const [fullName, setFullName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const fileInputRef = useRef(null);

  // Settings States (Hanya Notifikasi)
  const [isNotifEnabled, setIsNotifEnabled] = useState(false);

  // --- 1. LOAD DATA SAAT APLIKASI DIBUKA ---
  useEffect(() => {
    getProfile();

    // Cek Izin Notifikasi Browser
    if (Notification.permission === 'granted') {
      setIsNotifEnabled(true);
    }
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
            setProfile(data);
            setFullName(data.full_name || '');
        } else {
            setProfile({ email: user.email });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. LOGIKA UPLOAD FOTO ---
  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi habis.");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload ke Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Ambil URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update Database
      const updates = {
        id: user.id,
        avatar_url: publicUrl,
        email: user.email,
        updated_at: new Date(),
      };

      const { error: updateError } = await supabase.from('profiles').upsert(updates);
      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, ...updates }));
      alert('Foto berhasil diupdate!');

    } catch (error) {
      alert('Gagal upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- 3. LOGIKA UPDATE NAMA (EDIT PROFIL) ---
  const updateProfileName = async () => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User tidak ditemukan");

      const updates = {
        id: user.id,
        full_name: fullName,
        email: user.email,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      
      setProfile(prev => ({ ...prev, full_name: fullName }));
      setActiveModal(null);
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      alert('Gagal update: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- 4. LOGIKA GANTI PASSWORD (KEAMANAN) ---
  const updatePassword = async () => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      // Verifikasi Password Lama
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword
      });

      if (verifyError) throw new Error("Password lama salah!");

      // Update Password Baru
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      setActiveModal(null);
      setOldPassword('');
      setNewPassword('');
      alert('Password berhasil diubah!');
    } catch (error) {
      alert('Gagal: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- 5. LOGIKA NOTIFIKASI ---
  const toggleNotifications = async () => {
    if (!isNotifEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setIsNotifEnabled(true);
        new Notification("Pariwisata Cilacap", { body: "Notifikasi aktif!" });
      } else {
        alert("Izin ditolak browser.");
      }
    } else {
      setIsNotifEnabled(false);
    }
  };

  // --- RENDER CONTENT MODAL ---
  const renderModalContent = () => {
    switch (activeModal) {
      case 'edit':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Edit Profil</h3>
            <div>
              <label className="text-xs text-slate-500 font-bold uppercase">Nama Lengkap</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button onClick={updateProfileName} disabled={uploading} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-emerald-700 transition-colors">
              {uploading ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />} Simpan
            </button>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Keamanan</h3>
            <div>
              <label className="text-xs text-slate-500 font-bold uppercase">Password Lama</label>
              <div className="relative">
                <Key className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full mt-1 pl-10 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-slate-50" placeholder="Password saat ini" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-bold uppercase">Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full mt-1 pl-10 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" placeholder="Min 6 karakter" />
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
            {/* Mode Gelap DIHAPUS, hanya sisa Notifikasi */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className={`w-5 h-5 ${isNotifEnabled ? 'text-emerald-500' : 'text-slate-600'}`} />
                <span className="text-sm font-medium text-slate-700">Notifikasi</span>
              </div>
              <button onClick={toggleNotifications} className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isNotifEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${isNotifEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <p className="text-xs text-slate-400 text-center pt-2">
                {isNotifEnabled ? "Anda akan menerima update wisata terbaru." : "Aktifkan untuk dapat info terbaru."}
            </p>
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
  }

  // --- UI Render ---
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      
      {/* 1. Header Banner */}
      <div className="relative h-60 w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop")' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-emerald-900/20 to-emerald-900/60" />
        </div>
      </div>

      {/* 2. Profile Content */}
      <div className="px-4 relative z-10 -mt-20 max-w-xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="flex flex-col items-center pt-8 pb-6 px-6 text-center border-b border-slate-50">
            
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full p-1 bg-white shadow-lg">
                <div className="w-full h-full rounded-full bg-slate-200 overflow-hidden relative">
                  <img src={profile?.avatar_url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="Profile" className="w-full h-full object-cover" />
                  {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="w-6 h-6 text-white animate-spin" /></div>}
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
              <button onClick={() => fileInputRef.current.click()} disabled={uploading} className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-md hover:bg-emerald-600 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mt-4">{profile?.full_name || "Pengguna"}</h2>
            <p className="text-sm text-slate-500 font-medium">{profile?.email}</p>
            <div className="mt-3 inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">Wisatawan Aktif</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 divide-x divide-slate-50 py-4">
            <div className="flex flex-col items-center p-2"><span className="text-lg font-bold text-slate-800">0</span><span className="text-[10px] text-slate-400 uppercase">Trip</span></div>
            <div className="flex flex-col items-center p-2"><span className="text-lg font-bold text-slate-800">0</span><span className="text-[10px] text-slate-400 uppercase">Disukai</span></div>
            <div className="flex flex-col items-center p-2"><span className="text-lg font-bold text-slate-800">0</span><span className="text-[10px] text-slate-400 uppercase">Ulasan</span></div>
          </div>
        </div>

        {/* 3. Menu List */}
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Akun Saya</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <button onClick={() => setActiveModal('edit')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50">
                <div className="flex items-center space-x-4"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50"><User className="w-5 h-5 text-blue-500" /></div><span className="text-sm font-medium text-slate-700">Edit Profil</span></div><ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
              <button onClick={() => setActiveModal('security')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-50"><Shield className="w-5 h-5 text-emerald-500" /></div><span className="text-sm font-medium text-slate-700">Keamanan & Privasi</span></div><ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Lainnya</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <button onClick={() => setActiveModal('settings')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50">
                <div className="flex items-center space-x-4"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100"><Settings className="w-5 h-5 text-slate-500" /></div><span className="text-sm font-medium text-slate-700">Pengaturan Aplikasi</span></div><ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
              <button onClick={() => setActiveModal('support')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-50"><HelpCircle className="w-5 h-5 text-amber-500" /></div><span className="text-sm font-medium text-slate-700">Bantuan & Support</span></div><ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>

          <button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 p-4 bg-white rounded-2xl border border-red-100 text-red-500 font-semibold shadow-sm hover:bg-red-50 transition-all mt-4 mb-8">
            <LogOut className="w-5 h-5" /><span>Keluar Akun</span>
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl animate-scale-up border border-slate-100">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 p-1 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}