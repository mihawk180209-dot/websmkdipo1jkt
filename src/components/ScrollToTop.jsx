import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { LenisContext } from "../contexts/LenisContext";

/**
 * ScrollToTop
 * Reset scroll ke atas setiap pindah halaman di React Router v6.
 * Pakai Lenis jika tersedia, fallback ke window.scrollTo.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useContext(LenisContext);

  useEffect(() => {
    if (lenis) {
      // Scroll langsung ke atas via Lenis tanpa animasi
      lenis.scrollTo(0, { duration: 0 });
    } else {
      // Fallback untuk browser biasa
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;
