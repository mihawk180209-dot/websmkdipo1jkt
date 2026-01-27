import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Flag,
  ArrowRight,
  History,
  Users,
  Building,
  FileText,
  UserCheck,
  Shirt,
  Sparkles,
  Award,
  BookOpen,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ganti dengan path logo sekolah Anda
import logo from "../../assets/logo yayasan al-hidayah-02.png";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const Overview = () => {
  const comp = useRef(null); // Ref untuk scoping animasi GSAP

  // --- GSAP ANIMATION SETUP ---
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Animasi Hero Elements
      gsap.from(".anim-hero", {
        y: 30, // Jarak animasi dikurangi biar lebih cepet
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      // 2. Animasi Section Intro (Logo & Teks)
      gsap.from(".anim-intro-left", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".intro-section",
          start: "top 80%",
        },
      });

      gsap.from(".anim-intro-right", {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: ".intro-section",
          start: "top 80%",
        },
      });

      // 3. Animasi Kartu Stats & Menu (Staggered)
      gsap.from(".anim-card-entry", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".grid-container",
          start: "top 85%",
        },
      });
    }, comp);

    return () => ctx.revert();
  }, []);

  // --- INTERAKSI HOVER ---
  const handleMouseEnter = (e) => {
    const card = e.currentTarget;
    const iconBox = card.querySelector(".anim-icon-box");
    const title = card.querySelector(".anim-title");

    // 1. Card Lift & Shadow
    gsap.to(card, {
      y: -8,
      boxShadow: "0 20px 30px -10px rgba(249, 115, 22, 0.1)", // Orange shadow halus
      borderColor: "rgba(249, 115, 22, 0.3)", // Border orange tipis
      duration: 0.4,
      ease: "power2.out",
    });

    // 2. Icon Box Change
    gsap.to(iconBox, {
      backgroundColor: "#f97316", // orange-500
      color: "#ffffff",
      scale: 1.1,
      duration: 0.3,
    });

    // 3. Title Color
    gsap.to(title, {
      color: "#ea580c", // orange-600
      duration: 0.3,
    });
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    const iconBox = card.querySelector(".anim-icon-box");
    const title = card.querySelector(".anim-title");

    // Reset All
    gsap.to(card, {
      y: 0,
      boxShadow: "none",
      borderColor: "#f1f5f9", // slate-200
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(iconBox, {
      backgroundColor: "#fff7ed", // orange-50 default
      color: "#ea580c", // orange-600 text
      scale: 1,
      duration: 0.3,
    });

    gsap.to(title, {
      color: "#334155", // slate-700
      duration: 0.3,
    });
  };

  // Data Menu Grid
  const exploreMenus = [
    { title: "Sejarah", icon: <History size={24} />, path: "/tentang/sejarah" },
    { title: "Guru & Staf", icon: <Users size={24} />, path: "/tentang/guru" },
    {
      title: "Fasilitas",
      icon: <Building size={24} />,
      path: "/tentang/fasilitas",
    },
    {
      title: "Struktur Org",
      icon: <FileText size={24} />,
      path: "/tentang/struktur",
    },
    { title: "Seragam", icon: <Shirt size={24} />, path: "/tentang/seragam" },
  ];

  return (
    <div
      ref={comp}
      className="min-h-screen bg-[#F8FAFC] font-sans overflow-hidden"
    >
      {/* ==================== HERO SECTION (COMPACT VERSION) ==================== */}
      {/* UPDATE: Padding dikurangi drastis (pt-24 pb-12) biar gak terlalu lebar */}
      <div className="relative pt-24 pb-12 lg:pt-32 lg:pb-16">
        {/* Background Blob scaled down */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-100 rounded-full blur-3xl opacity-40 -z-10"></div>

        <div className="container mx-auto px-4 text-center">
          <div className="anim-hero inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-bold mb-4">
            <Sparkles size={16} /> Tentang Kami
          </div>

          <h1 className="anim-hero text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
            Mewujudkan Generasi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              Unggul & Berkarakter
            </span>
          </h1>

          <p className="anim-hero text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            SMK Diponegoro 1 Jakarta berkomitmen mencetak lulusan yang tidak
            hanya kompeten dalam teknologi, tetapi juga memiliki integritas dan
            siap bersaing.
          </p>

          {/* Statistik Simple Cards (Compact) */}
        </div>
      </div>

      {/* ==================== INTRODUCTION SECTION ==================== */}
      <section className="intro-section py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Logo Section */}
            <div className="anim-intro-left w-full lg:w-5/12 flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute inset-0 bg-orange-100 rounded-full blur-2xl scale-90 opacity-50 group-hover:scale-100 transition-transform duration-500"></div>
                {/* Logo container size slightly reduced */}
                <div className="relative bg-white p-6 rounded-full shadow-xl border border-slate-50 w-56 h-56 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="Logo SMK"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="anim-intro-right w-full lg:w-7/12 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Selamat Datang di <br />
                <span className="text-slate-900 border-b-4 border-orange-400">
                  SMK Diponegoro 1
                </span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Kami adalah lembaga pendidikan kejuruan yang berdedikasi untuk
                mengembangkan potensi siswa melalui pendidikan berbasis
                teknologi. Kami percaya pendidikan bukan hanya mengisi pikiran,
                tapi juga membentuk hati dan keterampilan.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="text-orange-500" size={20} />
                    <h3 className="font-bold text-slate-800">Visi Kami</h3>
                  </div>
                  <p className="text-sm text-slate-600 italic">
                    "Menjadi institusi vokasi unggulan yang melahirkan
                    profesional adaptif berlandaskan Pancasila."
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Flag className="text-blue-500" size={20} />
                    <h3 className="font-bold text-slate-800">Misi Kami</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Menyelenggarakan pendidikan kontekstual & membangun karakter
                    siap kerja.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/tentang/visi-misi"
                  className="text-orange-600 font-semibold inline-flex items-center hover:gap-2 transition-all"
                >
                  Lihat Visi Misi Lengkap{" "}
                  <ArrowRight size={18} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== EXPLORE GRID ==================== */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Jelajahi Profil Kami
            </h2>
            <p className="text-slate-500 mt-2">
              Informasi lengkap seputar fasilitas dan manajemen sekolah
            </p>
          </div>

          <div className="grid-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {exploreMenus.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="anim-card-entry relative bg-white p-5 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Icon Box */}
                <div className="anim-icon-box p-3 rounded-lg bg-orange-50 text-orange-600 transition-colors">
                  <div className="anim-icon">{item.icon}</div>
                </div>

                {/* Title */}
                <span className="anim-title font-semibold text-slate-700 text-center text-sm">
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
