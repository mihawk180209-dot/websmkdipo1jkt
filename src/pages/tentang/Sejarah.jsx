import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Flag,
  Award,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    year: "19XX",
    title: "Awal Pendirian",
    desc: "Yayasan Al-Hidayah Jakarta mendirikan SMK Diponegoro 1 sebagai respon terhadap kebutuhan tenaga terampil di wilayah Jakarta Pusat. Dimulai dengan gedung sederhana dan satu jurusan.",
    icon: <Flag size={20} />,
  },
  {
    year: "2005",
    title: "Pengembangan Fasilitas",
    desc: "Melakukan renovasi besar gedung sekolah dan penambahan laboratorium komputer untuk menunjang pembelajaran berbasis teknologi.",
    icon: <TrendingUp size={20} />,
  },
  {
    year: "2015",
    title: "Akreditasi A",
    desc: "Berkat dedikasi guru dan prestasi siswa, SMK Diponegoro 1 berhasil meraih Akreditasi A, membuktikan kualitas pendidikan yang unggul.",
    icon: <Award size={20} />,
  },
  {
    year: "2020",
    title: "Transformasi Digital",
    desc: "Menghadapi era industri 4.0, sekolah menerapkan sistem pembelajaran digital (E-Learning) dan memperbarui kurikulum TKJ & DKV sesuai standar industri terbaru.",
    icon: <Calendar size={20} />,
  },
];

