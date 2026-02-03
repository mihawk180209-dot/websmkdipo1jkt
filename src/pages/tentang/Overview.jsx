import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Flag,
  ArrowRight,
  History,
  Users,
  Building,
  FileText,
  Shirt,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import Logo (Sesuaikan path)
import logo from "../../assets/logo yayasan al-hidayah-02.webp";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const Overview = () => {
  const comp = useRef(null);

  // --- GSAP ANIMATION (deferred to idle to reduce main-thread blocking) ---
  useEffect(() => {
    let ctx;
    const startAnim = () => {
      ctx = gsap.context(() => {
        ScrollTrigger.refresh();

        // 1. Hero Elements
        gsap.fromTo(
          ".anim-hero",
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
        );

        // 2. Intro Section (Left & Right)
        gsap.fromTo(
          ".anim-intro-left",
          { x: -30, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".intro-section", start: "top 80%" },
          },
        );

        gsap.fromTo(
          ".anim-intro-right",
          { x: 30, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.1,
            scrollTrigger: { trigger: ".intro-section", start: "top 80%" },
          },
        );

        // 3. Grid Menu Cards (Staggered Batch)
        gsap.fromTo(
          ".anim-card-entry",
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.5)",
            scrollTrigger: { trigger: ".grid-container", start: "top 85%" },
          },
        );
      }, comp);
    };

    const ric =
      (typeof window !== "undefined" && (window.requestIdleCallback || null)) ||
      null;
    const handle = ric
      ? window.requestIdleCallback(startAnim)
      : setTimeout(startAnim, 120);

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
  }, []);

  // --- INTERAKSI HOVER (GSAP) ---
  const handleMouseEnter = useCallback((e) => {
    const card = e.currentTarget;
    const iconBox = card.querySelector(".anim-icon-box");
    const title = card.querySelector(".anim-title");

    gsap.to(card, {
      y: -8,
      boxShadow: "0 20px 30px -10px rgba(249, 115, 22, 0.15)", // Orange shadow
      borderColor: "#fdba74", // orange-300
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(iconBox, {
      backgroundColor: "#f97316", // orange-500
      color: "#ffffff",
      scale: 1.1,
      rotate: -5,
      duration: 0.3,
    });

    gsap.to(title, { color: "#ea580c", duration: 0.3 });
  }, []);

  const handleMouseLeave = useCallback((e) => {
    const card = e.currentTarget;
    const iconBox = card.querySelector(".anim-icon-box");
    const title = card.querySelector(".anim-title");

    gsap.to(card, {
      y: 0,
      boxShadow: "none",
      borderColor: "#f1f5f9", // slate-100
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(iconBox, {
      backgroundColor: "#fff7ed", // orange-50
      color: "#ea580c", // orange-600
      scale: 1,
      rotate: 0,
      duration: 0.3,
    });

    gsap.to(title, { color: "#334155", duration: 0.3 }); // slate-700
  }, []);

  // Memoize static menu data to avoid re-creating on each render
  const exploreMenus = useMemo(
    () => [
      {
        title: "Sejarah",
        icon: <History size={28} />,
        path: "/tentang/sejarah",
      },
      {
        title: "Guru & Staf",
        icon: <Users size={28} />,
        path: "/tentang/guru",
      },
      {
        title: "Fasilitas",
        icon: <Building size={28} />,
        path: "/tentang/fasilitas",
      },
      {
        title: "Struktur Org",
        icon: <FileText size={28} />,
        path: "/tentang/struktur",
      },
      { title: "Seragam", icon: <Shirt size={28} />, path: "/tentang/seragam" },
    ],
    [],
  );

  // Lightweight SEO metadata (DOM) without adding dependencies
  useEffect(() => {
    try {
      document.title = "Overview Tentang Kami — SMK Diponegoro 1 Jakarta";
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute(
        "content",
        "Tentang SMK Diponegoro 1 Jakarta — visi, misi, fasilitas, dan profil sekolah.",
      );

      if (!document.querySelector('link[rel="canonical"]')) {
        const link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        link.setAttribute("href", window.location.href);
        document.head.appendChild(link);
      }
    } catch (e) {}
  }, []);

  return (
    <div
      ref={comp}
      className="min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden"
    >
      {/* ==================== HERO SECTION (Updated with Orange Glow) ==================== */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* --- Background Decoration (Orange Shadow/Glow Effect) --- */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-100/50 rounded-full blur-3xl opacity-40 -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="anim-hero inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-bold mb-6 opacity-0">
            <Sparkles size={16} /> Tentang Kami
          </div>

          <h1 className="anim-hero text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight opacity-0">
            Mewujudkan Generasi <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              Unggul & Berkarakter
            </span>
          </h1>

          <p className="anim-hero text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-0">
            SMK Diponegoro 1 Jakarta berkomitmen mencetak lulusan yang tidak
            hanya kompeten dalam teknologi, tetapi juga memiliki integritas dan
            siap bersaing di era global.
          </p>
        </div>
      </div>

      {/* ==================== INTRODUCTION SECTION ==================== */}
      <section className="intro-section py-20 bg-white border-y border-slate-100 relative">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Logo Section */}
            <div className="anim-intro-left w-full lg:w-5/12 flex justify-center lg:justify-end opacity-0">
              <div className="relative group w-full max-w-sm">
                {/* Glow di belakang logo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-yellow-200 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="relative bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={logo}
                    alt="Logo SMK"
                    className="w-full h-auto object-contain max-h-[250px]"
                  />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="anim-intro-right w-full lg:w-7/12 opacity-0">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Selamat Datang di <br />
                <span className="text-orange-600 relative inline-block">
                  SMK Diponegoro 1{/* Garis bawah orange */}
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-orange-200/50 -z-10 rounded-sm"></span>
                </span>
              </h2>

              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Kami adalah lembaga pendidikan kejuruan yang berdedikasi untuk
                mengembangkan potensi siswa melalui pendidikan berbasis
                teknologi. Kami percaya pendidikan bukan hanya mengisi pikiran,
                tapi juga membentuk hati dan keterampilan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                      <Target size={20} />
                    </div>
                    <h3 className="font-bold text-slate-900">Visi Kami</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed italic">
                    "Menjadi institusi vokasi unggulan yang melahirkan
                    profesional adaptif berlandaskan Pancasila."
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Flag size={20} />
                    </div>
                    <h3 className="font-bold text-slate-900">Misi Kami</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Menyelenggarakan pendidikan kontekstual & membangun karakter
                    siap kerja.
                  </p>
                </div>
              </div>

              <Link
                to="/tentang/visi-misi"
                className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors group"
              >
                Lihat Visi Misi Lengkap
                <ArrowRight
                  size={20}
                  className="transform group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== EXPLORE GRID ==================== */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Jelajahi Profil Kami
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Informasi lengkap seputar fasilitas, struktur organisasi, dan
              manajemen sekolah untuk Anda ketahui.
            </p>
          </div>

          <div className="grid-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {exploreMenus.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="anim-card-entry bg-white rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center gap-5 cursor-pointer group hover:shadow-xl hover:border-orange-100 transition-all duration-300 opacity-0"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Icon Box */}
                <div className="anim-icon-box p-4 rounded-2xl bg-orange-50 text-orange-600 transition-all duration-300 shadow-sm">
                  {item.icon}
                </div>

                {/* Title */}
                <span className="anim-title font-bold text-slate-700 text-center transition-colors">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
