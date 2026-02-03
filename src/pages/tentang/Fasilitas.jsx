import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Wifi,
  Monitor,
  BookOpen,
  Coffee,
  Zap,
  Shield,
  Loader2,
  Sparkles,
  Layers,
  Info,
  Projector,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const Fasilitas = () => {
  const comp = useRef(null);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const idleCtxRef = useRef(null);
  const idleHandleRef = useRef(null);

  // 1. FETCH DATA
  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    const { data, error } = await supabase
      .from("facilities")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching facilities:", error);
    } else {
      setFacilities(data || []);
    }
    setLoading(false);
  };

  // 2. GSAP ANIMATION: HEADER & STATIC UI (Immediate reveals; idle long-running tweens)
  useEffect(() => {
    const rIC =
      typeof window !== "undefined" && window.requestIdleCallback
        ? window.requestIdleCallback.bind(window)
        : (fn) => setTimeout(fn, 200);

    const cIC =
      typeof window !== "undefined" && window.cancelIdleCallback
        ? window.cancelIdleCallback.bind(window)
        : (id) => clearTimeout(id);

    const ctx = gsap.context(() => {
      // Header Text (paint-critical)
      gsap.fromTo(
        ".anim-header",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: "power3.out" },
      );

      // Feature Icons (ScrollTrigger reveals)
      gsap.fromTo(
        ".feature-item",
        { scale: 0.8, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".feature-bar",
            start: "top 95%",
          },
        },
      );
    }, comp);

    // Defer continuous blob animation to idle
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
        }, comp);
      },
      { timeout: 1200 },
    );

    return () => {
      ctx.revert();
      if (idleCtxRef.current) idleCtxRef.current.revert();
      if (idleHandleRef.current) cIC(idleHandleRef.current);
    };
  }, []); // run once on mount

  // 3. GSAP ANIMATION: DYNAMIC CARDS (Jalan Setelah Data Ready)
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

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      const ctx = gsap.context(() => {
        if (document.querySelector(".gallery-grid")) {
          gsap.fromTo(
            ".anim-card",
            { y: 50, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".gallery-grid",
                start: "top 85%",
              },
            },
          );
        }

        gsap.fromTo(
          ".anim-info",
          { scale: 0.95, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".info-section",
              start: "top 90%",
            },
          },
        );
      }, comp);

      // Defer long-running bg icon spin to idle
      idleHandleRef.current = rIC(
        () => {
          idleCtxRef.current = gsap.context(() => {
            gsap.to(".bg-icon-spin", {
              rotation: 360,
              duration: 30,
              repeat: -1,
              ease: "linear",
            });
          }, comp);
        },
        { timeout: 1500 },
      );
    }, 100);

    return () => {
      clearTimeout(timer);
      try {
        if (idleCtxRef.current) idleCtxRef.current.revert();
        if (idleHandleRef.current) cIC(idleHandleRef.current);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      } catch (err) {
        /* ignore */
      }
    };
  }, [loading, facilities]); // Jalan ulang kalau data berubah

  // --- INTERACTION HOVER ---
  const handleMouseEnter = useCallback((e) => {
    const card = e.currentTarget;
    const img = card.querySelector(".anim-img");
    const title = card.querySelector(".anim-title");

    gsap.to(card, {
      y: -10,
      boxShadow: "0 20px 30px -10px rgba(249, 115, 22, 0.15)",
      borderColor: "#fdba74",
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(img, { scale: 1.1, duration: 0.5 });
    gsap.to(title, { color: "#ea580c", duration: 0.3 });
  }, []);

  const handleMouseLeave = useCallback((e) => {
    const card = e.currentTarget;
    const img = card.querySelector(".anim-img");
    const title = card.querySelector(".anim-title");

    gsap.to(card, {
      y: 0,
      boxShadow: "none",
      borderColor: "#f1f5f9",
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(img, { scale: 1, duration: 0.5 });
    gsap.to(title, { color: "#1f2937", duration: 0.3 });
  }, []);

  // Memoize rendered grid to avoid re-rendering unless data/handlers change
  const renderedGrid = useMemo(() => {
    if (loading) return null;

    return (
      <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilities.map((item) => (
          <div
            key={item.id}
            className="anim-card bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col h-full cursor-default opacity-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative h-64 overflow-hidden bg-slate-100">
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                className="anim-img w-full h-full object-cover"
              />

              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-orange-600 text-xs font-bold rounded-lg shadow-sm uppercase tracking-wide flex items-center gap-2">
                  <Layers size={12} /> {item.category}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </div>

            <div className="p-8 flex flex-col flex-grow relative">
              <h3 className="anim-title text-xl font-bold text-gray-800 mb-3 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                {item.description}
              </p>

              <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Info size={14} /> Fasilitas Penunjang KBM
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }, [facilities, loading, handleMouseEnter, handleMouseLeave]);

  // Lightweight SEO metadata injection
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Fasilitas Sekolah — SMK Diponegoro 1 Jakarta";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Sarana dan prasarana modern di SMK Diponegoro 1 Jakarta untuk mendukung kenyamanan dan kualitas pembelajaran.";

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
      <div className="relative py-20 lg:py-24 overflow-hidden bg-white border-b border-slate-100">
        <div className="header-blob absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-100 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <div className="anim-header inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-6 opacity-0">
            <Sparkles size={16} /> Sarana Prasarana
          </div>

          <h1 className="anim-header text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight opacity-0">
            Fasilitas{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Sekolah
            </span>
          </h1>

          <p className="anim-header text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed opacity-0">
            Sarana dan prasarana modern untuk mendukung kenyamanan belajar serta
            pengembangan bakat siswa SMK Diponegoro 1 Jakarta.
          </p>
        </div>
      </div>

      {/* ==================== FEATURE ICONS BAR ==================== */}
      <div className="feature-bar relative container mx-auto px-4 -mt-10 z-20">
        <div className="bg-orange-600 rounded-2xl shadow-xl shadow-orange-200 py-8 px-4 lg:px-12 max-w-5xl mx-auto text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-orange-400/30">
            {/* Feature 1 */}
            <div className="feature-item flex flex-col items-center gap-3 group px-2 opacity-0">
              <div className="p-3 bg-orange-500 rounded-xl group-hover:bg-white group-hover:text-orange-600 transition-colors duration-300 shadow-sm">
                <Wifi size={24} />
              </div>
              <span className="font-semibold text-sm md:text-base">
                Free WiFi Zone
              </span>
            </div>
            {/* Feature 2 */}
            <div className="feature-item flex flex-col items-center gap-3 group px-2 opacity-0">
              <div className="p-3 bg-orange-500 rounded-xl group-hover:bg-white group-hover:text-orange-600 transition-colors duration-300 shadow-sm">
                <Monitor size={24} />
              </div>
              <span className="font-semibold text-sm md:text-base">
                Full AC Classroom
              </span>
            </div>
            {/* Feature 3 */}
            <div className="feature-item flex flex-col items-center gap-3 group px-2 opacity-0">
              <div className="p-3 bg-orange-500 rounded-xl group-hover:bg-white group-hover:text-orange-600 transition-colors duration-300 shadow-sm">
                <Shield size={24} />
              </div>
              <span className="font-semibold text-sm md:text-base">
                24 Jam CCTV
              </span>
            </div>
            {/* Feature 4 */}
            <div className="feature-item flex flex-col items-center gap-3 group px-2 opacity-0">
              <div className="p-3 bg-orange-500 rounded-xl group-hover:bg-white group-hover:text-orange-600 transition-colors duration-300 shadow-sm">
                <Projector size={24} />
              </div>
              <span className="font-semibold text-sm md:text-base">
                Full Led Projector
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== GALLERY SECTION ==================== */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {/* LOADING STATE */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-medium">Memuat data fasilitas...</p>
            </div>
          ) : (
            <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.map((item) => (
                <div
                  key={item.id}
                  className="anim-card bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col h-full cursor-default opacity-0"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* IMAGE */}
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="anim-img w-full h-full object-cover"
                    />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-orange-600 text-xs font-bold rounded-lg shadow-sm uppercase tracking-wide flex items-center gap-2">
                        <Layers size={12} /> {item.category}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-8 flex flex-col flex-grow relative">
                    <h3 className="anim-title text-xl font-bold text-gray-800 mb-3 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                      {item.description}
                    </p>

                    <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <Info size={14} /> Fasilitas Penunjang KBM
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== ADDITIONAL INFO CARD ==================== */}
          {!loading && (
            <div className="info-section mt-24">
              <div className="anim-info bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 lg:p-14 text-white text-center relative overflow-hidden shadow-2xl opacity-0">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(#ffffff 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>

                <div className="bg-icon-spin absolute -top-10 -right-10 opacity-5 text-white pointer-events-none">
                  <BookOpen size={300} />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto">
                  <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/10">
                    <Coffee size={32} className="text-orange-400" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 tracking-tight">
                    Dukung Proses{" "}
                    <span className="text-orange-400">Belajar Mengajar</span>
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed mb-0">
                    Kami terus berkomitmen untuk meremajakan dan melengkapi
                    fasilitas sekolah setiap tahunnya demi menciptakan
                    lingkungan belajar yang kondusif, aman, dan menyenangkan
                    bagi seluruh siswa.
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

export default Fasilitas;
