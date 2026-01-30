import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabase"; // Sesuaikan path ini
import { Link } from "react-router-dom";
import {
  Calendar,
  ArrowRight,
  FileText,
  ImageOff,
  Sparkles,
  LayoutGrid,
  Loader2,
} from "lucide-react";

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const Artikel = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const comp = useRef(null); // Ref untuk scope GSAP
  const idleCtxRef = useRef(null);
  const idleHandleRef = useRef(null);

  // --- FETCH DATA ---
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await fetchArticles();
      if (!mounted) return;
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchArticles = async () => {
    let { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.log("Error:", error.message);
    else setArticles(data || []);

    setLoading(false);
  };

  // --- GSAP ANIMATION (defer repeating tweens; keep reveals immediate) ---
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

    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();

      // Header reveal (paint-critical)
      const tlHeader = gsap.timeline();

      tlHeader.fromTo(
        ".anim-header",
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
      );

      // Article grid reveals
      if (document.querySelector(".articles-grid")) {
        gsap.fromTo(
          ".article-card",
          { y: 50, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: ".articles-grid",
              start: "top 85%",
            },
          },
        );
      }

      if (articles.length === 0) {
        gsap.fromTo(
          ".empty-state",
          { scale: 0.9, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(1.7)" },
        );
      }
    }, comp);

    // Defer repeating tweens (blob) to idle
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
      { timeout: 1500 },
    );

    return () => {
      try {
        ctx.revert();
        if (idleCtxRef.current) idleCtxRef.current.revert();
        if (idleHandleRef.current) cIC(idleHandleRef.current);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      } catch (err) {
        /* ignore */
      }
    };
  }, [loading, articles]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // --- INTERAKSI HOVER ---
  const handleMouseEnter = useCallback((e) => {
    const card = e.currentTarget;
    const img = card.querySelector(".anim-img");
    const title = card.querySelector(".anim-title");

    // Card Lift
    gsap.to(card, {
      y: -8,
      boxShadow: "0 20px 30px -10px rgba(249, 115, 22, 0.15)", // Orange shadow
      borderColor: "#fdba74", // orange-300
      duration: 0.3,
      ease: "power2.out",
    });

    // Image Zoom
    gsap.to(img, {
      scale: 1.1,
      duration: 0.6,
      ease: "power2.out",
    });

    // Title Color
    gsap.to(title, { color: "#ea580c", duration: 0.1 });
  }, []);

  const handleMouseLeave = useCallback((e) => {
    const card = e.currentTarget;
    const img = card.querySelector(".anim-img");
    const title = card.querySelector(".anim-title");

    // Reset
    gsap.to(card, {
      y: 0,
      boxShadow: "none",
      borderColor: "#f1f5f9", // slate-100
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(img, { scale: 1, duration: 0.6 });
    gsap.to(title, { color: "#1f2937", duration: 0.3 }); // gray-800
  }, []);

  // Memoize the rendered article grid to avoid re-rendering unless data/handlers change
  const renderedGrid = useMemo(() => {
    if (loading) return null;

    if (articles.length === 0) {
      return (
        <div className="empty-state col-span-full py-20 text-center opacity-0">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6">
            <FileText size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Belum ada artikel
          </h3>
          <p className="text-slate-500">
            Nantikan update terbaru dari kami segera.
          </p>
        </div>
      );
    }

    return articles.map((item, idx) => (
      <div
        key={item.id}
        className="article-card group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full cursor-default opacity-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative h-60 bg-slate-100 overflow-hidden">
          {item.image_url ? (
            <>
              <img
                src={item.image_url}
                alt={item.title}
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchpriority={idx === 0 ? "high" : "low"}
                className="anim-img w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50">
              <ImageOff size={32} className="mb-2 opacity-50" />
              <span className="text-sm font-medium">Tidak ada gambar</span>
            </div>
          )}

          <div className="absolute top-4 left-4 z-10">
            <span className="bg-white/90 backdrop-blur-md text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
              <LayoutGrid size={12} />
              {item.category || "Umum"}
            </span>
          </div>
        </div>

        <div className="p-8 flex flex-col flex-grow relative">
          <div className="flex items-center text-xs font-bold text-slate-400 mb-4 gap-2 uppercase tracking-wide">
            <Calendar size={14} className="text-orange-500" />
            <span>{formatDate(item.created_at)}</span>
          </div>

          <h3 className="anim-title font-bold text-xl text-slate-900 mb-4 leading-snug transition-colors line-clamp-2">
            <Link
              to={`/artikel/${item.id}`}
              className="hover:underline decoration-orange-500 underline-offset-4 decoration-2"
            >
              {item.title}
            </Link>
          </h3>

          <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
            {item.content}
          </p>

          <Link
            to={`/artikel/${item.id}`}
            className="inline-flex items-center justify-between w-full px-5 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 border border-slate-200 hover:border-orange-500 group/btn"
          >
            <span>Baca Selengkapnya</span>
            <ArrowRight
              size={18}
              className="transition-transform group-hover/btn:translate-x-1"
            />
          </Link>
        </div>
      </div>
    ));
  }, [articles, loading, handleMouseEnter, handleMouseLeave]);

  // Lightweight SEO metadata injection
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Artikel Terbaru — SMK Diponegoro 1 Jakarta";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Berita, artikel, dan informasi terbaru dari SMK Diponegoro 1 Jakarta.";

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
      className="min-h-screen bg-[#F8FAFC] pb-24 font-sans overflow-x-hidden"
    >
      {/* ==================== HEADER SECTION ==================== */}
      <div className="relative py-20 lg:py-24 overflow-hidden bg-white border-b border-slate-100 mb-12">
        {/* Background Decoration */}
        <div className="header-blob absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-100 rounded-full blur-3xl -translate-x-1/2 translate-y-1/3"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="anim-header inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-6 opacity-0">
            <Sparkles size={16} /> Blog & Informasi
          </div>

          <h1 className="anim-header text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight opacity-0">
            Artikel{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Terbaru
            </span>
          </h1>

          <p className="anim-header text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed opacity-0">
            Dapatkan informasi terkini seputar kegiatan sekolah, prestasi siswa,
            dan perkembangan teknologi di SMK Diponegoro 1 Jakarta.
          </p>
        </div>
      </div>

      {/* ==================== CONTENT SECTION ==================== */}
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {loading ? (
          // SKELETON LOADING STATE
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4 text-orange-500" size={40} />
            <p className="font-medium">Memuat artikel terbaru...</p>
          </div>
        ) : (
          // ARTICLE GRID
          <div className="articles-grid grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.length === 0 ? (
              // EMPTY STATE
              <div className="empty-state col-span-full py-20 text-center opacity-0">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6">
                  <FileText size={40} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Belum ada artikel
                </h3>
                <p className="text-slate-500">
                  Nantikan update terbaru dari kami segera.
                </p>
              </div>
            ) : (
              articles.map((item) => (
                <div
                  key={item.id}
                  className="article-card group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full cursor-default opacity-0"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Gambar Container */}
                  <div className="relative h-60 bg-slate-100 overflow-hidden">
                    {item.image_url ? (
                      <>
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="anim-img w-full h-full object-cover" // Transisi dihandle JS
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50">
                        <ImageOff size={32} className="mb-2 opacity-50" />
                        <span className="text-sm font-medium">
                          Tidak ada gambar
                        </span>
                      </div>
                    )}

                    {/* Badge Kategori */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/90 backdrop-blur-md text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                        <LayoutGrid size={12} />
                        {item.category || "Umum"}
                      </span>
                    </div>
                  </div>

                  {/* Konten */}
                  <div className="p-8 flex flex-col flex-grow relative">
                    {/* Tanggal */}
                    <div className="flex items-center text-xs font-bold text-slate-400 mb-4 gap-2 uppercase tracking-wide">
                      <Calendar size={14} className="text-orange-500" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>

                    <h3 className="anim-title font-bold text-xl text-slate-900 mb-4 leading-snug transition-colors line-clamp-2">
                      <Link
                        to={`/artikel/${item.id}`}
                        className="hover:underline decoration-orange-500 underline-offset-4 decoration-2"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                      {item.content}
                    </p>

                    <Link
                      to={`/artikel/${item.id}`}
                      className="inline-flex items-center justify-between w-full px-5 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 border border-slate-200 hover:border-orange-500 group/btn"
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover/btn:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Artikel;
