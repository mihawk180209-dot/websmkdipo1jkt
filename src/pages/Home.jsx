import React, { useRef } from "react";
import { ArrowRight, BookOpen, Users, Trophy, Quote } from "lucide-react";
import { Link } from "react-router-dom";

// GSAP IMPORTS
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ASSETS
import fotokepsek from "../assets/Bu Ipeh.jpg";
import logo from "../assets/logo yayasan al-hidayah-02.png";

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const container = useRef();

  useGSAP(
    () => {
      // --- 1. HERO SECTION ANIMATIONS (On Load) --- //
      const tlHero = gsap.timeline();

      // Badge, Title, Desc, Buttons (Staggered Fade Up)
      tlHero
        .from(".hero-element", {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        })
        // Logo Entrance (Pop effect)
        .from(
          ".hero-logo",
          {
            scale: 0.5,
            opacity: 0,
            rotation: -10,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.8",
        );

      // Background Blobs (Infinite Floating) - Replaces animate={{ repeat: Infinity }}
      gsap.to(".blob-orange", {
        scale: 1.1,
        opacity: 0.5,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".blob-green", {
        scale: 1.2,
        opacity: 0.5,
        duration: 10,
        repeat: -1,
        yoyo: true,
        delay: 1,
        ease: "sine.inOut",
      });

      // Logo Floating (Infinite Hover)
      gsap.to(".hero-logo-img", {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // --- 2. SAMBUTAN KEPSEK (ScrollTrigger) --- //
      // Foto Slide in from Left
      gsap.from(".kepsek-image-wrapper", {
        scrollTrigger: {
          trigger: ".kepsek-section",
          start: "top 75%",
        },
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      // Text Slide in from Right
      gsap.from(".kepsek-text-wrapper", {
        scrollTrigger: {
          trigger: ".kepsek-section",
          start: "top 75%",
        },
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2, // Sedikit delay setelah foto
      });

      // Progress Bar Animation
      gsap.fromTo(
        ".kepsek-progress",
        { width: 0 },
        {
          width: 32,
          duration: 1,
          scrollTrigger: { trigger: ".kepsek-text-wrapper", start: "top 80%" },
        },
      );

      // --- 3. STATS SECTION (Staggered Scroll) --- //
      gsap.from(".stat-card", {
        scrollTrigger: {
          trigger: ".stats-container",
          start: "top 85%",
        },
        y: 60,
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)", // Bounce effect
      });

      // --- 4. JURUSAN SECTION --- //
      // Header Text
      gsap.from(".jurusan-header", {
        scrollTrigger: { trigger: ".jurusan-header", start: "top 85%" },
        y: 30,
        opacity: 0,
        duration: 0.8,
      });

      // Divider Line
      gsap.fromTo(
        ".jurusan-divider",
        { width: 0 },
        {
          width: 80,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: { trigger: ".jurusan-header", start: "top 85%" },
        },
      );

      // Jurusan Cards
      gsap.from(".jurusan-card", {
        scrollTrigger: {
          trigger: ".jurusan-cards-container",
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    },
    { scope: container },
  );

  // --- INTERACTION HANDLERS (HOVER) --- //
  // Because we removed framer's whileHover, we use GSAP contextSafe for interactions

  const { contextSafe } = useGSAP({ scope: container });

  // Generic Hover Scale
  const onHoverScale = contextSafe((e) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const onHoverScaleReset = contextSafe((e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" });
  });

  // Button Hover (Lift)
  const onButtonHover = contextSafe((e) => {
    gsap.to(e.currentTarget, { y: -3, scale: 1.05, duration: 0.2 });
  });
  const onButtonReset = contextSafe((e) => {
    gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.2 });
  });

  // Jurusan Card Hover (Complex: Lift card, Rotate Icon, Fade BG)
  const onCardHover = contextSafe((e) => {
    const card = e.currentTarget;
    const icon = card.querySelector(".card-icon");
    const bg = card.querySelector(".card-bg-overlay");
    const title = card.querySelector("h3");

    gsap.to(card, { y: -10, duration: 0.4, ease: "power2.out" });
    if (icon)
      gsap.to(icon, {
        scale: 1.2,
        rotate: 10,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    if (bg) gsap.to(bg, { opacity: 1, duration: 0.4 });
    if (title) gsap.to(title, { color: card.dataset.color, duration: 0.3 }); // Optional color change
  });

  const onCardReset = contextSafe((e) => {
    const card = e.currentTarget;
    const icon = card.querySelector(".card-icon");
    const bg = card.querySelector(".card-bg-overlay");
    const title = card.querySelector("h3");

    gsap.to(card, { y: 0, duration: 0.4, ease: "power2.out" });
    if (icon) gsap.to(icon, { scale: 1, rotate: 0, duration: 0.4 });
    if (bg) gsap.to(bg, { opacity: 0, duration: 0.4 });
    if (title) gsap.to(title, { clearProps: "color", duration: 0.3 });
  });

  return (
    <div ref={container} className="overflow-x-hidden font-sans">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50/30 pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8 xl:gap-20">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left z-10">
              <span className="hero-element inline-block py-1.5 px-4 rounded-full bg-orange-100 text-primary text-sm font-bold mb-6 tracking-wide">
                ✨ TerAkreditasi A
              </span>

              <h1 className="hero-element text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
                SMK DIPO 1
              </h1>

              <p className="hero-element text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Mencetak lulusan yang tidak hanya cerdas secara teknologi 💻,
                tetapi juga memiliki karakter akhlak mulia dan siap bersaing di
                dunia industri global.
              </p>

              <div className="hero-element flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={onButtonHover}
                  onMouseLeave={onButtonReset}
                  className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-orange-300/50 transition-shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  Daftar Sekarang <ArrowRight size={20} />
                </a>
                <Link
                  to="/tentang/profil"
                  onMouseEnter={onButtonHover}
                  onMouseLeave={onButtonReset}
                  className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:border-primary hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
                >
                  Pelajari Profil
                </Link>
              </div>
            </div>

            {/* Image / Logo Section */}
            <div className="flex-1 relative flex justify-center lg:justify-end">
              {/* Background Blobs */}
              <div className="blob-orange absolute top-0 right-0 w-60 h-60 lg:w-72 lg:h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
              <div className="blob-green absolute bottom-0 left-0 w-60 h-60 lg:w-72 lg:h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

              {/* Logo Floating */}
              <div className="hero-logo relative w-64 h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-white/80 backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center p-8 border-4 border-white z-20">
                <img
                  src={logo}
                  alt="Logo SMK Dipo 1"
                  className="hero-logo-img w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SAMBUTAN KEPSEK ==================== */}
      <section className="kepsek-section py-24 bg-white relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange-50/50 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* FOTO KEPSEK */}
            <div className="kepsek-image-wrapper w-full lg:w-1/2 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md group cursor-default">
                {/* Background Shape */}
                <div className="absolute top-4 -right-4 w-full h-full bg-orange-100 rounded-3xl -z-10 transition-transform duration-500 group-hover:rotate-6"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-teal-50 rounded-full -z-10 blur-xl"></div>

                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white">
                  <img
                    src={fotokepsek}
                    alt="Kepala Sekolah SMK Dipo 1"
                    className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80"></div>
                </div>

                {/* Mobile Badge */}
                <div className="lg:hidden absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100">
                  <h4 className="font-bold text-gray-900">
                    Ibu. Nurlathifah, M.Pd.Gr
                  </h4>
                  <p className="text-xs text-gray-500">Kepala Sekolah</p>
                </div>
              </div>
            </div>

            {/* TEKS SAMBUTAN */}
            <div className="kepsek-text-wrapper w-full lg:w-1/2">
              <div className="relative">
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="kepsek-progress block h-1 bg-primary rounded-full w-0"></span>
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
                  onMouseEnter={(e) =>
                    gsap.to(e.currentTarget, { x: 5, duration: 0.3 })
                  }
                  onMouseLeave={(e) =>
                    gsap.to(e.currentTarget, { x: 0, duration: 0.3 })
                  }
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
          {[
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
          ].map((stat, idx) => (
            <div
              key={idx}
              className="stat-card flex flex-col items-center text-center p-4 rounded-xl cursor-default"
              onMouseEnter={onHoverScale}
              onMouseLeave={onHoverScaleReset}
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
          {/* Header */}
          <div className="jurusan-header text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Program Keahlian
            </h2>
            <div className="jurusan-divider h-1.5 bg-primary mx-auto rounded-full w-0"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
              Pilih masa depanmu dengan program keahlian yang relevan dengan
              industri.
            </p>
          </div>

          {/* Cards Container */}
          <div className="jurusan-cards-container grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* TKJ Card */}
            <div
              className="jurusan-card bg-white rounded-3xl shadow-xl overflow-hidden group border border-gray-100 transition-colors hover:border-cyan-400/30 cursor-pointer"
              data-color="#0891b2" // Color for hover logic
              onMouseEnter={onCardHover}
              onMouseLeave={onCardReset}
            >
              <div className="h-64 bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center relative overflow-hidden">
                <div className="card-bg-overlay absolute inset-0 bg-white/10 opacity-0" />
                <span className="card-icon text-8xl drop-shadow-lg cursor-default block">
                  💻
                </span>
              </div>
              <div className="p-10 relative">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 transition-colors">
                  Teknik Komputer & Jaringan
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Ahli dalam perakitan, jaringan, server, dan keamanan siber.
                </p>
                <Link
                  to="/jurusan/tkj"
                  className="inline-flex items-center justify-center w-full px-6 py-4 bg-cyan-50 text-cyan-700 font-bold rounded-2xl hover:bg-teal-500 hover:text-white transition-all hover:shadow-lg hover:shadow-cyan-200"
                >
                  Jelajahi TKJ <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>

            {/* DKV Card */}
            <div
              className="jurusan-card bg-white rounded-3xl shadow-xl overflow-hidden group border border-gray-100 transition-colors hover:border-purple-400/30 cursor-pointer"
              data-color="#9333ea"
              onMouseEnter={onCardHover}
              onMouseLeave={onCardReset}
            >
              <div className="h-64 bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center relative overflow-hidden">
                <div className="card-bg-overlay absolute inset-0 bg-white/10 opacity-0" />
                <span className="card-icon text-8xl drop-shadow-lg cursor-default block">
                  🎨
                </span>
              </div>
              <div className="p-10 relative">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 transition-colors">
                  Desain Komunikasi Visual
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Kreativitas tanpa batas di dunia digital, grafis, dan
                  multimedia.
                </p>
                <Link
                  to="/jurusan/dkv"
                  className="inline-flex items-center justify-center w-full px-6 py-4 bg-purple-50 text-purple-600 font-bold rounded-2xl hover:bg-purple-600 hover:text-white transition-all hover:shadow-lg hover:shadow-purple-200"
                >
                  Jelajahi DKV <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
