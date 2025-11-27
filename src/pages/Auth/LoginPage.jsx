import { useState } from 'react';
import { Mail, Lock, ArrowRight, MapPin, AlertCircle } from 'lucide-react';
import logoUrl from '../../assets/LOGORN.png'; 
import { supabase } from '../../services/supabaseClient'; // Import Supabase

export default function LoginPage({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Login ke Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMsg(error.message); // Tampilkan error jika gagal
    } else {
      onLoginSuccess(data.session); // Panggil fungsi sukses
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image (Sama seperti sebelumnya) */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1596423402773-40455582f3fb?q=80&w=1964&auto=format&fit=crop")' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-black/30" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-lg">
             <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">Selamat Datang</h2>
          <p className="text-emerald-100 text-sm">Masuk untuk menjelajahi Cilacap</p>
        </div>

        {/* Error Message Box */}
        {errorMsg && (
          <div className="mb-4 bg-red-500/80 backdrop-blur-sm p-3 rounded-xl flex items-center gap-2 text-white text-xs font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-emerald-100 uppercase tracking-wider ml-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-emerald-200" />
              </div>
              <input type="email" required className="block w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:border-emerald-300 transition-all" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-emerald-100 uppercase tracking-wider ml-1">Kata Sandi</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-emerald-200" />
              </div>
              <input type="password" required className="block w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:border-emerald-300 transition-all" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <span>Memproses...</span> : <><span>Masuk Sekarang</span><ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-emerald-100/80">Belum punya akun? <button onClick={onNavigateToRegister} className="font-bold text-white hover:underline underline-offset-4 decoration-emerald-400">Daftar disini</button></p>
        </div>
      </div>
    </div>
  );
}