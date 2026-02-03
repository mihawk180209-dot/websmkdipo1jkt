import React, { createContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Context untuk Lenis
export const LenisContext = createContext();

export const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2, // lebih kecil = lebih responsive
      easing: (t) => 1 - Math.pow(1 - t, 3), // cubic out, momentum smooth
      // simple easing untuk mobile
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: true,
      touchMultiplier: 2, // turunkan supaya mobile smooth terasa
      infinite: false,
    });

    // Integrate Lenis with GSAP ScrollTrigger
    lenisRef.current.on("scroll", ScrollTrigger.update);

    // Gunakan GSAP ticker, cukup satu loop RAF
    gsap.ticker.add((time) => {
      lenisRef.current.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Cleanup saat unmount
    return () => {
      lenisRef.current.destroy();
      gsap.ticker.remove(gsap.ticker.listeners);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
};
