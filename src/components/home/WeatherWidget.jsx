import { useState, useEffect } from 'react';
import { CloudSun, CloudRain, Sun, Cloud, MapPin, Moon } from 'lucide-react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  
  const API_KEY = "86d898985111b1659018b17419350520"; 
  const CITY = "Cilacap";

  // --- DATA BACKUP DINAMIS (PER 3 JAM) ---
  const getBackupWeather = () => {
    const hour = new Date().getHours(); // Ambil jam saat ini (0-23)

    // Data cuaca berdasarkan rentang jam
    if (hour >= 5 && hour < 9) {
        return { temp: 26, main: 'Clear', desc: 'cerah berawan' }; // Pagi
    } else if (hour >= 9 && hour < 12) {
        return { temp: 29, main: 'Clouds', desc: 'berawan' }; // Menjelang Siang
    } else if (hour >= 12 && hour < 15) {
        return { temp: 33, main: 'Clear', desc: 'panas terik' }; // Siang Bolong
    } else if (hour >= 15 && hour < 18) {
        return { temp: 28, main: 'Rain', desc: 'hujan ringan' }; // Sore (Sering hujan)
    } else if (hour >= 18 && hour < 21) {
        return { temp: 26, main: 'Clouds', desc: 'berawan' }; // Malam Awal
    } else {
        return { temp: 24, main: 'Clear', desc: 'cerah malam' }; // Tengah Malam
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&lang=id&appid=${API_KEY}`
        );
        
        if (!response.ok) throw new Error("Gagal ambil data");
        
        const data = await response.json();
        setWeather(data);

      } catch (error) {
        console.warn("Mode Offline/Limit Habis: Menggunakan Data Backup Dinamis.");
        
        // AMBIL DATA PALSU SESUAI JAM
        const mockData = getBackupWeather();

        setWeather({
            weather: [{ main: mockData.main, description: mockData.desc }],
            main: { temp: mockData.temp }
        });
      }
    };

    fetchWeather();
  }, []);

  if (!weather) return null;

  // --- LOGIKA ICON ---
  const condition = weather.weather[0].main.toLowerCase();
  const isNight = new Date().getHours() >= 18 || new Date().getHours() < 5;

  let Icon = CloudSun;
  
  if (condition.includes('rain')) Icon = CloudRain;
  else if (condition.includes('clouds')) Icon = Cloud;
  else if (condition.includes('clear')) {
      // Kalau cerah, cek siang atau malam
      Icon = isNight ? Moon : Sun; 
  }

  return (
    <div className="absolute top-6 left-4 z-20 animate-fade-in-down">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
        <div className="bg-white/30 p-2 rounded-full text-white">
            <Icon className="w-6 h-6" />
        </div>
        <div className="text-white">
            <p className="text-xs font-medium opacity-90 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {CITY}
            </p>
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold">{Math.round(weather.main.temp)}°C</span>
                <span className="text-xs capitalize opacity-80">{weather.weather[0].description}</span>
            </div>
        </div>
      </div>
    </div>
  );
}