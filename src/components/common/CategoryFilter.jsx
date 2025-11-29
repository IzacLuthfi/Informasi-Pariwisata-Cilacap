export default function CategoryFilter({ categories, selectedCategory, onSelectCategory, title = "Kategori" }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between md:justify-center px-4 mb-4 max-w-4xl mx-auto">
        <h3 className="font-bold text-slate-800 dark:text-white text-lg md:text-xl">{title}</h3>
        <span className="text-xs text-slate-400 md:hidden">Geser 👉</span>
      </div>

      <div className="w-full overflow-x-auto pb-4 hide-scrollbar px-4">
        <div className="flex space-x-4 md:space-x-0 md:gap-6 min-w-max md:min-w-full md:justify-center">
          
          {categories.map((cat, index) => {
            const isActive = selectedCategory === cat.name;

            return (
              <button 
                key={index}
                onClick={() => onSelectCategory(cat.name)}
                className="flex flex-col items-center space-y-2 group"
              >
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center 
                  transition-all duration-300 border-[3px] 
                  bg-gradient-to-br ${cat.gradient} shadow-sm
                  ${isActive 
                    ? `scale-110 border-white ring-2 ring-offset-2 ring-slate-200 dark:ring-slate-700 ${cat.shadow} opacity-100` 
                    : 'border-transparent scale-100 opacity-80 hover:opacity-100 hover:scale-105'
                  }
                `}>
                  <cat.icon className="w-6 h-6 text-white drop-shadow-sm" strokeWidth={2} />
                </div>

                <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${
                  isActive 
                    ? 'text-slate-800 dark:text-white' 
                    : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500'
                }`}>
                  {cat.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}