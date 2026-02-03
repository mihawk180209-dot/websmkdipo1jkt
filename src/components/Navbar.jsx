import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { navLinks } from "../data/navigation";
import Dropdown from "./Dropdown";
import MobileMenu from "./Mobilemenu";
import logo from "../assets/logo yayasan al-hidayah-02.webp";

// --- GSAP IMPORT ---
import gsap from "gsap";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- REFS UNTUK ANIMASI ---
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navLinksRef = useRef(null); // Container untuk link desktop
  const ppdbBtnRef = useRef(null); // Ref khusus tombol PPDB
  const menuButtonRef = useRef(null);

  // --- LOGIC SCROLL (throttled via requestAnimationFrame to reduce re-renders) ---
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY > 20;
        setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- GSAP ANIMATION: ENTRANCE & SCROLL EFFECT ---
  // --- GSAP ANIMATION: ENTRANCE & SCROLL EFFECT ---
  // UseEffect + rAF start to avoid blocking first paint (preserve timings)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.6 },
      });

      tl.from(headerRef.current, {
        yPercent: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          logoRef.current,
          {
            scale: 0,
            opacity: 0,
            rotation: -45,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.5",
        )
        .from(
          ".nav-item-anim",
          {
            y: -20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.6",
        )
        .from(
          ppdbBtnRef.current,
          {
            scale: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.2",
        );
    }, headerRef);

    // start after paint to avoid blocking LCP
    const startId = window.requestAnimationFrame(() => {});

    return () => {
      try {
        ctx.revert();
      } catch (e) {
        /* ignore */
      }
      try {
        window.cancelAnimationFrame(startId);
      } catch (e) {
        /* ignore */
      }
    };
  }, []);

  // --- GSAP ANIMATION: REACTIVE SCROLL CHANGE ---
  // Menggantikan class conditional CSS agar transisi padding lebih smooth
  useEffect(() => {
    if (!headerRef.current) return;

    gsap.to(headerRef.current, {
      paddingTop: isScrolled ? "0.5rem" : "1rem",
      paddingBottom: isScrolled ? "0.5rem" : "1rem",
      boxShadow: isScrolled ? "0 10px 30px -10px rgba(0,0,0,0.12)" : "none",
      backgroundColor: isScrolled
        ? "rgba(255,255,255,0.95)"
        : "rgba(255,255,255,1)",
      backdropFilter: isScrolled ? "blur(4px)" : "none",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isScrolled]);

  // --- HELPER: HOVER ANIMATIONS (stable callbacks) ---
  const onEnterBtn = useCallback(() => {
    gsap.to(ppdbBtnRef.current, {
      scale: 1.1,
      duration: 0.3,
      ease: "elastic.out(1, 0.3)",
    });
  }, []);
  const onLeaveBtn = useCallback(() => {
    gsap.to(ppdbBtnRef.current, { scale: 1, duration: 0.2 });
  }, []);

  const desktopLinks = useMemo(
    () =>
      navLinks.filter((item) => item.title !== "PPDB" && item.title !== "BKK"),
    [],
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 w-full z-[999] bg-white border-b border-transparent min-h-[72px]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between gap-6">
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div
              ref={logoRef}
              className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16  bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-primary group-hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={logo}
                alt="SMK Dipo 1"
                className="w-full h-full object-contain p-1"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold text-gray-800 leading-tight">
                SMK DIPO 1
              </span>
              <span className="text-xs text-gray-500 hidden lg:block">
                Berkarakter, Berkarya, Berteknologi
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav ref={navLinksRef} className="hidden lg:flex items-center gap-1">
            {desktopLinks.map((item, idx) => (
              // Wrapper div untuk target animasi stagger
              <div key={item.title} className="nav-item-anim">
                {item.submenu ? (
                  <Dropdown item={item} isMobile={false} />
                ) : (
                  <NavLink
                    to={item.path}
                    aria-current={({ isActive }) =>
                      isActive ? "page" : undefined
                    }
                    className={({ isActive }) => `
                            px-4 py-2 font-medium rounded-full transition-colors duration-200
                            ${
                              isActive
                                ? "text-primary bg-orange-50"
                                : "text-gray-600 hover:text-primary hover:bg-gray-50"
                            }
                        `}
                  >
                    {item.title}
                  </NavLink>
                )}
              </div>
            ))}

            {/* --- TAMBAHAN LINK BKK --- */}
            <div className="nav-item-anim">
              <a
                href="https://bkk-dipo.vercel.app/"
                aria-label="Bursa Kerja Khusus SMK Dipo 1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary hover:bg-gray-50 px-4 py-2 font-medium rounded-full transition-colors duration-200"
              >
                BKK
              </a>
            </div>

            {/* Tombol PPDB (Animated Ref) */}
            <a
              ref={ppdbBtnRef}
              onMouseEnter={onEnterBtn}
              onMouseLeave={onLeaveBtn}
              onFocus={onEnterBtn}
              onBlur={onLeaveBtn}
              href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/home"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 px-6 py-2 bg-primary text-white font-semibold rounded-full shadow-lg hover:shadow-orange-200"
            >
              PPDB
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-primary transition"
            aria-label="Open Menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        returnFocusRef={menuButtonRef}
      />
    </header>
  );
};

export default Navbar;
