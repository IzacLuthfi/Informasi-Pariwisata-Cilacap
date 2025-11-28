import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Star, Send, Trash2, Loader2, MessageSquare } from 'lucide-react';

export default function ReviewSection({ itemId, itemType }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  
  const [inputRating, setInputRating] = useState(5);
  const [inputComment, setInputComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkUser();
    fetchReviews();
  }, [itemId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const fetchReviews = async () => {
    try {
      // Mengambil review beserta data profile pengirimnya
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (full_name, avatar_url)
        `)
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error("Gagal ambil review:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Silakan login dulu.");
    if (!inputComment.trim()) return alert("Tulis komentar dulu.");

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        user_id: userId,
        item_id: itemId,
        item_type: itemType,
        rating: inputRating,
        comment: inputComment
      });

      if (error) throw error;

      setInputComment('');
      setInputRating(5);
      fetchReviews(); 
    } catch (err) {
      alert("Gagal kirim: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Hapus ulasan ini?")) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
      if (error) throw error;
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      alert("Gagal hapus: " + err.message);
    }
  };

  const averageRating = reviews.length 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // --- Helper untuk mengambil Nama/Avatar dengan aman ---
  const getUserName = (profileData) => {
    if (!profileData) return "Pengguna";
    // Supabase kadang mengembalikan array jika relasi one-to-many tidak terdeteksi strict
    if (Array.isArray(profileData)) return profileData[0]?.full_name || "Pengguna";
    return profileData.full_name || "Pengguna";
  };

  const getUserAvatar = (profileData) => {
    const defaultPic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    if (!profileData) return defaultPic;
    if (Array.isArray(profileData)) return profileData[0]?.avatar_url || defaultPic;
    return profileData.avatar_url || defaultPic;
  };
  // ----------------------------------------------------

  return (
    <div className="mt-10 pt-8 border-t border-slate-100">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            Ulasan Pengunjung
          </h3>
          <p className="text-sm text-slate-500 mt-1">{reviews.length} orang telah memberikan ulasan</p>
        </div>
        <div className="text-right">
           <div className="flex items-center bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
              <Star className="w-6 h-6 text-amber-400 fill-current mr-2" />
              <div>
                  <span className="text-2xl font-bold text-slate-800">{averageRating || '0'}</span>
                  <span className="text-xs text-slate-400 ml-1">/ 5.0</span>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-10">
        <h4 className="text-sm font-bold text-slate-700 mb-4">Bagikan pengalaman Anda</h4>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setInputRating(star)} className="transition-transform hover:scale-110 focus:outline-none">
              <Star className={`w-8 h-8 transition-colors ${star <= inputRating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input type="text" value={inputComment} onChange={(e) => setInputComment(e.target.value)} placeholder={userId ? "Tulis pendapatmu..." : "Login untuk menulis ulasan"} disabled={!userId || submitting} className="flex-1 px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm disabled:bg-slate-50" />
          <button type="submit" disabled={!userId || submitting} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5" />} <span className="hidden sm:inline">Kirim</span>
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-10"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto"/></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm">Belum ada ulasan.</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="flex gap-4 pb-6 border-b border-slate-50 last:border-0 animate-fade-in-up">
              
              {/* Avatar dengan Helper Function */}
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-100">
                <img 
                  src={getUserAvatar(rev.profiles)} 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    {/* Nama dengan Helper Function */}
                    <h5 className="text-sm font-bold text-slate-800">{getUserName(rev.profiles)}</h5>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (<Star key={i} className="w-3 h-3 fill-current" />))}
                        </div>
                        <span className="text-[10px] text-slate-400">• {new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {userId === rev.user_id && (
                    <button onClick={() => handleDelete(rev.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="mt-2 text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-r-2xl rounded-bl-2xl inline-block">
                  {rev.comment}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}