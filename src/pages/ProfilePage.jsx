import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { Loader2 } from 'lucide-react';

// Import Komponen Baru
import ProfileHeader from '../components/profile/ProfileHeader';
import SavedItems from '../components/profile/SavedItems';
import ProfileMenu from '../components/profile/ProfileMenu';
import ProfileModals from '../components/profile/ProfileModals';

export default function ProfilePage({ onLogout, onGoToAdmin }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form States
  const [fullName, setFullName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isNotifEnabled, setIsNotifEnabled] = useState(false);
  const fileInputRef = useRef(null);

  // Saved Items State
  const [savedItems, setSavedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('bookmark');
  const [stats, setStats] = useState({ bookmark: 0, favorite: 0 });

  // --- 1. LOAD DATA ---
  useEffect(() => {
    getProfile();
    if (Notification.permission === 'granted') setIsNotifEnabled(true);
  }, []);

  useEffect(() => {
    if (profile) getSavedItems();
  }, [profile, activeTab]);

  // --- LOGIKA DATABASE (Sama seperti sebelumnya) ---
  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
            setProfile(data); setFullName(data.full_name || '');
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
    if (!interactions || interactions.length === 0) { setSavedItems([]); return; }

    const items = [];
    for (const item of interactions) {
        const tableName = item.item_type;
        const { data: detail } = await supabase.from(tableName).select('id, name, location, category').eq('id', item.item_id).single();
        if (detail) items.push({ ...detail, type: tableName });
    }
    setSavedItems(items);
  };

  const handleAvatarUpload = async (event) => { /* logic upload sama */ 
    try { setUploading(true); const file = event.target.files[0]; if(!file) return; const { data: { user } } = await supabase.auth.getUser(); const fileExt = file.name.split('.').pop(); const fileName = `${Math.random()}.${fileExt}`; const filePath = `${user.id}/${fileName}`; await supabase.storage.from('avatars').upload(filePath, file); const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath); const updates = { id: user.id, avatar_url: publicUrl, email: user.email, updated_at: new Date() }; await supabase.from('profiles').upsert(updates); setProfile(prev => ({ ...prev, ...updates })); alert('Foto berhasil diupdate!'); } catch(e) { alert(e.message); } finally { setUploading(false); }
  };

  const updateProfileName = async () => { /* logic update nama sama */ 
    try { setUploading(true); const { data: { user } } = await supabase.auth.getUser(); const updates = { id: user.id, full_name: fullName, email: user.email, updated_at: new Date() }; await supabase.from('profiles').upsert(updates); setProfile(prev => ({ ...prev, full_name: fullName })); setActiveModal(null); alert('Profil berhasil diperbarui!'); } catch(e) { alert(e.message); } finally { setUploading(false); }
  };

  const updatePassword = async () => { /* logic update password sama */
    try { setUploading(true); const { data: { user } } = await supabase.auth.getUser(); const { error: verifyError } = await supabase.auth.signInWithPassword({ email: user.email, password: oldPassword }); if (verifyError) throw new Error("Password lama salah!"); const { error: updateError } = await supabase.auth.updateUser({ password: newPassword }); if (updateError) throw updateError; setActiveModal(null); setOldPassword(''); setNewPassword(''); alert('Password berhasil diubah!'); } catch(e) { alert(e.message); } finally { setUploading(false); }
  };

  const toggleNotifications = async () => { /* logic notif sama */
    if (!isNotifEnabled) { const p = await Notification.requestPermission(); if (p === 'granted') { setIsNotifEnabled(true); new Notification("Pariwisata Cilacap", { body: "Notifikasi aktif!" }); } else alert("Izin ditolak."); } else setIsNotifEnabled(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 dark:bg-slate-900 transition-colors duration-300">
      
      <ProfileHeader 
        profile={profile} 
        uploading={uploading} 
        fileInputRef={fileInputRef}
        onUploadClick={() => fileInputRef.current.click()}
        onFileChange={handleAvatarUpload}
      />

      <SavedItems 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        savedItems={savedItems} 
        stats={stats} 
      />

      <ProfileMenu 
        isAdmin={isAdmin}
        onGoToAdmin={onGoToAdmin}
        onOpenModal={setActiveModal}
        onLogout={onLogout}
      />

      <ProfileModals 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        fullName={fullName} setFullName={setFullName} updateProfileName={updateProfileName}
        oldPassword={oldPassword} setOldPassword={setOldPassword}
        newPassword={newPassword} setNewPassword={setNewPassword} updatePassword={updatePassword}
        isNotifEnabled={isNotifEnabled} toggleNotifications={toggleNotifications}
        uploading={uploading}
      />

    </div>
  );
}