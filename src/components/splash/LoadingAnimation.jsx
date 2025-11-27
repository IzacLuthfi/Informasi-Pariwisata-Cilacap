export default function LoadingAnimation({ fadeIn, progress }) {
  return (
    <div className={`w-full max-w-[200px] md:max-w-xs flex flex-col items-center gap-3 transition-all duration-1000 delay-500 ${
      !fadeIn ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
    }`}>
      
      {/* Progress Bar Container */}
      <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
        {/* Fill Bar */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_#34d399]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage Text */}
      <div className="flex justify-between w-full text-[10px] font-medium tracking-widest uppercase text-emerald-100/70">
        <span>Memuat...</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
}