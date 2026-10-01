import { useState, useEffect, useCallback } from 'react';
import { images, categories, type Category } from '@/data/images';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages =
    activeCategory === 'All'
      ? images
      : images.filter((img) => img.category === activeCategory);

  const isOpen = lightboxIndex !== null;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? prev : (prev + 1) % filteredImages.length
    );
  }, [filteredImages.length]);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? prev : (prev - 1 + filteredImages.length) % filteredImages.length
    );
  }, [filteredImages.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeLightbox, showNext, showPrev]);

  const currentImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                Image Gallery
              </h1>
            </div>
            <p className="text-slate-500 text-sm sm:text-base text-center max-w-xl">
              A curated collection of stunning photography across nature, wildlife, and urban landscapes.
            </p>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-[88px] sm:top-[104px] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-2 sm:gap-3 py-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/20 scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Gallery Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative overflow-hidden rounded-2xl bg-slate-200 aspect-[4/3] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-sky-300 mb-1">
                  {img.category}
                </span>
                <h3 className="text-white font-semibold text-lg leading-tight">
                  {img.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="text-sm font-medium tracking-wide">
            Frontend Development Internship &mdash; Task 1
          </p>
          <p className="text-xs text-slate-400">
            Developed by Bojja Brahmini
          </p>
        </div>
      </footer>

      {/* Lightbox */}
      {isOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center animate-[fadeIn_0.3s_ease]"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-2 sm:left-6 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-x-1"
            aria-label="Previous"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-2 sm:right-6 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:translate-x-1"
            aria-label="Next"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Image + Caption */}
          <div
            className="flex flex-col items-center max-w-5xl w-full px-4 animate-[scaleIn_0.3s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1">
                {currentImage.category}
              </span>
              <h3 className="text-white font-semibold text-lg sm:text-xl">
                {currentImage.title}
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                {lightboxIndex! + 1} of {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
