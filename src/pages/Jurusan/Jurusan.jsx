import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Monitor,
  Palette,
  ArrowRight,
  Briefcase,
  Award,
  Cpu,
  PenTool,
} from "lucide-react";

// --- IMPORT ICON GAMBAR LO DISINI ---
// Pastikan path-nya sesuai sama tempat lo simpen file gambarnya
import tkjCustomIcon from "../../assets/icon-tkj2.png"; // Ganti nama file sesuai punya lo
import dkvCustomIcon from "../../assets/icon-dkv2.png"; // Ganti nama file sesuai punya lo

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const Jurusan = () => {
  const comp = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. HEADER ANIMATION
      const tlHeader = gsap.timeline();

      tlHeader
        .fromTo(
          ".header-pill",
          { y: -20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.7)" },
        )
        .fromTo(
          ".header-title",
          { scale: 0.9, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6",
        )
        .fromTo(
          ".header-desc",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out" },
          "-=0.5",
        );

      // 2. JURUSAN CARDS (Staggered Entrance)
      gsap.fromTo(
        ".jurusan-card",
        { y: 80, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".jurusan-grid",
            start: "top 85%",
          },
        },
      );

      // 3. FLOATING ICONS ANIMATION (Looping)
      // Ikon Monitor & CPU (TKJ)
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

      // Ikon Palette & PenTool (DKV)
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

      // 4. WHY CHOOSE US (Features)
      gsap.fromTo(
        ".feature-card",
        { scale: 0.8, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
          },
        },
      );

      // 5. CTA SECTION
      gsap.fromTo(
        ".cta-content",
        { scale: 0.95, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".cta-section",
            start: "top 85%",
          },
        },
      );
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={comp}
      className="min-h-screen bg-gray-50 font-sans overflow-x-hidden"
    >
      {/* ==================== HEADER SECTION ==================== */}
      <div className="bg-white py-16 lg:py-24 border-b border-gray-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-teal-100 rounded-full blur-3xl opacity-60 animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <span className="header-pill inline-block py-1 px-3 rounded-full bg-orange-100 text-primary text-sm font-bold mb-4 invisible">
            Masa Depanmu Dimulai Di Sini
          </span>
          <h1 className="header-title text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 invisible">
            Program Keahlian
          </h1>
          <p className="header-desc text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed invisible">
            SMK Diponegoro 1 Jakarta menyelenggarakan pendidikan vokasi berbasis
            teknologi dan kreativitas yang selaras dengan tuntutan Dunia Usaha
            dan Dunia Industri (DUDI).
          </p>
        </div>
      </div>

      {/* ==================== MAJORS SELECTION (HERO CARDS) ==================== */}
      <section className="py-20 -mt-10 relative z-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="jurusan-grid grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* TKJ CARD (THEME: TEAL / BIRU TOSCA) */}
            <div className="jurusan-card group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col h-full invisible">
              {/* Image Header */}
              <div className="h-64 bg-gradient-to-br from-teal-500 to-cyan-600 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

                {/* Floating Icons (GSAP Animated) - INI TETEP BAWAAN */}
                <div className="float-icon-tkj-1 absolute -right-10 -bottom-10">
                  <Monitor
                    size={120}
                    className="text-white/20 rotate-12 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="float-icon-tkj-2 absolute top-10 left-10">
                  <Cpu size={80} className="text-white/20" />
                </div>

                <div className="relative z-10 text-center">
                  {/* --- ICON TENGAH TKJ (GANTI DISINI) --- */}
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                    <img
                      src={tkjCustomIcon}
                      alt="Logo TKJ"
                      className="w-15 h-15 object-contain" // object-contain biar gambarnya ga gepeng
                    />
                  </div>

                  <h2 className="text-3xl font-bold text-white tracking-wide">
                    TKJ
                  </h2>
                  <p className="text-teal-100 text-sm font-medium">
                    Teknik Komputer & Jaringan
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  Mencetak teknisi handal yang ahli dalam perakitan komputer,
                  instalasi jaringan (LAN/WAN), administrasi server, mikrotik,
                  hingga keamanan siber (Cyber Security).
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="p-1.5 bg-teal-50 text-teal-600 rounded-md">
                      <Briefcase size={16} />
                    </div>
                    <span>Prospek: Network Engineer, IT Support</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="p-1.5 bg-teal-50 text-teal-600 rounded-md">
                      <Award size={16} />
                    </div>
                    <span>Sertifikasi: Mikrotik MTCNA</span>
                  </div>
                </div>

                <Link
                  to="/jurusan/tkj"
                  className="block w-full py-3 bg-teal-50 text-teal-700 text-center font-bold rounded-xl hover:bg-teal-600 hover:text-white transition-all shadow-sm hover:shadow-lg"
                >
                  Jelajahi TKJ
                </Link>
              </div>
            </div>

            {/* DKV CARD (THEME: PURPLE / UNGU) */}
            <div className="jurusan-card group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col h-full invisible">
              {/* Image Header */}
              <div className="h-64 bg-gradient-to-br from-purple-500 to-purple-700 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                {/* Floating Icons (GSAP Animated) - INI TETEP BAWAAN */}
                <div className="float-icon-dkv-1 absolute -left-10 -bottom-10">
                  <Palette
                    size={120}
                    className="text-white/20 -rotate-12 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="float-icon-dkv-2 absolute top-10 right-10">
                  <PenTool size={80} className="text-white/20" />
                </div>

                <div className="relative z-10 text-center">
                  {/* --- ICON TENGAH DKV (GANTI DISINI) --- */}
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 text-white shadow-lg group-hover:-rotate-12 transition-transform duration-500">
                    <img
                      src={dkvCustomIcon}
                      alt="Logo DKV"
                      className="w-15 h-15 object-contain"
                    />
                  </div>

                  <h2 className="text-3xl font-bold text-white tracking-wide">
                    DKV
                  </h2>
                  <p className="text-purple-100 text-sm font-medium">
                    Desain Komunikasi Visual
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  Mengembangkan kreativitas visual melalui penguasaan software
                  desain grafis, fotografi, videografi, animasi 2D/3D, dan
                  desain UI/UX untuk kebutuhan industri kreatif.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
                      <Briefcase size={16} />
                    </div>
                    <span>Prospek: Graphic Designer, Video Editor</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
                      <Award size={16} />
                    </div>
                    <span>Sertifikasi: Adobe Associate</span>
                  </div>
                </div>

                <Link
                  to="/jurusan/dkv"
                  className="block w-full py-3 bg-purple-50 text-purple-600 text-center font-bold rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-sm hover:shadow-lg"
                >
                  Jelajahi DKV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Mengapa Memilih Jurusan Kami?
          </h2>

          <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Briefcase size={28} />,
                title: "Siap Kerja",
                desc: "Kurikulum disesuaikan dengan kebutuhan industri (Link & Match) sehingga lulusan siap langsung bekerja.",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: <Monitor size={28} />,
                title: "Fasilitas Lengkap",
                desc: "Didukung laboratorium praktik standar industri dengan spesifikasi perangkat keras terbaru.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: <Award size={28} />,
                title: "Sertifikasi BNSP",
                desc: "Lulusan dibekali sertifikat kompetensi dari BNSP yang diakui secara nasional dan internasional.",
                color: "bg-purple-100 text-purple-600",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="feature-card p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 invisible"
              >
                <div
                  className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA REGISTER ==================== */}
      <section className="cta-section py-20 bg-primary relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="cta-content invisible">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Sudah Menentukan Pilihan?
            </h2>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
              Jangan ragu untuk berkonsultasi atau langsung mendaftarkan diri.
              Kuota setiap jurusan terbatas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* LINK EXTERNAL PPDB */}
              <a
                href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/home"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-primary font-bold rounded-full shadow-lg hover:bg-gray-100 transition flex items-center justify-center gap-2 transform hover:scale-105"
              >
                Daftar Sekarang <ArrowRight size={20} />
              </a>
              <a
                href="https://bkk-dipo.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-orange-600 text-white border border-white/30 font-bold rounded-full hover:bg-orange-700 transition transform hover:scale-105"
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
