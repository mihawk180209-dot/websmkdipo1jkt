import { useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import Dropdown from "./Dropdown";
import { navLinks } from "../data/navigation";
import gsap from "gsap";

const MobileMenu = ({ isOpen, onClose, returnFocusRef }) => {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const menuRef = useRef(null);
  const timeline = useRef(null);

  // --- CLOSE HANDLER (SAFE FOCUS RETURN) ---
  const handleClose = useCallback(() => {
    onClose();

    // Kembalikan fokus ke tombol hamburger (aksesibilitas)
    requestAnimationFrame(() => {
      returnFocusRef?.current?.focus();
    });
  }, [onClose, returnFocusRef]);

  const mobileLinks = useMemo(
    () =>
      navLinks.filter((item) => item.title !== "PPDB" && item.title !== "BKK"),
    [],
  );

  // --- GSAP TIMELINE INIT ---
  useEffect(() => {
    let ctx;
    let rafId;

    rafId = window.requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        timeline.current = gsap.timeline({ paused: true });

        timeline.current.to(overlayRef.current, {
          autoAlpha: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        timeline.current.to(
          menuRef.current,
          {
            x: "0%",
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.2",
        );

        timeline.current.from(
          ".mobile-header",
          {
            y: -20,
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.3",
        );

        timeline.current.from(
          ".mobile-link-item",
          {
            x: 50,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(1.2)",
          },
          "-=0.2",
        );
      }, containerRef);
    });

    return () => {
      try {
        ctx?.revert();
      } catch {}
      try {
        window.cancelAnimationFrame(rafId);
      } catch {}
    };
  }, []);

  // --- OPEN / CLOSE EFFECT ---
  useEffect(() => {
    if (!timeline.current) return;

    if (isOpen) {
      timeline.current.play();
      document.body.style.overflow = "hidden";
    } else {
      timeline.current.reverse();
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // --- PORTAL ---
  return createPortal(
    <div ref={containerRef} className="absolute top-0 left-0 w-0 h-0 z-[9999]">
      {/* OVERLAY */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        inert={!isOpen}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] invisible opacity-0"
      />

      {/* MENU */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        inert={!isOpen}
        className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl z-[10000] translate-x-full"
      >
        {/* HEADER */}
        <div className="mobile-header flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg font-bold text-primary">Menu</span>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-primary hover:bg-orange-50 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* LINKS */}
        <nav className="h-full overflow-y-auto pb-20 p-2">
          {mobileLinks.map((item, idx) => (
            <div key={idx} className="mobile-link-item">
              {item.submenu ? (
                <Dropdown item={item} isMobile closeMenu={handleClose} />
              ) : (
                <NavLink
                  to={item.path}
                  onClick={handleClose}
                  className={({ isActive }) =>
                    `
                    block py-3 px-4 font-medium rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-orange-50 text-primary"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `
                  }
                >
                  {item.title}
                </NavLink>
              )}
            </div>
          ))}

          {/* BKK */}
          <div className="mobile-link-item">
            <a
              href="https://bkk-dipo.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 px-4 font-medium rounded-lg text-gray-700 hover:bg-gray-50"
            >
              BKK
            </a>
          </div>

          {/* PPDB */}
          <div className="mobile-link-item mt-6 px-4">
            <a
              href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/home"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="block w-full py-3 text-center bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition-colors"
            >
              PPDB
            </a>
          </div>
        </nav>
      </div>
    </div>,
    document.body,
  );
};

export default MobileMenu;
