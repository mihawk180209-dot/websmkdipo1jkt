import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const PromotionalModal = () => {
  const [promos, setPromos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  const modalRef = useRef(null);

  // --- Fetch Data & Logic Muncul Sekali ---
  const fetchPromotions = useCallback(async () => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("promotions")
        .select("id, image_url, cta_link, open_in_new_tab, title")
        .eq("is_active", true)
        .lte("start_date", now)
        .gte("end_date", now)
        .order("priority", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setPromos(data);

        // --- UPDATE LOGIC: Cek Session Storage ---
        // Kita pake ID promo pertama sebagai unique key
        // Kalau user refresh browser, sessionStorage masih nyimpen data, jadi gak muncul lagi.
        // Kalau user close tab dan buka baru, baru muncul lagi.
        const sessionKey = `seen_promo_${data[0].id}`;
        const hasSeen = sessionStorage.getItem(sessionKey);

        if (!hasSeen) {
          setIsOpen(true);
          // Tandain udah dilihat di sesi ini
          sessionStorage.setItem(sessionKey, "true");
        }
      }
    } catch (err) {
      console.error("Promo fetch error:", err);
    }
  }, []);

  useEffect(() => {
    // Delay dikit biar gak kaget pas load page
    const timer = setTimeout(fetchPromotions, 1500);
    return () => clearTimeout(timer);
  }, [fetchPromotions]);

  // --- Body Scroll Lock ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, promos]);

  // --- Handlers ---
  const handleClose = () => setIsOpen(false);

  const handleNext = (e) => {
    e?.stopPropagation();
    if (promos.length <= 1) return;
    setIsLoadingImage(true);
    setCurrentIndex((prev) => (prev + 1) % promos.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (promos.length <= 1) return;
    setIsLoadingImage(true);
    setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);
  };

  const handleImageLoad = () => {
    setIsLoadingImage(false);
  };

  if (!isOpen || promos.length === 0) return null;

  const currentPromo = promos[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Container Modal */}
      {/* UPDATE CSS: 
          1. `w-auto`: Lebar container ngikutin isinya (gambarnya).
          2. `max-w-[90vw]`: Mentok 90% lebar layar kalau gambarnya kegedean.
          3. `md:max-h-[85vh]`: Biar tinggi containernya pas sama gambar.
      */}
      <div
        ref={modalRef}
        className="relative z-10 flex flex-col items-center justify-center outline-none animate-in fade-in zoom-in-95 duration-300 w-auto max-w-[90vw] h-auto"
        tabIndex="-1"
      >
        <div className="relative group overflow-hidden rounded-xl shadow-2xl bg-zinc-900 ring-1 ring-white/10 flex justify-center items-center">
          {/* Tombol Close (Fixed di dalam card) */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-50 p-2 rounded-full bg-black/40 text-white/90 hover:bg-red-600 hover:text-white transition-all backdrop-blur-md border border-white/10 shadow-lg"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          {/* Loading Spinner */}
          {isLoadingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-20 min-w-[300px] min-h-[300px]">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {/* Link Gambar */}
          <a
            href={currentPromo.cta_link || "#"}
            target={currentPromo.open_in_new_tab ? "_blank" : "_self"}
            rel={currentPromo.open_in_new_tab ? "noopener noreferrer" : ""}
            className="block relative w-full h-full flex justify-center items-center bg-black"
            onClick={(e) => !currentPromo.cta_link && e.preventDefault()}
          >
            {/* UPDATE 2: LOGIC UKURAN GAMBAR DIPERBAIKI 
                - Mobile: max-h-[60vh] biar masih keliatan tombol close
                - Desktop: md:max-h-[60vh] (Tadinya 80vh). Ini kuncinya biar ga mepet navbar.
            */}
            <img
              src={currentPromo.image_url}
              alt={currentPromo.title || "Promo"}
              onLoad={handleImageLoad}
              className={`
                block w-auto h-auto 
                max-h-[60vh] md:max-h-[60vh] 
                object-contain 
                transition-opacity duration-300 select-none
                ${isLoadingImage ? "opacity-0" : "opacity-100"}
              `}
            />
          </a>
          {/* Navigasi */}
          {promos.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 hover:scale-105 backdrop-blur-sm transition-all border border-white/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 z-40"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 hover:scale-105 backdrop-blur-sm transition-all border border-white/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 z-40"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-40 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                {promos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLoadingImage(true);
                      setCurrentIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "bg-white w-6"
                        : "bg-white/50 w-1.5 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionalModal;
