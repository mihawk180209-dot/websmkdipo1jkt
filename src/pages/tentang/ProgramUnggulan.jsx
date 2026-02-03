import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ArrowRight, Calendar, Loader2, Sparkles, Layers } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const ProgramUnggulan = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ref untuk scoping animasi
  const containerRef = useRef(null);

  // 1. FETCH DATA
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from("program_unggulan")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error("Error fetching programs:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. GSAP ANIMATION (deferred to idle to reduce main-thread blocking)
  useEffect(() => {
    if (loading) return;
    let ctx;
    const start = () => {
      ctx = gsap.context(() => {
        ScrollTrigger.refresh();

        // A. Background Blob
        gsap.to(".header-blob", { scale: 1.2, rotation: 15, x: 20, y: 20, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });

        // B. Header Animation (Judul, Badge, Deskripsi)
        gsap.fromTo(".anim-header", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" });

        // C. Kartu Muncul (Staggered Batch)
        if (document.querySelector(".cards-grid")) {
          gsap.fromTo(
            ".anim-card",
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)", scrollTrigger: { trigger: ".cards-grid", start: "top 85%" } },
          );
        }
      }, containerRef);
    };

    const ric = (typeof window !== "undefined" && (window.requestIdleCallback || null)) || null;
    const handle = ric ? window.requestIdleCallback(start) : setTimeout(start, 120);

    return () => {
      try {
        if (ric && window.cancelIdleCallback) window.cancelIdleCallback(handle);
        else clearTimeout(handle);
      } catch (e) {}
      try {
        if (ctx) ctx.revert();
      } catch (e) {}
      try {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      } catch (e) {}
    };
  }, [loading]);

  // Lightweight SEO metadata (DOM-only)
  useEffect(() => {
    try {
      document.title = "Program Unggulan — SMK Diponegoro 1 Jakarta";
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute(
        "content",
        "Program Unggulan SMK Diponegoro 1 Jakarta — kurikulum berbasis industri dan kompetensi keahlian.",
      );
      if (!document.querySelector('link[rel="canonical"]')) {
        const link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        link.setAttribute("href", window.location.href);
        document.head.appendChild(link);
      }
    } catch (e) {}
  }, []);

  // --- INTERAKSI HOVER (GSAP) ---
  const handleMouseEnter = useCallback((e) => {
    const card = e.currentTarget;
    const img = card.querySelector(".anim-img");
    const overlay = card.querySelector(".anim-overlay");
    const title = card.querySelector(".anim-title");
    const btn = card.querySelector(".anim-btn");
    const arrow = card.querySelector(".anim-arrow");

    // 1. Card Lift & Shadow
    gsap.to(card, {
      y: -10,
      boxShadow: "0 20px 30px -10px rgba(249, 115, 22, 0.15)", // Orange shadow halus
      borderColor: "#fdba74", // orange-300
      duration: 0.3,
      ease: "power2.out",
    });

    // 2. Image Zoom
    gsap.to(img, {
      scale: 1.1,
      duration: 0.6,
      ease: "power2.out",
    });

    // 3. Overlay Darken
    gsap.to(overlay, {
      opacity: 0.4,
      duration: 0.3,
    });

    // 4. Title Color
    gsap.to(title, {
      color: "#ea580c", // orange-600
      duration: 0.3,
    });

    // 5. Button Fill
    gsap.to(btn, {
      backgroundColor: "#f97316", // orange-500
      color: "#ffffff",
      borderColor: "#f97316",
      duration: 0.3,
    });

    // 6. Arrow Move
    gsap.to(arrow, {
      x: 5,
      duration: 0.3,
      ease: "back.out(2)",
    });
  }, []);

  const handleMouseLeave = useCallback((e) => {
    const card = e.currentTarget;
    const img = card.querySelector(".anim-img");
    const overlay = card.querySelector(".anim-overlay");
    const title = card.querySelector(".anim-title");
    const btn = card.querySelector(".anim-btn");
    const arrow = card.querySelector(".anim-arrow");

    // Reset ke kondisi awal
    gsap.to(card, {
      y: 0,
      boxShadow: "none",
      borderColor: "#f1f5f9", // slate-100
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
    gsap.to(overlay, { opacity: 0.6, duration: 0.3 });
    gsap.to(title, { color: "#0f172a", duration: 0.3 }); // slate-900
    gsap.to(btn, {
      backgroundColor: "#f8fafc", // slate-50
      color: "#334155", // slate-700
      borderColor: "transparent",
      duration: 0.3,
    });
    gsap.to(arrow, { x: 0, duration: 0.3 });
  }, []);

  return (
    <section ref={containerRef} role="main" className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header Section (Unified Theme) */}
      <div className="relative py-20 lg:py-24 overflow-hidden bg-white border-b border-slate-100 mb-16">
        <div className="header-blob absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-100 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="anim-header inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-6 opacity-0">
            <Sparkles size={16} /> Kompetensi Keahlian
          </div>

          <h2 className="anim-header text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight opacity-0">
            Program{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Unggulan
            </span>
          </h2>

          <p className="anim-header text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed opacity-0">
            Menyiapkan talenta digital masa depan dengan kurikulum berbasis
            industri dan teknologi terkini di SMK Diponegoro 1 Jakarta.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* Lightweight SEO metadata for this route */}
        {/* Using DOM API to avoid adding dependencies */}
        {typeof window !== "undefined" && (
          <meta key="pu-meta" />
        )}
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4 text-orange-500" size={40} />
            <p className="font-medium">Memuat program terbaik...</p>
          </div>
        ) : (
          /* Grid Card Modern */
          <div className="cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div
                key={program.id}
                className="anim-card bg-white rounded-3xl overflow-hidden border border-slate-100 flex flex-col h-full cursor-default opacity-0"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Image Wrapper */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={program.image_url || "https://placehold.co/600x400"}
                    alt={program.title}
                    className="anim-img w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Overlay Gradient */}
                  <div className="anim-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity" />

                  {/* Badge Floating */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-orange-600 text-xs font-bold rounded-lg shadow-sm flex items-center gap-2">
                      <Layers size={12} /> Program Unggulan
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-4">
                    <Calendar size={14} />
                    {new Date(program.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <h3 className="anim-title text-xl font-bold text-slate-900 mb-3 line-clamp-2 transition-colors">
                    {program.title}
                  </h3>

                  <p className="text-slate-500 mb-6 text-sm leading-relaxed line-clamp-3 flex-grow">
                    {program.excerpt}
                  </p>

                  <Link
                    to={`/program/${program.id}`}
                    className="anim-btn inline-flex items-center justify-between w-full px-5 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl transition-all border border-transparent"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight size={18} className="anim-arrow" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgramUnggulan;
