// ScrollToTopFade.jsx
import { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { LenisContext } from "../contexts/LenisContext";

/**
 * ScrollToTopFade
 * Reset scroll ke atas dan fade-in halaman saat route berubah.
 * Kompatibel dengan Lenis smooth scroll.
 */
const ScrollToTopFade = ({ children }) => {
  const { pathname } = useLocation();
  const lenis = useContext(LenisContext);

  // State untuk opacity fade-in
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 1️⃣ Scroll ke atas dulu
    if (lenis) {
      lenis.scrollTo(0, { duration: 0 });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    // 2️⃣ Set opacity 0 dulu, lalu fade-in
    setVisible(false);

    const timeout = setTimeout(() => {
      setVisible(true);
    }, 50); // delay kecil supaya efek fade-in terasa

    return () => clearTimeout(timeout);
  }, [pathname, lenis]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      {children}
    </div>
  );
};

export default ScrollToTopFade;
