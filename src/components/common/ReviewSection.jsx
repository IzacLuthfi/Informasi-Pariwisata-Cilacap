import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Star, Send, Trash2, Loader2, MessageSquare, MessageCircle, Reply, CornerDownRight, X } from 'lucide-react';

export default function ReviewSection({ itemId, itemType, hideRating = false }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  
  // Form Utama (Review Baru)
  const [inputRating, setInputRating] = useState(5);
  const [inputComment, setInputComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form Balasan (Reply)
  const [replyingTo, setReplyingTo] = useState(null); // ID review yang sedang dibalas
  const [replyComment, setReplyComment] = useState('');
  const [replying, setReplying] = useState(false);

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
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (full_name, avatar_url)
        `)
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .order('created_at', { ascending: true }); // Ascending biar diskusi urut dari lama ke baru

      if (error) throw error;
      
      // Kita sort manual di client: Review utama paling baru di atas, Reply urut waktu
      // Tapi untuk simpelnya, kita ambil semua data dulu
      setReviews(data || []);
    } catch (err) {
      console.error("Gagal ambil review:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- SUBMIT REVIEW UTAMA ---
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
        rating: hideRating ? 5 : inputRating,
        comment: inputComment,
        parent_id: null // Review Utama
      });

      if (error) throw error;

      setInputComment('');
      if (!hideRating) setInputRating(5);
      fetchReviews(); 
    } catch (err) {
      alert("Gagal kirim: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- SUBMIT BALASAN ---
  const handleReplySubmit = async (parentId) => {
    if (!userId) return alert("Silakan login dulu.");
    if (!replyComment.trim()) return alert("Tulis balasan dulu.");

    setReplying(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        user_id: userId,
        item_id: itemId,
        item_type: itemType,
        rating: 5, // Balasan tidak butuh rating, default 5
        comment: replyComment,
        parent_id: parentId // KUNCI: Mengaitkan ke review induk
      });

      if (error) throw error;

      setReplyComment('');
      setReplyingTo(null); // Tutup form reply
      fetchReviews();
    } catch (err) {
      alert("Gagal membalas: " + err.message);
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Hapus komentar ini?")) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
      if (error) throw error;
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      alert("Gagal hapus: " + err.message);
    }
  };

  // Filter: Pisahkan Review Utama dan Balasan
  const rootReviews = reviews.filter(r => r.parent_id === null).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  const getReplies = (parentId) => reviews.filter(r => r.parent_id === parentId);

  const averageRating = reviews.length 
    ? (reviews.filter(r => r.parent_id === null).reduce((acc, curr) => acc + curr.rating, 0) / reviews.filter(r => r.parent_id === null).length).toFixed(1)
    : 0;

  // Helper UI
  const getUserName = (profile) => Array.isArray(profile) ? profile[0]?.full_name : profile?.full_name || "Pengguna";
  const getUserAvatar = (profile) => {
      const defaultPic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
      if (!profile) return defaultPic;
      return (Array.isArray(profile) ? profile[0]?.avatar_url : profile.avatar_url) || defaultPic;
  };

  // --- KOMPONEN KARTU REVIEW (REUSABLE) ---
  const ReviewCard = ({ data, isReply = false }) => (
    <div className={`flex gap-3 ${isReply ? 'mt-3 ml-2' : 'pb-6 border-b border-slate-50 last:border-0 animate-fade-in-up'}`}>
       {/* Avatar */}
       <div className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-100`}>
          <img src={getUserAvatar(data.profiles)} alt="User" className="w-full h-full object-cover" />
       </div>

       <div className="flex-1">
          <div className="flex justify-between items-start">
             <div>
                <h5 className={`font-bold text-slate-800 ${isReply ? 'text-xs' : 'text-sm'}`}>{getUserName(data.profiles)}</h5>
                <div className="flex items-center gap-2 mt-0.5">
                   {/* Rating hanya muncul di review utama & jika tidak di-hide */}
                   {!hideRating && !isReply && (
                      <div className="flex text-amber-400">
                         {[...Array(data.rating)].map((_, i) => (<Star key={i} className="w-3 h-3 fill-current" />))}
                      </div>
                   )}
                   <span className="text-[10px] text-slate-400">{!hideRating && !isReply && '•'} {new Date(data.created_at).toLocaleDateString()}</span>
                </div>
             </div>

             <div className="flex gap-2">
                {/* Tombol Reply */}
                {!isReply && userId && (
                    <button onClick={() => setReplyingTo(replyingTo === data.id ? null : data.id)} className="text-slate-400 hover:text-emerald-600 transition-colors p-1">
                        <Reply className="w-4 h-4" />
                    </button>
                )}
                {/* Tombol Hapus */}
                {userId === data.user_id && (
                    <button onClick={() => handleDelete(data.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
             </div>
          </div>

          <div className={`mt-1.5 text-slate-600 leading-relaxed ${isReply ? 'text-xs bg-slate-50/50' : 'text-sm bg-slate-50'} p-3 rounded-r-2xl rounded-bl-2xl inline-block`}>
             {data.comment}
          </div>

          {/* --- FORM BALASAN (Hanya muncul jika tombol reply diklik) --- */}
          {!isReply && replyingTo === data.id && (
             <div className="mt-3 flex gap-2 animate-fade-in">
                <input 
                    type="text" 
                    value={replyComment}
                    autoFocus
                    onChange={(e) => setReplyComment(e.target.value)} 
                    placeholder={`Balas ${getUserName(data.profiles)}...`}
                    className="flex-1 px-4 py-2 bg-white border border-emerald-200 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button onClick={() => handleReplySubmit(data.id)} disabled={replying} className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 disabled:opacity-50">
                    {replying ? <Loader2 className="w-3 h-3 animate-spin"/> : <Send className="w-3 h-3"/>}
                </button>
                <button onClick={() => setReplyingTo(null)} className="bg-slate-200 text-slate-500 p-2 rounded-full hover:bg-slate-300">
                    <X className="w-3 h-3"/>
                </button>
             </div>
          )}

          {/* --- RENDER BALASAN (RECURSIVE) --- */}
          {!isReply && getReplies(data.id).length > 0 && (
             <div className="mt-3 pl-3 border-l-2 border-slate-100 space-y-3">
                {getReplies(data.id).map(reply => (
                    <ReviewCard key={reply.id} data={reply} isReply={true} />
                ))}
             </div>
          )}
       </div>
    </div>
  );

  // --- RENDER UTAMA ---
  return (
    <div className="mt-10 pt-8 border-t border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            {hideRating ? <MessageCircle className="w-5 h-5 text-emerald-500" /> : <MessageSquare className="w-5 h-5 text-emerald-500" />}
            {hideRating ? 'Diskusi' : 'Ulasan'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{reviews.length} interaksi</p>
        </div>
        {!hideRating && (
            <div className="text-right">
            <div className="flex items-center bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
                <Star className="w-6 h-6 text-amber-400 fill-current mr-2" />
                <div><span className="text-2xl font-bold text-slate-800">{averageRating || '0'}</span><span className="text-xs text-slate-400 ml-1">/ 5.0</span></div>
            </div>
            </div>
        )}
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-10">
        <h4 className="text-sm font-bold text-slate-700 mb-4">{hideRating ? 'Tulis pendapat Anda' : 'Bagikan pengalaman Anda'}</h4>
        {!hideRating && (
            <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setInputRating(star)} className="transition-transform hover:scale-110 focus:outline-none">
                <Star className={`w-8 h-8 transition-colors ${star <= inputRating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                </button>
            ))}
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input type="text" value={inputComment} onChange={(e) => setInputComment(e.target.value)} placeholder={userId ? (hideRating ? "Tulis komentar..." : "Tulis ulasan...") : "Login untuk menulis"} disabled={!userId || submitting} className="flex-1 px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm disabled:bg-slate-50" />
          <button type="submit" disabled={!userId || submitting} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5" />} <span className="hidden sm:inline">Kirim</span>
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {loading ? <div className="text-center py-10"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto"/></div> : rootReviews.length === 0 ? <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200"><p className="text-slate-400 text-sm">Belum ada aktivitas.</p></div> : rootReviews.map((rev) => <ReviewCard key={rev.id} data={rev} />)}
      </div>
    </div>
  );
}