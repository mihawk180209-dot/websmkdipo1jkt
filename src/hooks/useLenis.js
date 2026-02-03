import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useLenis = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis with smooth scrolling settings
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: true,
      touchMultiplier: 3,
      infinite: false,
    });

    // Integrate Lenis with GSAP ScrollTrigger
    lenisRef.current.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisRef.current.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Start the Lenis loop
    const raf = (time) => {
      lenisRef.current.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenisRef.current.destroy();
      gsap.ticker.remove(gsap.ticker.listeners);
    };
  }, []);

  return lenisRef.current;
};
