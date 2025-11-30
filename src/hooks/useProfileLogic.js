import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export function useProfileLogic() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Data Saved Items
  const [savedItems, setSavedItems] = useState([]);
  const [stats, setStats] = useState({ bookmark: 0, favorite: 0 });

  useEffect(() => {
    fetchProfile();
  }, []);

  // 1. Fetch Profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
            setProfile(data);
            // Load saved items setelah profile loaded
            fetchSavedItems(user.id);
        } else {
            setProfile({ email: user.email });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Saved Items & Stats
  const fetchSavedItems = async (userId, type = 'bookmark') => {
    // Hitung Stats
    const { count: bookmarkCount } = await supabase.from('user_interactions').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('interaction_type', 'bookmark');
    const { count: favCount } = await supabase.from('user_interactions').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('interaction_type', 'favorite');
    setStats({ bookmark: bookmarkCount || 0, favorite: favCount || 0 });

    // Ambil Data Item
    const { data: interactions } = await supabase
      .from('user_interactions')
      .select('*')
      .eq('user_id', userId)
      .eq('interaction_type', type);

    if (!interactions || interactions.length === 0) {
      setSavedItems([]);
      return;
    }

    const items = [];
    for (const item of interactions) {
      const { data: detail } = await supabase
        .from(item.item_type) // 'wisata', 'kuliner', atau 'budaya'
        .select('*') // Ambil semua kolom biar aman
        .eq('id', item.item_id)
        .single();
      
      if (detail) {
          // Normalisasi Data (karena Budaya pakai title, bukan name)
          items.push({ 
              ...detail, 
              name: detail.name || detail.title, 
              location: detail.location || 'Cilacap',
              type: item.item_type 
          });
      }
    }
    setSavedItems(items);
  };

  // 3. Upload Avatar
  const uploadAvatar = async (file) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      await supabase.storage.from('avatars').upload(filePath, file);
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const updates = { id: user.id, avatar_url: publicUrl, email: user.email, updated_at: new Date() };
      await supabase.from('profiles').upsert(updates);
      
      setProfile(prev => ({ ...prev, ...updates }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setUploading(false);
    }
  };

  // 4. Update Profile Name
  const updateName = async (fullName) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const updates = { id: user.id, full_name: fullName, email: user.email, updated_at: new Date() };
      await supabase.from('profiles').upsert(updates);
      setProfile(prev => ({ ...prev, full_name: fullName }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setUploading(false);
    }
  };

  // 5. Update Password
  const updatePassword = async (oldPassword, newPassword) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      // Verifikasi Old Password
      const { error: verifyError } = await supabase.auth.signInWithPassword({ email: user.email, password: oldPassword });
      if (verifyError) throw new Error("Password lama salah!");

      // Update New Password
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setUploading(false);
    }
  };

  return {
    profile, loading, uploading, savedItems, stats,
    fetchSavedItems, uploadAvatar, updateName, updatePassword
  };
}