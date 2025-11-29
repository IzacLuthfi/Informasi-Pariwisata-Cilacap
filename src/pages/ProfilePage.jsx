import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  User, Settings, LogOut, Heart, Map, Edit3, ChevronRight, 
  HelpCircle, Shield, Camera, Loader2, X, Save, Lock, 
  Bell, Mail, Key, Bookmark, MapPin as IconMap, Grid, LayoutDashboard 
} from 'lucide-react';
import defaultImage from '../assets/pantai.jpg'; 

// IMPORT KOMPONEN BARU
import ProfileDetailView from '../components/profile/ProfileDetailView';

export default function ProfilePage({ onLogout, onGoToAdmin }) {
  // --- STATE MANAGEMENT ---
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form States
  const [fullName, setFullName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const fileInputRef = useRef(null);
  const [isNotifEnabled, setIsNotifEnabled] = useState(false);

  // State Bookmark & Favorite
  const [savedItems, setSavedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('bookmark');
  const [stats, setStats] = useState({ bookmark: 0, favorite: 0 });

  // STATE BARU: Item yang diklik untuk dilihat detailnya
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getProfile();
    if (Notification.permission === 'granted') setIsNotifEnabled(true);
  }, []);

  useEffect(() => {
    if (profile) getSavedItems();
  }, [profile, activeTab]);

  // --- LOGIKA UTAMA ---
  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
            setProfile(data);
            setFullName(data.full_name || '');
            if (data.role === 'admin') setIsAdmin(true);
        } else {
            setProfile({ email: user.email });
        }
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const getSavedItems = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { count: countBookmark } = await supabase.from('user_interactions').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('interaction_type', 'bookmark');
    const { count: countFav } = await supabase.from('user_interactions').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('interaction_type', 'favorite');
    setStats({ bookmark: countBookmark || 0, favorite: countFav || 0 });

    const { data: interactions } = await supabase.from('user_interactions').select('*').eq('user_id', user.id).eq('interaction_type', activeTab);

    if (!interactions || interactions.length === 0) {
        setSavedItems([]);
        return;
    }

    const items = [];
    for (const item of interactions) {
        const tableName = item.item_type; 
        const { data: detail } = await supabase.from(tableName).select('*').eq('id', item.item_id).single();
        
        if (detail) {
            // Normalisasi data agar seragam
            items.push({ 
                id: detail.id,
                name: detail.name || detail.title, // Handle Budaya (title)
                location: detail.location || 'Cilacap (Budaya)', 
                category: detail.category,
                image_url: detail.image_url,
                type: tableName // Penting untuk DetailView
            });
        }
    }
    setSavedItems(items);
  };

  // ... (Fungsi Upload, Edit, Password, Notif TETAP SAMA - tidak saya tulis ulang agar hemat tempat, isinya sama persis)
  const handleAvatarUpload = async (event) => { try { setUploading(true); const file = event.target.files[0]; if(!file) return; const { data: { user } } = await supabase.auth.getUser(); const fileExt = file.name.split('.').pop(); const fileName = `${Math.random()}.${fileExt}`; const filePath = `${user.id}/${fileName}`; await supabase.storage.from('avatars').upload(filePath, file); const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath); const updates = { id: user.id, avatar_url: publicUrl, email: user.email, updated_at: new Date() }; await supabase.from('profiles').upsert(updates); setProfile(prev => ({ ...prev, ...updates })); alert('Foto berhasil diupdate!'); } catch(e) { alert(e.message); } finally { setUploading(false); } };
  const updateProfileName = async () => { try { setUploading(true); const { data: { user } } = await supabase.auth.getUser(); const updates = { id: user.id, full_name: fullName, email: user.email, updated_at: new Date() }; await supabase.from('profiles').upsert(updates); setProfile(prev => ({ ...prev, full_name: fullName })); setActiveModal(null); alert('Profil berhasil diperbarui!'); } catch(e) { alert(e.message); } finally { setUploading(false); } };
  const updatePassword = async () => { try { setUploading(true); const { data: { user } } = await supabase.auth.getUser(); const { error: verifyError } = await supabase.auth.signInWithPassword({ email: user.email, password: oldPassword }); if (verifyError) throw new Error("Password lama salah!"); const { error: updateError } = await supabase.auth.updateUser({ password: newPassword }); if (updateError) throw updateError; setActiveModal(null); setOldPassword(''); setNewPassword(''); alert('Password berhasil diubah!'); } catch(e) { alert(e.message); } finally { setUploading(false); } };
  const toggleNotifications = async () => { if (!isNotifEnabled) { const p = await Notification.requestPermission(); if (p === 'granted') { setIsNotifEnabled(true); new Notification("Pariwisata Cilacap", { body: "Notifikasi aktif!" }); } else alert("Izin ditolak."); } else setIsNotifEnabled(false); };

  const renderModalContent = () => {
     // ... (Isi modal sama persis dengan sebelumnya)
     switch (activeModal) {
        case 'edit': return (<div className="space-y-4"><h3 className="text-lg font-bold text-slate-800 dark:text-white">Edit Profil</h3><div><label className="text-xs text-slate-500 font-bold uppercase">Nama Lengkap</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 dark:bg-slate-700 dark:text-white dark:border-slate-600" /></div><button onClick={updateProfileName} disabled={uploading} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-emerald-700 transition-colors">{uploading ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />} Simpan</button></div>);
        case 'security': return (<div className="space-y-4"><h3 className="text-lg font-bold text-slate-800 dark:text-white">Keamanan</h3><div><label className="text-xs text-slate-500 font-bold uppercase">Password Lama</label><div className="relative"><Key className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" /><input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full mt-1 pl-10 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 dark:bg-slate-700 dark:text-white dark:border-slate-600" placeholder="Password saat ini" /></div></div><div><label className="text-xs text-slate-500 font-bold uppercase">Password Baru</label><div className="relative"><Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" /><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full mt-1 pl-10 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 dark:bg-slate-700 dark:text-white dark:border-slate-600" placeholder="Min 6 karakter" /></div></div><button onClick={updatePassword} disabled={uploading || newPassword.length < 6} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-slate-900 transition-colors">{uploading ? <Loader2 className="animate-spin" /> : <Shield className="w-4 h-4" />} Update Password</button></div>);
        case 'settings': return (<div className="space-y-6"><h3 className="text-lg font-bold text-slate-800">Pengaturan</h3><div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><div className="flex items-center gap-3"><Bell className={`w-5 h-5 ${isNotifEnabled ? 'text-emerald-500' : 'text-slate-600'}`} /><span className="text-sm font-medium text-slate-700">Notifikasi</span></div><button onClick={toggleNotifications} className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isNotifEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${isNotifEnabled ? 'left-7' : 'left-1'}`} /></button></div><p className="text-xs text-slate-400 text-center pt-2">{isNotifEnabled ? "Anda akan menerima update." : "Aktifkan untuk dapat info terbaru."}</p></div>);
        case 'support': return (<div className="space-y-4 text-center"><div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2"><HelpCircle className="w-8 h-8 text-emerald-600" /></div><h3 className="text-lg font-bold text-slate-800">Butuh Bantuan?</h3><p className="text-sm text-slate-500">Hubungi kami jika ada kendala.</p><div className="flex flex-col gap-2 pt-2"><a href="mailto:izacluthfi12@gmail.com" className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100 hover:bg-emerald-50 transition-colors"><Mail className="w-4 h-4" /> izacluthfi12@gmail.com</a><div className="text-xs text-slate-400 mt-2">Versi 1.0.0 (Beta)</div></div></div>);
        default: return null;
     }
  };

  // --- TAMPILAN UTAMA ---
  
  // 1. Jika ada item dipilih, tampilkan DETAIL VIEW
  if (selectedItem) {
    return (
      <ProfileDetailView 
        item={selectedItem} 
        onBack={() => { 
            setSelectedItem(null); 
            window.scrollTo(0,0); 
        }} 
      />
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="relative h-60 w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop")' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-emerald-900/20 to-emerald-900/60" />
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-4 relative z-10 -mt-20 max-w-xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden transition-colors duration-300">
          <div className="flex flex-col items-center pt-8 pb-6 px-6 text-center border-b border-slate-50 dark:border-slate-700">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full p-1 bg-white dark:bg-slate-700 shadow-lg">
                <div className="w-full h-full rounded-full bg-slate-200 overflow-hidden relative">
                  <img src={profile?.avatar_url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} className="w-full h-full object-cover" />
                  {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="w-6 h-6 text-white animate-spin" /></div>}
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
              <button onClick={() => fileInputRef.current.click()} disabled={uploading} className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-md hover:bg-emerald-600 transition-colors"><Camera className="w-3.5 h-3.5" /></button>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-4">{profile?.full_name || "Pengguna"}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{profile?.email}</p>
          </div>

          <div className="flex border-b border-slate-100 dark:border-slate-700">
            <button onClick={() => setActiveTab('bookmark')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'bookmark' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-slate-400'}`}><Bookmark className="w-4 h-4" /> Disimpan ({stats.bookmark})</button>
            <button onClick={() => setActiveTab('favorite')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'favorite' ? 'text-pink-500 border-b-2 border-pink-500 bg-pink-50/50 dark:bg-pink-900/10' : 'text-slate-400'}`}><Heart className="w-4 h-4" /> Disukai ({stats.favorite})</button>
          </div>

          {/* List Item yang Disimpan */}
          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 min-h-[200px]">
            {savedItems.length === 0 ? (
                <div className="text-center py-10 text-slate-400 flex flex-col items-center"><Grid className="w-10 h-10 mb-2 opacity-20" /><p className="text-xs">Belum ada item {activeTab === 'bookmark' ? 'disimpan' : 'disukai'}.</p></div>
            ) : (
                <div className="space-y-3">
                    {savedItems.map((item, idx) => (
                        <div 
                            key={idx} 
                            // --- EVENT KLIK ITEM ---
                            onClick={() => setSelectedItem(item)}
                            className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm flex gap-3 items-center border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <img src={item.image_url || defaultImage} className="w-16 h-16 rounded-lg object-cover" alt="Thumb" onError={(e) => e.target.src = defaultImage} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between"><h4 className="font-bold text-slate-800 dark:text-white truncate text-sm">{item.name}</h4><span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded uppercase">{item.type}</span></div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1"><IconMap className="w-3 h-3 mr-1" /> {item.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>

        {/* Menu List */}
        <div className="mt-6 space-y-4">
             {isAdmin && (
               <button onClick={onGoToAdmin} className="w-full flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-slate-800 transition-colors">
                  <div className="flex gap-3 items-center text-sm font-bold"><div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><LayoutDashboard className="w-4 h-4 text-emerald-400" /></div> Admin Dashboard</div><ChevronRight className="w-5 h-5 text-slate-400" />
               </button>
             )}
             <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Akun Saya</div>
                <button onClick={() => setActiveModal('edit')} className="w-full flex justify-between items-center p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><div className="flex gap-3 items-center text-sm font-medium text-slate-700 dark:text-slate-200"><div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><User className="w-4 h-4" /></div> Edit Profil</div><ChevronRight className="w-5 h-5 text-slate-300" /></button>
                <button onClick={() => setActiveModal('security')} className="w-full flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><div className="flex gap-3 items-center text-sm font-medium text-slate-700 dark:text-slate-200"><div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"><Shield className="w-4 h-4" /></div> Keamanan & Privasi</div><ChevronRight className="w-5 h-5 text-slate-300" /></button>
             </div>
             <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lainnya</div>
                <button onClick={() => setActiveModal('settings')} className="w-full flex justify-between items-center p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><div className="flex gap-3 items-center text-sm font-medium text-slate-700 dark:text-slate-200"><div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Settings className="w-4 h-4" /></div> Pengaturan</div><ChevronRight className="w-5 h-5 text-slate-300" /></button>
                <button onClick={() => setActiveModal('support')} className="w-full flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><div className="flex gap-3 items-center text-sm font-medium text-slate-700 dark:text-slate-200"><div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500"><HelpCircle className="w-4 h-4" /></div> Bantuan & Support</div><ChevronRight className="w-5 h-5 text-slate-300" /></button>
             </div>
             <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl text-red-500 font-bold shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/30"><LogOut className="w-5 h-5" /> Keluar Akun</button>
        </div>

        <div className="text-center text-slate-300 text-xs py-6">Versi Aplikasi 1.0.0</div>
      </div>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-6 relative shadow-2xl animate-scale-up border border-slate-100 dark:border-slate-700">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 p-1 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><X className="w-5 h-5 text-slate-500 dark:text-slate-300" /></button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}