const Sejarah = () => {
  const comp = useRef(null); // Ref container utama

  // --- GSAP ANIMATION SETUP ---
  useLayoutEffect(() => {
    let ctx = gsap.context((self) => {
      // 1. ANIMASI HEADER (Style baru)
      const tlHeader = gsap.timeline();

      // Blob animation (Background glow)
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

      // Header Elements Entrance
      tlHeader.from(".anim-header", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      // 2. ANIMASI INTRO STORY
      gsap.from(".intro-content", {
        scrollTrigger: {
          trigger: ".intro-section",
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

      // 3. ANIMASI TIMELINE (Vertical Line Logic - TETAP DIPERTAHANKAN)
      gsap.from(".timeline-line", {
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top 70%",
          end: "bottom 80%",
          scrub: 1,
        },
        height: 0,
        ease: "none",
      });

      // 4. ANIMASI TIMELINE ITEMS (Logic zig-zag tetap, visual baru)
      const items = self.selector(".timeline-item");

      items.forEach((item, i) => {
        const isEven = i % 2 === 0;
        const card = item.querySelector(".anim-card"); // Target card baru
        const dot = item.querySelector(".timeline-dot");

        const tlItem = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });

        // Dot Pop-up
        tlItem
          .fromTo(
            dot,
            { scale: 0, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.6,
              ease: "elastic.out(1, 0.5)",
            },
          )
          // Card Slide In
          .fromTo(
            card,
            { x: isEven ? 50 : -50, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.2)" },
            "-=0.4",
          );
      });

      // 5. ANIMASI CTA SECTION
      gsap.from(".cta-content", {
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }, comp);

    return () => ctx.revert();
  }, []);

  // --- INTERAKSI HOVER (Style ProgramUnggulan) ---
  const handleMouseEnter = (e) => {
    const card = e.currentTarget;
    const title = card.querySelector(".anim-title");
    const yearBadge = card.querySelector(".anim-badge");

    // 1. Card Lift & Shadow
    gsap.to(card, {
      y: -8,
      boxShadow: "0 20px 30px -10px rgba(249, 115, 22, 0.15)", // Orange shadow halus
      borderColor: "#fdba74", // orange-300 border
      duration: 0.4,
      ease: "power2.out",
    });

    // 2. Title Color
    gsap.to(title, {
      color: "#ea580c", // orange-600
      duration: 0.3,
    });

    // 3. Badge Highlight
    gsap.to(yearBadge, {
      backgroundColor: "#f97316", // orange-500
      color: "#ffffff",
      duration: 0.3,
    });
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    const title = card.querySelector(".anim-title");
    const yearBadge = card.querySelector(".anim-badge");

    // Reset ke kondisi awal
    gsap.to(card, {
      y: 0,
      boxShadow: "none",
      borderColor: "#f1f5f9", // slate-100
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(title, {
      color: "#0f172a", // slate-900
      duration: 0.3,
    });

    gsap.to(yearBadge, {
      backgroundColor: "#ffedd5", // orange-100
      color: "#c2410c", // orange-700
      duration: 0.3,
    });
  };

  const onBtnEnter = (e) => {
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 });
  };
  const onBtnLeave = (e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
  };

  return (
    <div
      ref={comp}
      className="min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden"
    >
      {/* ==================== HEADER SECTION (Updated Theme) ==================== */}
      <div className="relative py-20 lg:py-24 overflow-hidden">
        {/* Background Decoration */}
        <div className="header-blob absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="anim-header inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-6">
            <Sparkles size={16} /> History of Diponegoro 1
          </div>

          <h1 className="anim-header text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Sejarah{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Perjalanan
            </span>
          </h1>

          <p className="anim-header text-slate-500 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Jejak langkah SMK Diponegoro 1 Jakarta dalam mengabdi untuk
            pendidikan bangsa dari masa ke masa.
          </p>
        </div>
      </div>

      {/* ==================== INTRO STORY (Cleaned UI) ==================== */}
      <section className="intro-section pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="intro-content max-w-3xl mx-auto text-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Dedikasi Lebih Dari 20 Tahun
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-0">
              SMK Diponegoro 1 Jakarta tidak berdiri dalam satu malam. Ia adalah
              hasil dari visi para pendiri yang ingin menciptakan lembaga
              pendidikan yang terjangkau namun berkualitas. Seiring berjalannya
              waktu, kami terus bertransformasi, beradaptasi dengan perubahan
              zaman, namun tetap memegang teguh nilai-nilai karakter luhur.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== TIMELINE SECTION (Logic Preserved, Style New) ==================== */}
      <section className="timeline-section py-10 pb-24 relative">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="relative">
            {/* Vertical Line */}
            <div className="timeline-line absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-0.5 bg-slate-200 top-0 h-full origin-top"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {milestones.map((item, idx) => (
                <div
                  key={idx}
                  className={`timeline-item relative flex items-center md:justify-between ${
                    idx % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Spacer untuk desktop layout */}
                  <div className="hidden md:block w-[45%]"></div>

                  {/* TITIK TENGAH (DOT) */}
                  <div className="timeline-dot absolute left-8 md:left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white border-4 border-orange-500 rounded-full flex items-center justify-center z-10 shadow-lg invisible">
                    <div className="text-orange-600 scale-75">{item.icon}</div>
                  </div>

                  {/* CARD CONTENT (New Style & Interaction) */}
                  <div className="ml-20 md:ml-0 w-full md:w-[45%]">
                    <div
                      className="anim-card bg-white p-8 rounded-3xl border border-slate-100 relative cursor-default invisible"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Arrow Decoration */}
                      <div
                        className={`hidden md:block absolute top-10 w-4 h-4 bg-white border-t border-l border-slate-100 rotate-45 z-0 transition-colors duration-300
                                    ${
                                      idx % 2 === 0
                                        ? "-left-2"
                                        : "-right-2 border-t-0 border-l-0 border-b border-r"
                                    }`}
                      ></div>

                      <span className="anim-badge inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-lg mb-4 transition-colors duration-300">
                        {item.year}
                      </span>

                      <h3 className="anim-title text-xl font-bold text-slate-900 mb-3 transition-colors duration-300">
                        {item.title}
                      </h3>

                      <p className="text-slate-500 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="cta-section py-20 bg-white border-t border-slate-100 rounded-t-[3rem]">
        <div className="container mx-auto px-4 text-center">
          <div className="cta-content invisible">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
              Menjadi Bagian dari Sejarah Kami
            </h2>
            <p className="text-slate-500 mb-10 max-w-xl mx-auto text-lg">
              Bergabunglah bersama keluarga besar SMK Diponegoro 1 Jakarta dan
              raih masa depan gemilang.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/tentang/visi-misi"
                className="px-8 py-4 bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-orange-500 hover:text-orange-600 transition duration-300"
              >
                Lihat Visi & Misi
              </Link>
              <a
                href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={onBtnEnter}
                onMouseLeave={onBtnLeave}
                className="px-8 py-4 bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition flex items-center justify-center gap-2"
              >
                Daftar Sekarang <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sejarah;
