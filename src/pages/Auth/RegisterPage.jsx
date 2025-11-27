import { useState } from 'react';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export default function RegisterPage({ onNavigateToLogin }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        
        data: { 
          full_name: formData.name, 
        }, 
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi (jika aktif), atau langsung login.");
      onNavigateToLogin();
    }
    setLoading(false);
  };

  // ... (Sisa render JSX sama, cuma tambahkan display errorMsg & disabled button saat loading seperti di Login)
  return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        {/* Background sama */}
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop")' }}>
           <div className="absolute inset-0 bg-gradient-to-b from-teal-900/80 to-emerald-950/90" />
        </div>

        <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 animate-fade-in-up">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Buat Akun Baru</h2>
            <p className="text-emerald-100 text-sm">Gabung komunitas wisata Cilacap</p>
          </div>

           {errorMsg && (
            <div className="mb-4 bg-red-500/80 backdrop-blur-sm p-3 rounded-xl flex items-center gap-2 text-white text-xs font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
            </div>
            )}

          <form onSubmit={handleSubmit} className="space-y-4">
             {/* Field Nama */}
             <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-100 ml-1">Nama Lengkap</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-emerald-200" /></div>
                    <input type="text" required className="block w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:border-emerald-300 transition-all" placeholder="Nama Anda" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
             </div>
             {/* Field Email */}
             <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-100 ml-1">Email</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-emerald-200" /></div>
                    <input type="email" required className="block w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:border-emerald-300 transition-all" placeholder="nama@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
             </div>
             {/* Field Password */}
             <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-100 ml-1">Kata Sandi</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-emerald-200" /></div>
                    <input type="password" required className="block w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:border-emerald-300 transition-all" placeholder="Min. 6 karakter" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
             </div>

             <button type="submit" disabled={loading} className="w-full mt-4 bg-white text-emerald-700 font-bold py-3.5 rounded-xl shadow-lg hover:bg-emerald-50 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50">
               {loading ? 'Mendaftar...' : 'Daftar Akun'}
             </button>
          </form>

          <div className="mt-6 text-center">
             <p className="text-sm text-emerald-100/80">Sudah punya akun? <button onClick={onNavigateToLogin} className="font-bold text-white hover:underline underline-offset-4 decoration-emerald-400">Masuk disini</button></p>
          </div>
        </div>
      </div>
  );
}