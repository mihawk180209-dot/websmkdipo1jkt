# TODO: Optimize Home.jsx for Client-Side GSAP and SPA Safety

- [x] Remove top-level gsap.registerPlugin(ScrollTrigger)
- [x] Add new useEffect for client-side gsap.registerPlugin(ScrollTrigger) with window check
- [x] Add if(typeof window !== "undefined") check at start of useGSAP callback
- [x] Remove all gsap.set() calls for initial states (.hero-element, .hero-logo, .stat-card, .kepsek-image-wrapper, .kepsek-text-wrapper, .jurusan-header, .jurusan-card)
- [x] Add inline CSS styles (opacity: 0, transform) to relevant JSX elements for SPA-safety
