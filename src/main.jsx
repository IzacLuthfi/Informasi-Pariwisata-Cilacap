import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { supabase } from './services/supabaseClient';

// Import Halaman
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import HomePage from './pages/HomePage';
import ObjekWisata from './pages/ObjekWisata';
import Kuliner from './pages/Kuliner';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/Admin/AdminDashboard'; // Import Admin

// Import Komponen Navigasi
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import PWABadge from './PWABadge';

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState(null);
  const [authPage, setAuthPage] = useState('login');
  const [currentPage, setCurrentPage] = useState('home');

  // Cek Session User
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cek Setting Dark Mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleSplashComplete = () => setShowSplash(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setAuthPage('login');
    setCurrentPage('home');
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'wisata': return <ObjekWisata />;
      case 'kuliner': return <Kuliner />;
      case 'profile': 
        return <ProfilePage onLogout={handleLogout} onGoToAdmin={() => setCurrentPage('admin')} />;
      case 'admin': 
        return <AdminDashboard onBack={() => setCurrentPage('profile')} />;
      default: return <HomePage />;
    }
  };

  // 1. Tampilkan Splash Screen
  if (showSplash) return <SplashScreen onComplete={handleSplashComplete} />;

  // 2. Jika Belum Login
  if (!session) {
    if (authPage === 'login') {
      return (
        <LoginPage 
          onLoginSuccess={(sess) => setSession(sess)} 
          onNavigateToRegister={() => setAuthPage('register')} 
        />
      );
    } else {
      return (
        <RegisterPage 
          onNavigateToLogin={() => setAuthPage('login')} 
        />
      );
    }
  }

  // 3. Aplikasi Utama
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Sembunyikan Navbar jika sedang di halaman Admin */}
      {currentPage !== 'admin' && (
        <DesktopNavbar currentPage={currentPage} onNavigate={handleNavigation} />
      )}
      
      <main className="min-h-screen pb-20 md:pb-0">
        {renderCurrentPage()}
      </main>
      
      {/* Sembunyikan Navbar Mobile jika sedang di halaman Admin */}
      {currentPage !== 'admin' && (
        <MobileNavbar currentPage={currentPage} onNavigate={handleNavigation} />
      )}

      <PWABadge />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)