import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Import Halaman
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/Auth/LoginPage';       // NEW
import RegisterPage from './pages/Auth/RegisterPage'; // NEW

import HomePage from './pages/HomePage';
import ObjekWisata from './pages/ObjekWisata';
import Kuliner from './pages/Kuliner';
import ProfilePage from './pages/ProfilePage';

// Import Komponen Navigasi
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import PWABadge from './PWABadge';

function AppRoot() {
  // 1. State Splash Screen
  const [showSplash, setShowSplash] = useState(true);
  
  // 2. State Autentikasi (Default false / belum login)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 3. State Halaman Auth (login / register)
  const [authPage, setAuthPage] = useState('login'); 

  // 4. State Navigasi Utama
  const [currentPage, setCurrentPage] = useState('home');

  // --- Handlers ---
  
  // Selesai Splash -> Masuk ke mode Auth (jika belum login)
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Login Sukses -> Masuk ke Dashboard
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('home');
  };

  // Logout -> Kembali ke Login
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthPage('login');
    setCurrentPage('home'); // Reset page
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Render Halaman Utama (Dashboard)
  const renderMainApp = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'wisata': return <ObjekWisata />;
      case 'kuliner': return <Kuliner />;
      // Pass handleLogout ke ProfilePage
      case 'profile': return <ProfilePage onLogout={handleLogout} />; 
      default: return <HomePage />;
    }
  };

  // --- Main Logic Rendering ---

  // 1. Tampilkan Splash Screen Dulu
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // 2. Jika Belum Login, Tampilkan Halaman Auth
  if (!isAuthenticated) {
    if (authPage === 'login') {
      return (
        <LoginPage 
          onLogin={handleLoginSuccess} 
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

  // 3. Jika Sudah Login, Tampilkan Aplikasi Utama
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <DesktopNavbar currentPage={currentPage} onNavigate={handleNavigation} />
      
      <main className="min-h-screen pb-20 md:pb-0">
        {renderMainApp()}
      </main>
      
      <MobileNavbar currentPage={currentPage} onNavigate={handleNavigation} />
      <PWABadge />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)