import React, { useEffect, useRef, useMemo, useCallback } from "react";
import {
  Target,
  Flag,
  CheckCircle,
  Lightbulb,
  Users,
  Globe,
  Heart,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const VisiMisi = () => {
  const comp = useRef(null);

  const missions = useMemo(
    () => [
      "Membekali murid dengan keterampilan praktis dan pemikiran inovatif untuk menciptakan karya dan solusi yang berdampak di bidang desain visual maupun teknologi informasi.",
      "Membangun karakter profesional yang adaptif, kolaboratif, dan beretika, agar lulusan mampu bersaing dan bekerja secara kompeten di berbagai lingkungan kerja.",
      "Menanamkan nilai-nilai Pancasila, kebhinekaan, dan tanggung jawab sosial dalam setiap proses pembelejaran dan hasil karya murid.",
      "Mendorong semangat berkarya dan berwirausaha berbasis teknologi dan budaya lokal, agar murid dapat menjadi pelaku perubahan yang relevan dengan perkembangan zaman dan kebutuhan masyarakat.",
    ],
    [],
  );

  const values = useMemo(
    () => [
      {
        icon: <Users size={32} />,
        title: "Profesionalisme",
        desc: "Melambangkan sikap kerja yang tangguh, bertanggung jawab, siap industri, dan menjunjung etika tinggi.",
      },
      {
        icon: <Lightbulb size={32} />,
        title: "Inovatif",
        desc: "Menggambarkan semangat berkarya, beripikir kreatif, dan menciptakan solusi baru di bidang desain maupun teknologi.",
      },
      {
        icon: <Globe size={32} />,
        title: "Kolaborasi",
        desc: "Mampu bekerja sama lintas bidang dan latar belakang dengan semangat saling menghargai, untuk menghasilkan karya dan solusi yang lebih kuat.",
      },
      {
        icon: <Heart size={32} />,
        title: "Berkarakter",
        desc: "Mewakili nilai-nilai kebhinekaan, Pancasila, empati sosial, dan tanggung jawab sebagai warga negara yang baik.",
      },
    ],
    [],
  );

  // --- GSAP ANIMATION SETUP (SAFE MODE) ---
  useEffect(() => {
    let ctx;
    const start = () => {
      ctx = gsap.context((self) => {
        // Refresh biar aman
        ScrollTrigger.refresh();

        // 1. Header Animation (Simple Fade)
        gsap.from(".anim-header", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });

        // 2. Visi Card (Trigger Per Element)
        gsap.from(".anim-visi", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: { trigger: ".anim-visi", start: "top 95%" },
        });

        // 3. Misi Section (Judul Kiri)
        gsap.from(".anim-misi-title", {
          x: -30,
          opacity: 0,
          duration: 0.6,
          scrollTrigger: { trigger: ".anim-misi-title", start: "top 90%" },
        });

        // 4. Misi Cards (Looping biar trigger satu-satu - LEBIH AMAN)
        const misiCards = self.selector(".anim-misi-card");
        misiCards.forEach((card, i) => {
          gsap.from(card, {
            x: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 95%" },
          });
        });

        // 5. Values Cards (Looping juga)
        const valueCards = self.selector(".anim-value-card");
        valueCards.forEach((card, i) => {
          gsap.from(card, {
            y: 40,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: { trigger: ".values-section", start: "top 90%" },
          });
        });
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

  // Helper Hover
  const handleMisiEnter = useCallback((e) => {
    gsap.to(e.currentTarget, {
      x: -5,
      borderColor: "#f97316",
      boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.1)",
      duration: 0.2,
    });
    gsap.to(e.currentTarget.querySelector(".icon-check"), {
      color: "#ea580c",
      scale: 1.1,
      duration: 0.2,
    });
  }, []);

  const handleMisiLeave = useCallback((e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      borderColor: "#e2e8f0",
      boxShadow: "none",
      duration: 0.2,
    });
    gsap.to(e.currentTarget.querySelector(".icon-check"), {
      color: "#cbd5e1",
      scale: 1,
      duration: 0.2,
    });
  }, []);

  // Lightweight SEO metadata (DOM-only)
  useEffect(() => {
    try {
      document.title = "Visi & Misi — SMK Diponegoro 1 Jakarta";
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute(
        "content",
        "Visi dan Misi SMK Diponegoro 1 Jakarta — arah, tujuan, dan nilai pendidikan vokasi yang kami pegang.",
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
    <div ref={comp} className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      {/* ==================== HEADER HERO ==================== */}
      <div className="relative py-20 lg:py-28 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-100 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="anim-header inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-6">
            <Sparkles size={16} /> Arah & Tujuan Kami
          </div>

          <h1 className="anim-header text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Visi & Misi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Sekolah
            </span>
          </h1>

          <p className="anim-header text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Menjadi landasan kami dalam melangkah, mendidik, dan mempersiapkan
            generasi masa depan yang gemilang.
          </p>
        </div>
      </div>

      {/* ==================== VISI SECTION ==================== */}
      <div className="visi-section container mx-auto px-4 -mt-16 lg:-mt-20 relative z-20">
        <div className="anim-visi bg-white rounded-3xl p-8 lg:p-14 shadow-xl shadow-slate-200/50 border border-slate-100 text-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>

          <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-orange-100">
            <Target size={40} />
          </div>

          <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-6">
            Visi Kami
          </h2>

          <blockquote className="text-2xl lg:text-4xl font-serif font-medium text-slate-800 leading-snug">
            “Mewujudkan institusi pendidikan vokasi unggulan yang melahirkan
            generasi{" "}
            <span className="text-orange-600 underline decoration-4 decoration-orange-200">
              profesional
            </span>
            ,{" "}
            <span className="text-orange-600 underline decoration-4 decoration-orange-200">
              adaptif
            </span>
            , dan{" "}
            <span className="text-orange-600 underline decoration-4 decoration-orange-200">
              berdaya saing global;
            </span>{" "}
            berlandaskan Pancasila, menguasai teknologi terbarukan, serta mampu
            berkarya dan menciptakan perubahan positif dalam masyarakat."
          </blockquote>
        </div>
      </div>

      {/* ==================== MISI SECTION ==================== */}
      <section className="misi-section py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* Kolom Kiri */}
            <div className="w-full lg:w-1/3 relative lg:sticky lg:top-32 anim-misi-title">
              <div className="flex items-center gap-3 mb-6 text-orange-600">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Flag size={28} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Misi Kami</h2>
              </div>

              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Menyelenggarakan pendidikan vokasi berbasis teknologi dan
                kreativitas yang kontekstual dan terintegrasi dengan kebutuhan
                industri masa kini dan masa depan.
              </p>

              <div className="hidden lg:block p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-500 font-medium">
                  "Kami berkomitmen memberikan layanan pendidikan terbaik dengan
                  standar kualitas yang terus ditingkatkan."
                </p>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="w-full lg:w-2/3">
              <div className="space-y-6">
                {missions.map((misi, idx) => (
                  <div
                    key={idx}
                    className="anim-misi-card flex gap-5 p-6 lg:p-8 bg-white rounded-3xl border border-slate-200 cursor-default transition-all"
                    onMouseEnter={handleMisiEnter}
                    onMouseLeave={handleMisiLeave}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle
                        className="icon-check text-slate-300 transition-colors duration-300"
                        size={28}
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-2">
                        Misi Ke-{idx + 1}
                      </h4>
                      <p className="text-slate-600 leading-relaxed">{misi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CORE VALUES SECTION ==================== */}
      <section className="values-section py-24 bg-slate-900 text-white relative overflow-hidden rounded-t-[3rem]">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-orange-500/20 blur-[100px] rounded-full"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight">
              Nilai & <span className="text-orange-500">Tujuan</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-600 to-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="anim-value-card group bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:bg-slate-800 hover:border-orange-500/50 transition-all duration-300 text-center hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-orange-500 border border-slate-700 group-hover:border-orange-500/30 shadow-lg">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {val.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisiMisi;
