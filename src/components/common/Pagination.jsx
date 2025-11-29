import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Jangan tampilkan jika halaman cuma 1 atau data kosong
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-10 mb-6">
      {/* Tombol Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Indikator Halaman */}
      <span className="text-sm font-medium text-slate-600">
        Halaman <span className="font-bold text-emerald-600">{currentPage}</span> dari {totalPages}
      </span>

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}