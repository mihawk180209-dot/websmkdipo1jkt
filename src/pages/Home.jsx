import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  Quote,
  Monitor,
  Cpu,
  Briefcase,
  Award,
  Palette,
  PenTool,
  Calendar,
  Star,
  LayoutGrid,
  Sparkles,
  TrendingUp,

} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

// GSAP IMPORTS
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PromotionalModal from "../components/PromotionalModal";

// ASSETS IMPORT
import fotokepsek from "../assets/Bu Ipeh.webp";
import logo from "../assets/logo yayasan al-hidayah-02.webp";
import tkjCustomIcon from "../assets/icon-tkj2 (1).webp";
import dkvCustomIcon from "../assets/icon-dkv2 (1).webp";

const Home = () => {
  const container = useRef();

  // Refs for timelines to manage cleanup
  const heroTlRef = useRef();

  // Performance optimizations: detect touch device and reduced motion preference
  const isTouchDevice = useMemo(
    () => "ontouchstart" in window || navigator.maxTouchPoints > 0,
    [],
  );
  const prefersReducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // State untuk data
  const [homeArticles, setHomeArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchHomeArticles();
    document.title = "SMK DIPO 1 — SMK Diponegoro 1 Jakarta";

    // Add SEO meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    const metaOgDescription = document.querySelector(
      'meta[property="og:description"]',
    );
    const metaOgImage = document.querySelector('meta[property="og:image"]');
    const metaOgUrl = document.querySelector('meta[property="og:url"]');

    if (metaDescription)
      metaDescription.content =
        "SMK Diponegoro 1 Jakarta - Sekolah Menengah Kejuruan terakreditasi A yang menghadirkan pendidikan vokasi berbasis teknologi dan karakter.";
    else {
      const desc = document.createElement("meta");
      desc.name = "description";
      desc.content =
        "SMK Diponegoro 1 Jakarta - Sekolah Menengah Kejuruan terakreditasi A yang menghadirkan pendidikan vokasi berbasis teknologi dan karakter.";
      document.head.appendChild(desc);
    }

    if (metaKeywords)
      metaKeywords.content =
        "SMK Diponegoro 1 Jakarta, sekolah vokasi, TKJ, DKV, pendidikan teknologi, karakter, Jakarta";
    else {
      const key = document.createElement("meta");
      key.name = "keywords";
      key.content =
        "SMK Diponegoro 1 Jakarta, sekolah vokasi, TKJ, DKV, pendidikan teknologi, karakter, Jakarta";
      document.head.appendChild(key);
    }

    if (metaOgTitle)
      metaOgTitle.content = "SMK DIPO 1 — SMK Diponegoro 1 Jakarta";
    else {
      const ogt = document.createElement("meta");
      ogt.setAttribute("property", "og:title");
      ogt.content = "SMK DIPO 1 — SMK Diponegoro 1 Jakarta";
      document.head.appendChild(ogt);
    }

    if (metaOgDescription)
      metaOgDescription.content =
        "SMK Diponegoro 1 Jakarta - Sekolah Menengah Kejuruan terakreditasi A yang menghadirkan pendidikan vokasi berbasis teknologi dan karakter.";
    else {
      const ogd = document.createElement("meta");
      ogd.setAttribute("property", "og:description");
      ogd.content =
        "SMK Diponegoro 1 Jakarta - Sekolah Menengah Kejuruan terakreditasi A yang menghadirkan pendidikan vokasi berbasis teknologi dan karakter.";
      document.head.appendChild(ogd);
    }

    if (metaOgImage)
      metaOgImage.content =
        window.location.origin + "/logo yayasan al-hidayah-02.webp";
    else {
      const ogi = document.createElement("meta");
      ogi.setAttribute("property", "og:image");
      ogi.content = window.location.origin + "/logo yayasan al-hidayah-02.webp";
      document.head.appendChild(ogi);
    }

    if (metaOgUrl) metaOgUrl.content = window.location.href;
    else {
      const ogu = document.createElement("meta");
      ogu.setAttribute("property", "og:url");
      ogu.content = window.location.href;
      document.head.appendChild(ogu);
    }

    // Preload critical above-the-fold images
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };
    preloadImage(fotokepsek);
  }, []);

  // --- REGISTER GSAP PLUGINS (CLIENT-SIDE ONLY) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  // --- CLEANUP GSAP ON UNMOUNT ---
  useEffect(() => {
    return () => {
      // Kill all ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Kill all timelines
      if (heroTlRef.current) heroTlRef.current.kill();
    };
  }, []);

  // --- REFRESH SCROLLTRIGGER SAAT DATA MASUK DAN SETELAH MOUNT ---
  useEffect(() => {
    if (!loadingArticles) {
      ScrollTrigger.refresh();
    }
  }, [loadingArticles, homeArticles]);

  // --- REFRESH SCROLLTRIGGER SETELAH IMAGES LOAD ---
  useEffect(() => {
    const images = container.current?.querySelectorAll("img");
    if (!images || images.length === 0) return;

    let loadedCount = 0;
    const totalImages = images.length;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        ScrollTrigger.refresh();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad);
        img.addEventListener("error", handleImageLoad); // Count errors as loaded too
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageLoad);
      });
    };
  }, []);

  const fetchHomeArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (!error) setHomeArticles(data || []);
    setLoadingArticles(false);
  };

  // --- GSAP ANIMATION ---
  useGSAP(
    () => {
      if (typeof window === "undefined" || prefersReducedMotion) return;

      // ================= ANIMASI HERO =================
      heroTlRef.current = gsap.timeline();

      heroTlRef.current
        .to(".hero-element", {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          force3D: true,
        })
        .to(
          ".hero-logo",
          {
            scale: 1,
            autoAlpha: 1,
            rotation: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
            force3D: true,
          },
          "-=0.8",
        );

      // ================= IDLE ANIMATIONS (Floating) =================
      // Disable floating animations on mobile for performance
      const isMobile = window.innerWidth < 768;

      if (!isMobile) {
        gsap.to(".blob-orange", {
          scale: 1.1,
          opacity: 0.5,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });

        gsap.to(".blob-green", {
          scale: 1.2,
          opacity: 0.5,
          duration: 10,
          repeat: -1,
          yoyo: true,
          delay: 1,
          ease: "sine.inOut",
          force3D: true,
        });

        gsap.to(".hero-logo-img", {
          y: -15,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });

        gsap.to(".float-icon-tkj-1", {
          y: -15,
          rotation: 5,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });

        gsap.to(".float-icon-dkv-1", {
          y: -15,
          rotation: -5,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });
      }
    },
    { scope: container },
  );

  // --- INTERACTION HANDLERS (HOVER) --- //
  const { contextSafe } = useGSAP({ scope: container });

  const onHoverScale = useCallback(
    contextSafe((e) => {
      gsap.to(e.currentTarget, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    }),
    [contextSafe],
  );

  const onHoverScaleReset = useCallback(
    contextSafe((e) => {
      gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" });
    }),
    [contextSafe],
  );

  const onButtonHover = useCallback(
    contextSafe((e) => {
      gsap.to(e.currentTarget, { y: -3, scale: 1.05, duration: 0.2 });
    }),
    [contextSafe],
  );

  const onButtonReset = useCallback(
    contextSafe((e) => {
      gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.2 });
    }),
    [contextSafe],
  );

  // Kepsek hover handlers
  const onKepsekHover = useCallback(
    contextSafe((e) => {
      gsap.to(e.currentTarget, { x: 5, duration: 0.3 });
    }),
    [contextSafe],
  );
  const onKepsekLeave = useCallback(
    contextSafe((e) => {
      gsap.to(e.currentTarget, { x: 0, duration: 0.3 });
    }),
    [contextSafe],
  );

  const stats = useMemo(
    () => [
      {
        icon: <Users size={28} className="text-primary" />,
        count: "150+",
        label: "Siswa Aktif",
      },
      {
        icon: <BookOpen size={28} className="text-primary" />,
        count: "20+",
        label: "Guru Kompeten",
      },
      {
        icon: <Trophy size={28} className="text-primary" />,
        count: "10+",
        label: "Ekstrakurikuler",
      },
      {
        icon: <Users size={28} className="text-primary" />,
        count: "99%",
        label: "Lulusan Bekerja",
      },
    ],
    [],
  );

  return (
    <div ref={container} className="w-full font-sans overflow-x-hidden">
      {/* ==================== HERO SECTION ==================== */}
   <section
      className="relative overflow-hidden bg-white pt-32 pb-24 lg:pt-48 lg:pb-40"
      aria-labelledby="hero-heading"
    >
      {/* --- BACKGROUND LAYERS --- */}
      
      {/* 1. Base Gradient (Warmth) */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-white pointer-events-none" />

      {/* 2. Animated Blobs (Modern Mesh) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob Kiri Atas */}
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-orange-300/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '4s' }} />
        {/* Blob Kanan Bawah */}
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-amber-200/30 rounded-full blur-[100px] mix-blend-multiply" />
      </div>

      {/* 3. Dot Pattern (Tech Vibe) */}
      <div className="absolute inset-0 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none" />

      {/* 4. Noise Texture (Premium Feel) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge: Glassmorphism + Float Animation */}
        <div
          className="hero-element inline-flex items-center gap-2 py-1.5 px-4 pr-5 rounded-full bg-white/60 backdrop-blur-md border border-orange-200/50 text-orange-700 text-xs sm:text-sm font-inter font-semibold tracking-wide mb-8 shadow-sm hover:shadow-md hover:bg-white/80 transition-all cursor-default select-none animate-fade-in-up"
          style={{ animationFillMode: 'both' }}
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="uppercase tracking-wider">Modern Vocational School</span>
        </div>

        {/* Heading: Balanced Text for Perfect Layout */}
        <h1
          id="hero-heading"
          className="hero-element font-poppins text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] sm:leading-[1.15] mb-6 text-slate-900 tracking-tight mx-auto"
          style={{ 
            animationDelay: '0.1s', 
            animationFillMode: 'both',
            textWrap: 'balance' // Kunci biar teks rapih di mobile/tablet
          }}
        >
          Siap Kerja, Siap Kuliah. <br className="hidden lg:block"/>
          Bangun{' '}
          <span className="relative whitespace-nowrap">
            <span className="absolute -inset-1 -inset-x-2 bg-orange-100/50 skew-y-2 rounded-lg -z-10 block sm:hidden"></span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 drop-shadow-sm">
              Masa Depanmu
            </span>
            <Sparkles className="inline-block w-6 h-6 sm:w-8 sm:h-8 text-amber-400 absolute -top-4 -right-4 animate-bounce" style={{ animationDuration: '3s' }} />
          </span>{' '}
          Disini.
        </h1>

        {/* Description: Readable & Balanced */}
        <p
          className="hero-element font-inter text-base sm:text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto"
          style={{ 
            animationDelay: '0.2s', 
            animationFillMode: 'both',
            textWrap: 'balance' 
          }}
        >
          Sekolah vokasi modern dengan kurikulum berbasis industri. 
          Fokus pada <strong>praktik nyata</strong> dan pembentukan karakter siap kerja.
        </p>

        {/* Buttons: Action Oriented */}
        <div
          className="hero-element flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          {/* Primary Button */}
          <a
            href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/home"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white font-poppins font-semibold rounded-2xl shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_20px_30px_-15px_rgba(249,115,22,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
            <span className="relative">Daftar Sekarang</span>
            <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform" />
          </a>
          
          {/* Secondary Button */}
          <Link
            to="/tentang/profil"
            className="group w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-poppins font-medium rounded-2xl border border-slate-200 hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50/30 transition-all duration-300 flex justify-center items-center gap-2 shadow-sm hover:shadow-md"
          >
            <TrendingUp size={18} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
            Pelajari Profil
          </Link>
        </div>

        {/* Trust Badge / Stats (Optional - Adds Credibility) */}
        <div 
          className="hero-element mt-16 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-400"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
            <span className="flex items-center gap-2">
                <Star size={16} className="text-orange-400 fill-orange-400" />
                Terakreditasi A
            </span>
            <span className="hidden sm:inline-block text-slate-300">•</span>
            <span>Kurikulum Merdeka</span>
            <span className="hidden sm:inline-block text-slate-300">•</span>
            <span>Link & Match Industri</span>
        </div>
      </div>

      {/* Fade Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </section>


      {/* ==================== SAMBUTAN KEPSEK ==================== */}
      <section className="kepsek-section py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange-50/50 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* FOTO KEPSEK - REMOVED INVISIBLE */}
            <div className="kepsek-image-wrapper w-full lg:w-1/2 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md group cursor-default">
                <div className="absolute top-4 -right-4 w-full h-full bg-orange-100 rounded-3xl -z-10 transition-transform duration-500 group-hover:rotate-6"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-teal-50 rounded-full -z-10 blur-xl"></div>

                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white">
                  <img
                    src={fotokepsek}
                    alt="Kepala Sekolah SMK Dipo 1"
                    className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80"></div>
                </div>

                <div className="lg:hidden absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100">
                  <h4 className="font-bold text-gray-900">
                    Ibu. Nurlathifah, M.Pd.Gr
                  </h4>
                  <p className="text-xs text-gray-500">Kepala Sekolah</p>
                </div>
              </div>
            </div>

            {/* TEKS SAMBUTAN - REMOVED INVISIBLE */}
            <div className="kepsek-text-wrapper w-full lg:w-1/2">
              <div className="relative">
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="kepsek-progress block h-1 bg-primary rounded-full w-32"></span>
                  <span className="text-primary font-bold tracking-wider uppercase text-sm">
                    Sambutan Kepala Sekolah
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                  Membangun Generasi <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                    Unggul & Berkarakter
                  </span>
                </h2>

                <div
                  className="relative bg-gray-50 p-8 rounded-2xl border-l-4 border-primary shadow-sm cursor-default"
                  onMouseEnter={!isTouchDevice ? onKepsekHover : undefined}
                  onMouseLeave={!isTouchDevice ? onKepsekLeave : undefined}
                >
                  <Quote
                    size={40}
                    className="text-orange-200 absolute top-4 right-4 opacity-50 rotate-180"
                  />
                  <p className="text-gray-700 text-lg leading-relaxed italic relative z-10 font-medium">
                    "Selamat datang di era baru pendidikan vokasi. Di SMK Dipo
                    1, kami berkomitmen tidak hanya mencetak lulusan yang siap
                    kerja, tetapi juga generasi yang adaptif terhadap perubahan
                    teknologi dan memiliki fondasi karakter yang kuat."
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <div className="hidden lg:block w-1 h-12 bg-gray-200 rounded-full"></div>
                  <div className="hidden lg:block">
                    <h4 className="text-xl font-bold text-gray-900">
                      Ibu. Nurlathifah, M.Pd.Gr
                    </h4>
                    <p className="text-gray-500">
                      Kepala SMK Diponegoro 1 Jakarta
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="stats-container container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              // REMOVED INVISIBLE CLASS
              className="stat-card flex flex-col items-center text-center p-4 rounded-xl cursor-default"
              onMouseEnter={!isTouchDevice ? onHoverScale : undefined}
              onMouseLeave={!isTouchDevice ? onHoverScaleReset : undefined}
            >
              <div className="mb-4 p-4 bg-orange-50 shadow-sm rounded-full text-primary">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-extrabold text-gray-800 mb-1">
                {stat.count}
              </h3>
              <p className="text-sm text-gray-500 font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== JURUSAN SECTION ==================== */}
      <section className="py-20 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
          {/* Header - REMOVED INVISIBLE */}
          <div className="jurusan-header text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-4 justify-center">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              <span className="text-primary font-bold tracking-wider uppercase text-sm">
                Pilihan Masa Depan
              </span>
              <span className="w-8 h-1 bg-primary rounded-full"></span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
              Program{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                Keahlian
              </span>
            </h2>

            <p className="mt-4 text-gray-500 text-lg">
              Pilih masa depanmu dengan program keahlian yang relevan dengan
              kebutuhan industri masa kini.
            </p>
            <div className="jurusan-divider h-1 bg-orange-200 mx-auto mt-6 rounded-full w-20"></div>
          </div>

          {/* ==================== CARDS CONTAINER ==================== */}
          <div className="jurusan-cards-container grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* TKJ Card - REMOVED INVISIBLE */}
            <div
              className="jurusan-card bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full"
              onMouseEnter={!isTouchDevice ? onHoverScale : undefined}
              onMouseLeave={!isTouchDevice ? onHoverScaleReset : undefined}
            >
              <div className="h-64 bg-gradient-to-br from-teal-500 to-cyan-600 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                <Monitor className="float-icon-tkj-1 absolute -right-6 -bottom-6 text-white/10 w-32 h-32 rotate-12" />
                <Cpu className="float-icon-tkj-2 absolute top-8 left-8 text-white/10 w-20 h-20" />

                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-lg">
                    <img
                      src={tkjCustomIcon}
                      alt="TKJ"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">TKJ</h3>
                  <p className="text-teal-100 text-sm font-medium">
                    Teknik Komputer & Jaringan
                  </p>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
                  Fokus pada perakitan komputer, instalasi jaringan (LAN/WAN),
                  administrasi server, mikrotik, dan dasar keamanan siber.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Briefcase size={18} className="text-teal-600" />
                    <span>Network Engineer, IT Support</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Award size={18} className="text-teal-600" />
                    <span>Sertifikasi Mikrotik MTCNA</span>
                  </div>
                </div>

                <Link
                  to="/jurusan/tkj"
                  className="block w-full py-3.5 bg-teal-50 text-teal-700 text-center font-bold rounded-xl hover:bg-teal-600 hover:text-white transition-all duration-300"
                >
                  Detail TKJ
                </Link>
              </div>
            </div>

            {/* DKV Card - REMOVED INVISIBLE */}
            <div
              className="jurusan-card bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full"
              onMouseEnter={!isTouchDevice ? onHoverScale : undefined}
              onMouseLeave={!isTouchDevice ? onHoverScaleReset : undefined}
            >
              <div className="h-64 bg-gradient-to-br from-violet-600 to-fuchsia-600 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                <Palette className="float-icon-dkv-1 absolute -left-6 -bottom-6 text-white/10 w-32 h-32 -rotate-12" />
                <PenTool className="float-icon-dkv-2 absolute top-8 right-8 text-white/10 w-20 h-20" />

                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-lg">
                    <img
                      src={dkvCustomIcon}
                      alt="DKV"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">DKV</h3>
                  <p className="text-violet-100 text-sm font-medium">
                    Desain Komunikasi Visual
                  </p>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
                  Mengembangkan kreativitas visual melalui penguasaan software
                  desain, fotografi, videografi, dan multimedia interaktif.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Briefcase size={18} className="text-violet-600" />
                    <span>Graphic Designer, UI/UX, Fotografer</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Award size={18} className="text-violet-600" />
                    <span>Adobe Certified Professional</span>
                  </div>
                </div>

                <Link
                  to="/jurusan/dkv"
                  className="block w-full py-3.5 bg-violet-50 text-violet-700 text-center font-bold rounded-xl hover:bg-violet-600 hover:text-white transition-all duration-300"
                >
                  Detail DKV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ARTIKEL TERBARU ==================== */}
      <section className="artikel-section py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20 relative z-10">
          <div className="artikel-header text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-4 justify-center">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              <span className="text-primary font-bold tracking-wider uppercase text-sm">
                Dokumentasi Sekolah
              </span>
              <span className="w-8 h-1 bg-primary rounded-full"></span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
              Artikel &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                Kegiatan Terbaru
              </span>
            </h2>
            <p className="text-gray-500 mt-4 text-lg">
              Ikuti perkembangan terbaru, prestasi siswa, dan informasi edukatif
              dari SMK Diponegoro 1 Jakarta.
            </p>
          </div>

          {loadingArticles ? (
            <div className="flex flex-col items-center py-20">
              <div className="w-12 h-12 border-4 border-orange-100 border-t-primary rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4 font-medium">
                Menyusun informasi...
              </p>
            </div>
          ) : (
            <>
              <div className="artikel-grid grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {homeArticles.length > 0 ? (
                  homeArticles.map((item) => (
                    <Link
                      key={item.id}
                      to={`/artikel/${item.id}`}
                      className="artikel-card group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-orange-200/40 transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-2"
                    >
                      <div className="relative h-60 overflow-hidden">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-slate-50 text-slate-400">
                            <Monitor size={48} className="opacity-20" />
                          </div>
                        )}

                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-white/90 backdrop-blur-md text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                            <LayoutGrid size={12} />
                            {item.category || "Umum"}
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm">
                          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                            <Calendar size={14} />
                            {new Date(item.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-8 flex flex-col flex-grow">
                        <h3 className="font-extrabold text-xl text-gray-900 line-clamp-2 mb-4 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 line-clamp-3 leading-relaxed mb-6 flex-grow">
                          {item.content}
                        </p>

                        <div className="pt-6 border-t border-slate-50 flex items-center text-primary font-bold text-sm">
                          Baca Selengkapnya
                          <ArrowRight
                            size={16}
                            className="ml-2 group-hover:translate-x-2 transition-transform"
                          />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400">
                      Belum ada artikel yang diterbitkan.
                    </p>
                  </div>
                )}
              </div>

              <div className="artikel-footer mt-16 flex justify-center">
                <Link
                  to="/artikel"
                  onMouseEnter={!isTouchDevice ? onButtonHover : undefined}
                  onMouseLeave={!isTouchDevice ? onButtonReset : undefined}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:shadow-xl hover:bg-orange-600 transition-all duration-300 group"
                >
                  Lihat Semua Artikel
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      <PromotionalModal />
    </div>
  );
};

export default Home;
