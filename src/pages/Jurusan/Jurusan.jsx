import React, { useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Monitor,
  Palette,
  ArrowRight,
  Briefcase,
  Award,
  Cpu,
  PenTool,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

// --- IMPORT ICON GAMBAR ---
import tkjCustomIcon from "../../assets/icon-tkj2 (1).webp";
import dkvCustomIcon from "../../assets/icon-dkv2 (1).webp";

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const Jurusan = () => {
  const comp = useRef(null);
  const idleCtxRef = useRef(null);
  const idleHandleRef = useRef(null);

  // Memoize small static features list to avoid re-creating on each render
  const features = useMemo(
    () => [
      {
        icon: <Briefcase size={32} />,
        title: "Siap Kerja",
        desc: "Kurikulum Link & Match dengan industri memastikan lulusan memiliki skill yang dibutuhkan pasar kerja.",
        color: "bg-green-50 text-green-600 border-green-100",
      },
      {
        icon: <Monitor size={32} />,
        title: "Fasilitas Lengkap",
        desc: "Laboratorium praktik berstandar industri dengan spesifikasi PC dan perangkat jaringan terbaru.",
        color: "bg-blue-50 text-blue-600 border-blue-100",
      },
      {
        icon: <CheckCircle2 size={32} />,
        title: "Sertifikasi BNSP",
        desc: "Lulusan dibekali sertifikat kompetensi nasional yang diakui sebagai bukti keahlian profesional.",
        color: "bg-orange-50 text-orange-600 border-orange-100",
      },
    ],
    [],
  );

  useEffect(() => {
    /* =======================
       SEO METADATA (PAGE NAME)
       ======================= */
    try {
      if (typeof document !== "undefined") {
        document.title = "Overview — Program Keahlian | SMK Diponegoro 1";

        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement("meta");
          metaDesc.name = "description";
          document.head.appendChild(metaDesc);
        }
        metaDesc.content =
          "Pelajari jurusan TKJ (Teknik Komputer dan Jaringan) di SMK Diponegoro 1 Jakarta. Fokus jaringan, server, cloud, dan keamanan siber.";

        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
          canonical = document.createElement("link");
          canonical.rel = "canonical";
          document.head.appendChild(canonical);
        }
        canonical.href = window.location.href;
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

  // GSAP: immediate reveals + deferred repeating tweens scheduled to idle
  useEffect(() => {
    const rIC =
      typeof window !== "undefined" && window.requestIdleCallback
        ? window.requestIdleCallback.bind(window)
        : (fn) => setTimeout(fn, 200);

    const cIC =
      typeof window !== "undefined" && window.cancelIdleCallback
        ? window.cancelIdleCallback.bind(window)
        : (id) => clearTimeout(id);

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        ScrollTrigger.refresh();

        // Header reveal (paint-critical)
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

        // Jurusan cards (batch reveals)
        if (document.querySelector(".jurusan-grid")) {
          gsap.fromTo(
            ".jurusan-card",
            { y: 60, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: ".jurusan-grid",
                start: "top 85%",
              },
            },
          );
        }

        // Features grid reveals
        gsap.fromTo(
          ".feature-card",
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".features-grid",
              start: "top 85%",
            },
          },
        );

        // CTA reveal
        gsap.fromTo(
          ".anim-cta",
          { y: 50, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".cta-section",
              start: "top 90%",
            },
          },
        );
      }, comp);

      // Defer repeating/looping tweens (floating icons & header blob) to idle
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

            // Floating icons (TKJ)
            gsap.to(".float-icon-tkj-1", {
              y: -15,
              rotation: 5,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
            gsap.to(".float-icon-tkj-2", {
              y: -10,
              duration: 4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: 1,
            });

            // Floating icons (DKV)
            gsap.to(".float-icon-dkv-1", {
              y: -15,
              rotation: -5,
              duration: 3.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
            gsap.to(".float-icon-dkv-2", {
              y: -10,
              duration: 4.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: 0.5,
            });
          }, comp);
        },
        { timeout: 1200 },
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
  }, []);

  return (
    <div
      ref={comp}
      className="min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden"
    >
      {/* ==================== HEADER SECTION ==================== */}
      <div className="relative py-20 lg:py-24 overflow-hidden bg-white border-b border-slate-100">
        {/* Background Blob */}
        <div className="header-blob absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-100 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <div className="anim-header inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-6 opacity-0">
            <Sparkles size={16} /> Masa Depanmu Dimulai Di Sini
          </div>

          <h1 className="anim-header text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight opacity-0">
            Program{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Keahlian
            </span>
          </h1>

          <p className="anim-header text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed opacity-0">
            SMK Diponegoro 1 Jakarta menyelenggarakan pendidikan vokasi berbasis
            teknologi dan kreativitas yang selaras dengan tuntutan Dunia Usaha
            dan Dunia Industri (DUDI).
          </p>
        </div>
      </div>

      {/* ==================== MAJORS SELECTION (HERO CARDS) ==================== */}
      <section className="py-20 -mt-16 relative z-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="jurusan-grid grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
            {/* TKJ CARD (THEME: TEAL / CYAN) */}
            <div className="jurusan-card group relative bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 flex flex-col h-full opacity-0">
              {/* Header Image */}
              <div className="h-72 bg-gradient-to-br from-teal-500 to-cyan-600 relative flex items-center justify-center overflow-hidden">
                {/* Pattern Overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(#fff 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>

                {/* Floating Icons (GSAP) */}
                <div className="float-icon-tkj-1 absolute -right-10 -bottom-10 opacity-20">
                  <Monitor
                    size={140}
                    className="text-white rotate-12 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="float-icon-tkj-2 absolute top-10 left-10 opacity-20">
                  <Cpu size={80} className="text-white" />
                </div>

                <div className="relative z-10 text-center">
                  {/* ICON CUSTOM */}
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-5 border border-white/30 text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                    <img
                      src={tkjCustomIcon}
                      alt="Logo TKJ"
                      className="w-16 h-16 object-contain drop-shadow-md"
                    />
                  </div>

                  <h2 className="text-4xl font-extrabold text-white tracking-wide mb-1">
                    TKJ
                  </h2>
                  <p className="text-teal-100 font-medium">
                    Teknik Komputer & Jaringan
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-10 flex flex-col flex-grow">
                <p className="text-slate-600 mb-8 leading-relaxed flex-grow text-lg">
                  Mencetak teknisi handal yang ahli dalam perakitan komputer,
                  instalasi jaringan (LAN/WAN), administrasi server, mikrotik,
                  hingga keamanan siber (Cyber Security).
                </p>

                <div className="space-y-4 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-xl mt-0.5">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Prospek Karir
                      </h4>
                      <p className="text-sm text-slate-500">
                        Network Engineer, IT Support, Cyber Security Analyst
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-xl mt-0.5">
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Sertifikasi</h4>
                      <p className="text-sm text-slate-500">
                        Mikrotik MTCNA, BNSP Teknisi Jaringan
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/jurusan/tkj"
                  className="block w-full py-4 bg-teal-50 text-teal-700 text-center font-bold rounded-2xl hover:bg-teal-600 hover:text-white transition-all shadow-sm hover:shadow-lg border border-teal-100 hover:border-teal-600"
                >
                  Jelajahi TKJ
                </Link>
              </div>
            </div>

            {/* DKV CARD (THEME: PURPLE / VIOLET) */}
            <div className="jurusan-card group relative bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 flex flex-col h-full opacity-0">
              {/* Header Image */}
              <div className="h-72 bg-gradient-to-br from-violet-500 to-fuchsia-600 relative flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(#fff 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>

                {/* Floating Icons */}
                <div className="float-icon-dkv-1 absolute -left-10 -bottom-10 opacity-20">
                  <Palette
                    size={140}
                    className="text-white -rotate-12 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="float-icon-dkv-2 absolute top-10 right-10 opacity-20">
                  <PenTool size={80} className="text-white" />
                </div>

                <div className="relative z-10 text-center">
                  {/* ICON CUSTOM */}
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-5 border border-white/30 text-white shadow-lg group-hover:-rotate-12 transition-transform duration-500">
                    <img
                      src={dkvCustomIcon}
                      alt="Logo DKV"
                      className="w-16 h-16 object-contain drop-shadow-md"
                    />
                  </div>

                  <h2 className="text-4xl font-extrabold text-white tracking-wide mb-1">
                    DKV
                  </h2>
                  <p className="text-violet-100 font-medium">
                    Desain Komunikasi Visual
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-10 flex flex-col flex-grow">
                <p className="text-slate-600 mb-8 leading-relaxed flex-grow text-lg">
                  Mengembangkan kreativitas visual melalui penguasaan software
                  desain grafis, fotografi, videografi, animasi 2D/3D, dan
                  desain UI/UX untuk kebutuhan industri kreatif modern.
                </p>

                <div className="space-y-4 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-violet-50 text-violet-600 rounded-xl mt-0.5">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Prospek Karir
                      </h4>
                      <p className="text-sm text-slate-500">
                        Graphic Designer, Video Editor, UI/UX Designer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-violet-50 text-violet-600 rounded-xl mt-0.5">
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Sertifikasi</h4>
                      <p className="text-sm text-slate-500">
                        Adobe Associate, BNSP Desainer Grafis
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/jurusan/dkv"
                  className="block w-full py-4 bg-violet-50 text-violet-700 text-center font-bold rounded-2xl hover:bg-violet-600 hover:text-white transition-all shadow-sm hover:shadow-lg border border-violet-100 hover:border-violet-600"
                >
                  Jelajahi DKV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">
            Mengapa Memilih Jurusan Kami?
          </h2>

          <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Briefcase size={32} />,
                title: "Siap Kerja",
                desc: "Kurikulum Link & Match dengan industri memastikan lulusan memiliki skill yang dibutuhkan pasar kerja.",
                color: "bg-green-50 text-green-600 border-green-100",
              },
              {
                icon: <Monitor size={32} />,
                title: "Fasilitas Lengkap",
                desc: "Laboratorium praktik berstandar industri dengan spesifikasi PC dan perangkat jaringan terbaru.",
                color: "bg-blue-50 text-blue-600 border-blue-100",
              },
              {
                icon: <CheckCircle2 size={32} />,
                title: "Sertifikasi BNSP",
                desc: "Lulusan dibekali sertifikat kompetensi nasional yang diakui sebagai bukti keahlian profesional.",
                color: "bg-orange-50 text-orange-600 border-orange-100",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="feature-card p-8 bg-white rounded-3xl border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 hover:-translate-y-2 opacity-0"
              >
                <div
                  className={`w-16 h-16 ${item.color} border rounded-2xl flex items-center justify-center mx-auto mb-6`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION (Updated to Dark Theme) ==================== */}
      <section className="cta-section container mx-auto px-4 mt-16 mb-24 max-w-5xl text-center">
        <div className="anim-cta bg-gradient-to-r from-slate-900 to-slate-800 rounded-[3rem] p-10 md:p-16 shadow-2xl text-white relative overflow-hidden group opacity-0">
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 opacity-10 rounded-full blur-[80px] transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-[60px] transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Sudah Menentukan{" "}
              <span className="text-orange-500">Pilihanmu?</span>
            </h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Jangan ragu untuk bergabung bersama kami. Kuota setiap jurusan
              terbatas, amankan kursimu sekarang untuk masa depan yang lebih
              cerah.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/home"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-900/30 hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Daftar Sekarang <ArrowRight size={20} />
              </a>
              <a
                href="https://bkk-dipo.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-xl hover:bg-white hover:text-slate-900 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              >
                Info Penyaluran Kerja
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Jurusan;
