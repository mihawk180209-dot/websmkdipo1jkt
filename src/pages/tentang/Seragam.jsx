import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Shirt, Clock, Info, Loader2, Sparkles } from "lucide-react";
import { supabase } from "../../lib/supabase";

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const Seragam = () => {
  const comp = useRef(null);
  const [uniformData, setUniformData] = useState([]);
  const [loading, setLoading] = useState(true);
  const idleCtxRef = useRef(null);
  const idleHandleRef = useRef(null);

  // 1. FETCH DATA DARI SUPABASE
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await fetchUniforms();
      if (!mounted) return;
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchUniforms = async () => {
    const { data, error } = await supabase
      .from("uniforms")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching uniforms:", error);
    } else {
      setUniformData(data || []);
    }
    setLoading(false);
  };

  // 2. GSAP ANIMATION (defer long-running tweens to idle, immediate reveals preserved)
  useEffect(() => {
    if (loading) return;

    const rIC =
      typeof window !== "undefined" && window.requestIdleCallback
        ? window.requestIdleCallback.bind(window)
        : (fn) => setTimeout(fn, 200);

    const cIC =
      typeof window !== "undefined" && window.cancelIdleCallback
        ? window.cancelIdleCallback.bind(window)
        : (id) => clearTimeout(id);

    // Immediate, paint-critical reveals and ScrollTrigger setup
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();

      const tlHeader = gsap.timeline();

      tlHeader.fromTo(
        ".anim-header",
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        },
      );

      if (document.querySelector(".gallery-section")) {
        gsap.fromTo(
          ".anim-card",
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: ".gallery-section",
              start: "top 85%",
            },
          },
        );
      }

      gsap.fromTo(
        ".anim-note",
        { scale: 0.95, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".note-section",
            start: "top 90%",
          },
        },
      );
    }, comp);

    // Defer long-running, repeating tweens (floating blobs, icon pulses) to idle
    idleHandleRef.current = rIC(
      () => {
        idleCtxRef.current = gsap.context(() => {
          gsap.to(".header-blob", {
            scale: 1.2,
            rotation: 15,
            x: 20,
            y: 20,
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.to(".info-icon-pulse", {
            scale: 1.1,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }, comp);
      },
      { timeout: 1500 },
    );

    return () => {
      ctx.revert();
      if (idleCtxRef.current) idleCtxRef.current.revert();
      if (idleHandleRef.current) cIC(idleHandleRef.current);
      try {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      } catch (err) {
        /* ignore */
      }
    };
  }, [loading, uniformData]);

  // --- INTERAKSI HOVER ---
  const handleMouseEnter = useCallback((e) => {
    const card = e.currentTarget;
    const img = card.querySelector(".anim-img");
    const title = card.querySelector(".anim-title");
    const icon = card.querySelector(".anim-icon");
    const badge = card.querySelector(".anim-badge");

    // Card Lift
    gsap.to(card, {
      y: -10,
      boxShadow: "0 20px 30px -10px rgba(249, 115, 22, 0.15)",
      borderColor: "#fdba74",
      duration: 0.4,
      ease: "power2.out",
    });

    // Zoom & Colors
    gsap.to(img, { scale: 1.1, duration: 0.6 });
    gsap.to([title, icon], { color: "#ea580c", duration: 0.3 });
    gsap.to(badge, {
      backgroundColor: "#f97316",
      color: "#fff",
      duration: 0.3,
    });
  }, []);

  const handleMouseLeave = useCallback((e) => {
    const card = e.currentTarget;
    const img = card.querySelector(".anim-img");
    const title = card.querySelector(".anim-title");
    const icon = card.querySelector(".anim-icon");
    const badge = card.querySelector(".anim-badge");

    // Reset
    gsap.to(card, {
      y: 0,
      boxShadow: "none",
      borderColor: "#f1f5f9",
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(img, { scale: 1, duration: 0.6 });
    gsap.to(title, { color: "#0f172a", duration: 0.3 });
    gsap.to(icon, { color: "#cbd5e1", duration: 0.3 });
    gsap.to(badge, {
      backgroundColor: "#ffedd5",
      color: "#ea580c",
      duration: 0.3,
    });
  }, []);

  // Memoize rendered grid to avoid unnecessary re-renders
  const renderedGrid = useMemo(() => {
    if (loading) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {uniformData.map((item) => (
          <div
            key={item.id}
            className="anim-card bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col h-full cursor-default opacity-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative h-72 overflow-hidden bg-slate-100">
              <div className="absolute top-4 left-4 z-10">
                <span className="anim-badge flex items-center gap-2 bg-orange-100 backdrop-blur-sm px-4 py-2 rounded-xl text-orange-600 font-bold text-xs transition-colors duration-300">
                  <Clock size={14} /> {item.day}
                </span>
              </div>

              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                className="anim-img w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="anim-title text-xl font-bold text-slate-900 transition-colors duration-300">
                  {item.title}
                </h3>
                <Shirt
                  size={24}
                  className="anim-icon text-slate-300 transition-colors duration-300"
                />
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                {item.description}
              </p>

              <div className="pt-6 border-t border-slate-50 flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Info size={14} />
                <span>Pastikan atribut lengkap</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }, [uniformData, loading, handleMouseEnter, handleMouseLeave]);

  // Lightweight SEO metadata injection (no extra deps)
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Seragam Sekolah — SMK Diponegoro 1 Jakarta";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Ketentuan penggunaan seragam di SMK Diponegoro 1 Jakarta untuk menanamkan kedisiplinan dan kerapian siswa.";

    const existing = document.querySelector('link[rel="canonical"]');
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = window.location.href;
      document.head.appendChild(link);
    }

    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div
      ref={comp}
      className="min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden"
    >
      {/* ==================== HEADER SECTION ==================== */}
      <div className="relative py-20 lg:py-24 overflow-hidden">
        <div className="header-blob absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="anim-header inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-6 opacity-0">
            <Sparkles size={16} /> Tata Tertib
          </div>

          <h1 className="anim-header text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight opacity-0">
            Seragam{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Sekolah
            </span>
          </h1>

          <p className="anim-header text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed opacity-0">
            Ketentuan penggunaan seragam di SMK Diponegoro 1 Jakarta untuk
            menanamkan kedisiplinan dan kerapian siswa.
          </p>
        </div>
      </div>

      {/* ==================== GALLERY GRID ==================== */}
      <section className="gallery-section pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* LOADING STATE */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-medium">Memuat data seragam...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {uniformData.map((item) => (
                <div
                  key={item.id}
                  className="anim-card bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col h-full cursor-default opacity-0"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* IMAGE CONTAINER */}
                  <div className="relative h-72 overflow-hidden bg-slate-100">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="anim-badge flex items-center gap-2 bg-orange-100 backdrop-blur-sm px-4 py-2 rounded-xl text-orange-600 font-bold text-xs transition-colors duration-300">
                        <Clock size={14} /> {item.day}
                      </span>
                    </div>

                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="anim-img w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                  </div>

                  {/* CONTENT BOX */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="anim-title text-xl font-bold text-slate-900 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <Shirt
                        size={24}
                        className="anim-icon text-slate-300 transition-colors duration-300"
                      />
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                      {item.description}
                    </p>

                    <div className="pt-6 border-t border-slate-50 flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <Info size={14} />
                      <span>Pastikan atribut lengkap</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== NOTE SECTION ==================== */}
          {!loading && (
            <div className="note-section mt-20">
              <div className="anim-note bg-white border border-slate-100 rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left shadow-sm relative overflow-hidden opacity-0">
                {/* Decoration bg */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="info-icon-pulse relative z-10 p-5 bg-orange-50 rounded-2xl text-orange-600 shadow-sm border border-orange-100">
                  <Info size={32} />
                </div>

                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-slate-900 mb-3">
                    Catatan Penting Kedisiplinan
                  </h4>
                  <p className="text-slate-500 leading-relaxed max-w-3xl">
                    Siswa yang tidak mengenakan seragam sesuai ketentuan jadwal
                    tidak diperkenankan mengikuti kegiatan belajar mengajar
                    (KBM) dan akan dikenakan sanksi poin pelanggaran sesuai tata
                    tertib sekolah.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Seragam;
