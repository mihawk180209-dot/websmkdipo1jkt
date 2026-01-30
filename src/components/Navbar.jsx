import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { navLinks } from "../data/navigation";
import Dropdown from "./Dropdown";
import logo from "../assets/logo yayasan al-hidayah-02.webp";
import gsap from "gsap";

// 🔥 Lazy-load MobileMenu (HUGE perf win)
const MobileMenu = lazy(() => import("./Mobilemenu"));

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- REFS ---
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const ppdbBtnRef = useRef(null);
  const menuButtonRef = useRef(null);

  /* =========================
     SCROLL HANDLER (rAF)
  ========================= */
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrolled = window.scrollY > 20;
        setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* =========================
     GSAP: ENTRANCE
  ========================= */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

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

    return () => ctx.revert();
  }, []);

  /* =========================
     GSAP: SCROLL STYLE
  ========================= */
  useEffect(() => {
    gsap.to(headerRef.current, {
      paddingTop: isScrolled ? "0.5rem" : "1rem",
      paddingBottom: isScrolled ? "0.5rem" : "1rem",
      boxShadow: isScrolled ? "0 4px 6px -1px rgb(0 0 0 / 0.1)" : "none",
      backgroundColor: isScrolled
        ? "rgba(255,255,255,0.95)"
        : "rgba(255,255,255,1)",
      backdropFilter: isScrolled ? "blur(8px)" : "blur(0px)",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isScrolled]);

  /* =========================
     PPDB HOVER
  ========================= */
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

  /* =========================
     NAV DATA
  ========================= */
  const desktopLinks = useMemo(
    () =>
      navLinks.filter((item) => item.title !== "PPDB" && item.title !== "BKK"),
    [],
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 w-full z-[999] bg-white border-b border-transparent"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between gap-6">
          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div
              ref={logoRef}
              className="w-10 h-10 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-primary group-hover:shadow-lg transition-shadow"
            >
              <img
                src={logo}
                alt="SMK Dipo 1"
                className="w-full h-full object-contain p-1"
                loading="eager"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold text-gray-800">
                SMK DIPO 1
              </span>
              <span className="text-xs text-gray-500 hidden lg:block">
                Berkarakter, Berkarya, Berteknologi
              </span>
            </div>
          </NavLink>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {desktopLinks.map((item, idx) => (
              <div key={idx} className="nav-item-anim">
                {item.submenu ? (
                  <Dropdown item={item} isMobile={false} />
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `px-4 py-2 font-medium rounded-full transition-colors
                       ${
                         isActive
                           ? "text-primary bg-orange-50"
                           : "text-gray-600 hover:text-primary hover:bg-gray-50"
                       }`
                    }
                  >
                    {item.title}
                  </NavLink>
                )}
              </div>
            ))}

            <a
              href="https://bkk-dipo.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-item-anim px-4 py-2 font-medium text-gray-600 rounded-full hover:bg-gray-50"
            >
              BKK
            </a>

            <a
              ref={ppdbBtnRef}
              onMouseEnter={onEnterBtn}
              onMouseLeave={onLeaveBtn}
              href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/home"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 px-6 py-2 bg-primary text-white font-semibold rounded-full shadow-lg"
            >
              PPDB
            </a>
          </nav>

          {/* MOBILE BUTTON */}
          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-primary"
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* 🔥 MOBILE MENU (LAZY) */}
      <Suspense fallback={null}>
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => {
            setIsMobileMenuOpen(false);
            menuButtonRef.current?.focus();
          }}
        />
      </Suspense>
    </header>
  );
};

export default Navbar;
