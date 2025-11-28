import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export function useDetailLogic(id, tableName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State Interaksi
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (id) {
      fetchDetail();
      checkInteractions();
    }
  }, [id]);

  // 1. Fetch Detail (Dinamis sesuai tabel)
  const fetchDetail = async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from(tableName) // 'wisata' atau 'kuliner'
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setData(result);
    } catch (err) {
      console.error(`Gagal ambil detail ${tableName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Cek Status
  const checkInteractions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data } = await supabase
      .from('user_interactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('item_id', id)
      .eq('item_type', tableName);

    if (data) {
      setIsBookmarked(data.some(i => i.interaction_type === 'bookmark'));
      setIsFavorited(data.some(i => i.interaction_type === 'favorite'));
    }
  };

  // 3. Toggle Action
  const toggleInteraction = async (type) => {
    if (!userId) {
      alert("Silakan login dulu.");
      return;
    }

    const currentState = type === 'bookmark' ? isBookmarked : isFavorited;
    const setState = type === 'bookmark' ? setIsBookmarked : setIsFavorited;

    setState(!currentState); // Optimistic UI

    if (currentState) {
      // Hapus
      await supabase.from('user_interactions').delete()
        .match({ user_id: userId, item_id: id, item_type: tableName, interaction_type: type });
    } else {
      // Simpan
      await supabase.from('user_interactions').insert({
        user_id: userId, item_id: id, item_type: tableName, interaction_type: type
      });
    }
  };

  return { data, loading, isBookmarked, isFavorited, toggleInteraction };
}