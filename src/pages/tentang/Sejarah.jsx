import React, { useEffect, useRef, useMemo, useCallback } from "react";
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

  // --- GSAP ANIMATION SETUP (deferred to idle to reduce main-thread blocking) ---
  useEffect(() => {
    let ctx;
    const start = () => {
      ctx = gsap.context((self) => {
        ScrollTrigger.refresh();

        // 1. ANIMASI HEADER (Safe Fade In + idle loop)
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

        // 2. ANIMASI INTRO STORY
        gsap.fromTo(
          ".intro-content",
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: { trigger: ".intro-section", start: "top 85%" },
          },
        );

        // 3. ANIMASI TIMELINE (Vertical Line)
        gsap.fromTo(
          ".timeline-line",
          { height: 0 },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: ".timeline-section",
              start: "top 70%",
              end: "bottom 80%",
              scrub: 1,
            },
          },
        );

        // 4. ANIMASI TIMELINE ITEMS (Batch Trigger)
        const items = self.selector(".timeline-item");
        items.forEach((item, i) => {
          const isEven = i % 2 === 0;
          const card = item.querySelector(".anim-card");
          const dot = item.querySelector(".timeline-dot");

          const tlItem = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });

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
            .fromTo(
              card,
              { x: isEven ? 50 : -50, autoAlpha: 0 },
              { x: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.2)" },
              "-=0.4",
            );
        });

        // 5. ANIMASI CTA SECTION (Fixed Ghosting)
        gsap.fromTo(
          ".cta-content",
          { y: 50, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: ".cta-section", start: "top 95%" },
          },
        );
      }, comp);
    };

    const ric =
      (typeof window !== "undefined" && (window.requestIdleCallback || null)) ||
      null;
    const handle = ric
      ? window.requestIdleCallback(start)
      : setTimeout(start, 120);

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

  // --- INTERAKSI HOVER (stabilized handlers) ---
  const handleMouseEnter = useCallback((e) => {
    const card = e.currentTarget;
    const title = card.querySelector(".anim-title");
    const yearBadge = card.querySelector(".anim-badge");

    gsap.to(card, {
      y: -8,
      boxShadow: "0 20px 30px -10px rgba(249, 115, 22, 0.15)",
      borderColor: "#fdba74",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(title, { color: "#ea580c", duration: 0.3 });
    gsap.to(yearBadge, {
      backgroundColor: "#f97316",
      color: "#ffffff",
      duration: 0.3,
    });
  }, []);

  const handleMouseLeave = useCallback((e) => {
    const card = e.currentTarget;
    const title = card.querySelector(".anim-title");
    const yearBadge = card.querySelector(".anim-badge");

    gsap.to(card, {
      y: 0,
      boxShadow: "none",
      borderColor: "#f1f5f9",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(title, { color: "#0f172a", duration: 0.3 });
    gsap.to(yearBadge, {
      backgroundColor: "#ffedd5",
      color: "#c2410c",
      duration: 0.3,
    });
  }, []);

  const onBtnEnter = useCallback(
    (e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 }),
    [],
  );
  const onBtnLeave = useCallback(
    (e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 }),
    [],
  );

  // Lightweight SEO metadata
  useEffect(() => {
    try {
      document.title = "Sejarah — SMK Diponegoro 1 Jakarta";
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute(
        "content",
        "Sejarah SMK Diponegoro 1 Jakarta — perjalanan, pencapaian, dan transformasi institusi vokasi.",
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
      role="main"
      className="min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden"
    >
      {/* ==================== HEADER SECTION ==================== */}
      <div className="relative py-20 lg:py-24 overflow-hidden">
        <div className="header-blob absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="anim-header inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-6 opacity-0">
            <Sparkles size={16} /> History of Diponegoro 1
          </div>

          <h1 className="anim-header text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight opacity-0">
            Sejarah{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Perjalanan
            </span>
          </h1>

          <p className="anim-header text-slate-500 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed opacity-0">
            Jejak langkah SMK Diponegoro 1 Jakarta dalam mengabdi untuk
            pendidikan bangsa dari masa ke masa.
          </p>
        </div>
      </div>

      {/* ==================== INTRO STORY ==================== */}
      <section className="intro-section pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="intro-content max-w-3xl mx-auto text-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm opacity-0">
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

      {/* ==================== TIMELINE SECTION ==================== */}
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
                  <div className="hidden md:block w-[45%]"></div>

                  {/* DOT */}
                  <div className="timeline-dot absolute left-8 md:left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white border-4 border-orange-500 rounded-full flex items-center justify-center z-10 shadow-lg opacity-0">
                    <div className="text-orange-600 scale-75">{item.icon}</div>
                  </div>

                  {/* CARD */}
                  <div className="ml-20 md:ml-0 w-full md:w-[45%]">
                    <div
                      className="anim-card bg-white p-8 rounded-3xl border border-slate-100 relative cursor-default opacity-0"
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
          <div className="cta-content opacity-0">
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
