import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, User, Loader2, Sparkles, GraduationCap } from "lucide-react";
import { supabase } from "../../lib/supabase"; // Sesuaikan path

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const Guru = () => {
  const comp = useRef(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const idleCtxRef = useRef(null);
  const idleHandleRef = useRef(null);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await fetchTeachers();
      if (!mounted) return;
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching teachers:", error);
    } else {
      setTeachers(data || []);
    }
    setLoading(false);
  };

  // --- 2. FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return teachers.filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q);
      const matchesTab = activeTab === "Semua" || item.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [teachers, searchTerm, activeTab]);

  // --- 3. GSAP ANIMATION (SAFE MODE / ANTI-GHOSTING) ---
  // Immediate reveals and data-driven card reveals. Defer repeating tweens to idle.
  useEffect(() => {
    const rIC =
      typeof window !== "undefined" && window.requestIdleCallback
        ? window.requestIdleCallback.bind(window)
        : (fn) => setTimeout(fn, 200);

    const cIC =
      typeof window !== "undefined" && window.cancelIdleCallback
        ? window.cancelIdleCallback.bind(window)
        : (id) => clearTimeout(id);

    // Immediate paint-critical reveals (header + toolbar)
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();

      gsap.fromTo(
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

      gsap.fromTo(
        ".anim-toolbar",
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          delay: 0.4,
          ease: "power2.out",
        },
      );
    }, comp);

    // Data-driven reveals (run when data is ready)
    const runCards = () => {
      if (!loading) {
        ScrollTrigger.refresh();
        const ctxCards = gsap.context(() => {
          gsap.fromTo(
            ".anim-card",
            { y: 30, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              stagger: 0.05,
              ease: "back.out(1.2)",
              overwrite: "auto",
            },
          );

          if (filteredData.length === 0) {
            gsap.fromTo(
              ".anim-empty",
              { scale: 0.9, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 0.4 },
            );
          }
        }, comp);
        return ctxCards;
      }
      return null;
    };

    let cardsCtx = null;
    // schedule repeating/long-running tweens (background blob) on idle
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

    // Run cards reveal now (depends on loading/filters)
    cardsCtx = runCards();

    return () => {
      try {
        ctx.revert();
        if (cardsCtx) cardsCtx.revert();
        if (idleCtxRef.current) idleCtxRef.current.revert();
        if (idleHandleRef.current) cIC(idleHandleRef.current);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      } catch (err) {
        /* ignore */
      }
    };
  }, [loading, filteredData, activeTab]);

  // --- INTERACTION HOVER (Sesuai Tema Sejarah) ---
  const handleMouseEnter = useCallback((e) => {
    const card = e.currentTarget;
    const imgWrapper = card.querySelector(".img-wrapper");
    const name = card.querySelector(".anim-name");

    // Card Lift
    gsap.to(card, {
      y: -8,
      boxShadow: "0 20px 30px -10px rgba(249, 115, 22, 0.15)", // Orange shadow
      borderColor: "#fdba74", // orange-300
      duration: 0.3,
      ease: "power2.out",
    });

    // Image Border
    gsap.to(imgWrapper, {
      borderColor: "#f97316", // orange-500
      scale: 1.05,
      duration: 0.4,
    });

    // Text Color
    gsap.to(name, { color: "#ea580c", duration: 0.3 });
  }, []);

  const handleMouseLeave = useCallback((e) => {
    const card = e.currentTarget;
    const imgWrapper = card.querySelector(".img-wrapper");
    const name = card.querySelector(".anim-name");

    // Reset
    gsap.to(card, {
      y: 0,
      boxShadow: "none",
      borderColor: "#f1f5f9", // slate-100
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(imgWrapper, {
      borderColor: "#e2e8f0", // slate-200
      scale: 1,
      duration: 0.4,
    });

    gsap.to(name, { color: "#0f172a", duration: 0.3 }); // slate-900
  }, []);

  // Memoize rendered card grid to avoid re-render unless data/handlers change
  const renderedGrid = useMemo(() => {
    if (loading) return null;

    return filteredData.length > 0 ? (
      filteredData.map((item) => (
        <div
          key={item.id}
          className="anim-card bg-white rounded-3xl p-6 border border-slate-100 cursor-default group flex flex-col items-center text-center opacity-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 to-red-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

            <div className="img-wrapper w-32 h-32 rounded-full p-1.5 bg-white border-2 border-slate-200 relative z-10 transition-all duration-300">
              <img
                src={
                  item.image_url || "https://placehold.co/150x150?text=No+Image" // FIX: Diganti ke placehold.co
                }
                alt={item.name}
                className="w-full h-full rounded-full object-cover"
                loading={item.category === "Pimpinan" ? "eager" : "lazy"}
                decoding="async"
                fetchpriority={item.category === "Pimpinan" ? "high" : "low"}
              />
            </div>

            <span
              className={`absolute bottom-0 right-0 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider rounded-full z-20 border-2 border-white shadow-sm
                        ${
                          item.category === "Pimpinan"
                            ? "bg-violet-500"
                            : item.category === "Guru"
                              ? "bg-orange-500"
                              : "bg-slate-500"
                        }
                      `}
            >
              {item.category}
            </span>
          </div>

          <h3
            className="anim-name text-lg font-bold text-slate-900 transition-colors line-clamp-1 w-full"
            title={item.name}
          >
            {item.name}
          </h3>

          <div className="mt-2 mb-6 h-10 w-full flex items-center justify-center">
            <p className="text-sm text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 line-clamp-2">
              {item.role}
            </p>
          </div>

          <button className="mt-auto w-full py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all flex items-center justify-center gap-2 group/btn">
            <GraduationCap size={16} />
            Lihat Profil
          </button>
        </div>
      ))
    ) : (
      <div className="anim-empty col-span-full text-center py-20 opacity-0">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
          <User size={40} className="text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Tidak ditemukan
        </h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Maaf, kami tidak menemukan data yang cocok dengan kata kunci "
          <span className="font-semibold text-orange-600">{searchTerm}</span>".
          Coba gunakan kata kunci lain.
        </p>
      </div>
    );
  }, [filteredData, loading, handleMouseEnter, handleMouseLeave, searchTerm]);

  // Lightweight metadata for SEO
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Guru & Tenaga Pendidik — SMK Diponegoro 1 Jakarta";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Kenali tenaga pendidik dan kependidikan profesional di SMK Diponegoro 1 Jakarta.";

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
      className="min-h-screen bg-[#F8FAFC] font-sans pb-24 overflow-x-hidden"
    >
      {/* ==================== HERO HEADER (Tema Sejarah Style) ==================== */}
      <div className="relative py-20 lg:py-24 overflow-hidden bg-white border-b border-slate-100">
        {/* Background Decoration */}
        <div className="header-blob absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-100 rounded-full blur-3xl -translate-x-1/2 translate-y-1/3"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="anim-header flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold border border-orange-100">
              <Sparkles size={16} /> SDM Unggul & Berkarakter
            </span>
          </div>

          <h1 className="anim-header text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Guru &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Tenaga Pendidik
            </span>
          </h1>

          <p className="anim-header text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Berkenalan dengan tenaga pendidik dan kependidikan profesional yang
            siap membimbing siswa SMK Diponegoro 1 Jakarta menuju masa depan
            gemilang.
          </p>

          {/* SEARCH & FILTER BAR */}
          <div className="anim-toolbar mt-12 max-w-4xl mx-auto">
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Tabs */}
              <div className="flex p-1 bg-slate-50 rounded-xl overflow-x-auto max-w-full no-scrollbar w-full md:w-auto">
                {["Semua", "Pimpinan", "Guru", "Staf"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap flex-1 md:flex-none ${
                      activeTab === tab
                        ? "bg-white text-orange-600 shadow-sm ring-1 ring-slate-100"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72 pr-2">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari nama atau jabatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-700 placeholder-slate-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== GRID DISPLAY ==================== */}
      <section className="py-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* LOADING STATE */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2
                className="animate-spin mb-4 text-orange-500"
                size={40}
              />
              <p className="font-medium">Memuat Data Guru...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 min-h-[400px]">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="anim-card bg-white rounded-3xl p-6 border border-slate-100 cursor-default group flex flex-col items-center text-center opacity-0"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Image Container */}
                    <div className="relative mb-6">
                      {/* Glow Back */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 to-red-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                      {/* Image Wrapper */}
                      <div className="img-wrapper w-32 h-32 rounded-full p-1.5 bg-white border-2 border-slate-200 relative z-10 transition-all duration-300">
                        <img
                          src={
                            item.image_url ||
                            "https://placehold.co/150x150?text=No+Image" // FIX: Diganti ke placehold.co
                          }
                          alt={item.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>

                      {/* Badge Category */}
                      <span
                        className={`absolute bottom-0 right-0 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider rounded-full z-20 border-2 border-white shadow-sm
                          ${
                            item.category === "Pimpinan"
                              ? "bg-violet-500"
                              : item.category === "Guru"
                                ? "bg-orange-500"
                                : "bg-slate-500"
                          }
                        `}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Text Info */}
                    <h3
                      className="anim-name text-lg font-bold text-slate-900 transition-colors line-clamp-1 w-full"
                      title={item.name}
                    >
                      {item.name}
                    </h3>

                    <div className="mt-2 mb-6 h-10 w-full flex items-center justify-center">
                      <p className="text-sm text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 line-clamp-2">
                        {item.role}
                      </p>
                    </div>

                    {/* Button Profile */}
                    <button className="mt-auto w-full py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all flex items-center justify-center gap-2 group/btn">
                      <GraduationCap size={16} />
                      Lihat Profil
                    </button>
                  </div>
                ))
              ) : (
                // Empty State
                <div className="anim-empty col-span-full text-center py-20 opacity-0">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                    <User size={40} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Tidak ditemukan
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Maaf, kami tidak menemukan data yang cocok dengan kata kunci
                    "
                    <span className="font-semibold text-orange-600">
                      {searchTerm}
                    </span>
                    ". Coba gunakan kata kunci lain.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Guru;
