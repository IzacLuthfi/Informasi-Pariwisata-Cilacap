import React, { useState, useEffect } from 'react';
import BackgroundPattern from '../components/splash/BackgroundPattern';
import LogoContainer from '../components/splash/LogoContainer';
import TitleSection from '../components/splash/TitleSection';
import LoadingAnimation from '../components/splash/LoadingAnimation';
import Footer from '../components/splash/Footer';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Efek Fade In awal lebih cepat
    setTimeout(() => {
      setFadeIn(true);
    }, 100);

    // Simulasi Loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              setIsVisible(false);
              setTimeout(() => {
                if (typeof onComplete === 'function') onComplete();
              }, 100);
            }, 800); // Waktu transisi keluar
          }, 500);
          return 100;
        }
        // Random progress biar terlihat natural
        const jump = Math.floor(Math.random() * 10) + 2; 
        const nextProgress = prev + jump;
        return nextProgress > 100 ? 100 : nextProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out ${
      fadeOut ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
    }`}>
      
      {/* Background Cinematic */}
      <BackgroundPattern fadeOut={fadeOut} />
      
      {/* Konten Utama */}
      <div className={`relative z-20 flex flex-col items-center justify-center w-full px-6 transition-all duration-1000 ${
        !fadeIn ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
      }`}>
        
        <LogoContainer />
        <TitleSection fadeIn={fadeIn} />
        <LoadingAnimation fadeIn={fadeIn} progress={progress} />
        
      </div>

      <Footer fadeOut={fadeOut} fadeIn={fadeIn} />
    </div>
  );
}