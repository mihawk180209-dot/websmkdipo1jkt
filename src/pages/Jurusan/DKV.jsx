import { useEffect, useRef, useMemo } from "react";
import {
  Palette,
  Camera,
  Video,
  Layers,
  CheckCircle,
  Briefcase,
  ArrowRight,
  PenTool,
} from "lucide-react";
import { Link } from "react-router-dom";

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const DKV = () => {
  const comp = useRef(null);
  const idleCtxRef = useRef(null);
  const idleHandleRef = useRef(null);

  const skills = useMemo(
    () => [
      { icon: <PenTool size={20} />, text: "Graphic Design" },
      { icon: <Camera size={20} />, text: "Photography" },
      { icon: <Video size={20} />, text: "Videography" },
      { icon: <Layers size={20} />, text: "UI/UX Design" },
    ],
    [],
  );

  const jobs = useMemo(
    () => [
      {
        title: "Graphic Designer",
        desc: "Membuat desain visual untuk branding, iklan, dan media cetak.",
      },
      {
        title: "Video Editor & Videographer",
        desc: "Mengambil dan menyunting video untuk konten kreatif.",
      },
      {
        title: "UI/UX Designer",
        desc: "Merancang antarmuka aplikasi/web yang user-friendly.",
      },
      {
        title: "Social Media Specialist",
        desc: "Membuat konten visual menarik untuk media sosial.",
      },
      {
        title: "Photographer",
        desc: "Fotografer profesional untuk produk, event, atau fashion.",
      },
      {
        title: "Freelance Illustrator",
        desc: "Menawarkan jasa ilustrasi digital secara mandiri.",
      },
    ],
    [],
  );

  useEffect(() => {
    // Metadata (lightweight, avoids adding new dependencies)
    try {
      if (typeof document !== "undefined") {
        document.title = "DKV — Desain Komunikasi Visual | SMK Diponegoro 1";
        const md = document.querySelector('meta[name="description"]');
        if (md)
          md.setAttribute(
            "content",
            "Pelajari kurikulum, fasilitas, dan prospek karir Jurusan DKV di SMK Diponegoro 1.",
          );
        else {
          const m = document.createElement("meta");
          m.name = "description";
          m.content =
            "Pelajari kurikulum, fasilitas, dan prospek karir Jurusan DKV di SMK Diponegoro 1.";
          document.head.appendChild(m);
        }
        const canon = document.querySelector('link[rel="canonical"]');
        if (!canon) {
          const c = document.createElement("link");
          c.rel = "canonical";
          c.href = window.location.href;
          document.head.appendChild(c);
        }
      }
    } catch (err) {
      /* ignore DOM safety errors */
    }

    let ctx = gsap.context(() => {
      // 1. HERO ANIMATION
      const tlHero = gsap.timeline();

      // Background Image Zoom Out Effect
      tlHero.fromTo(
        ".hero-bg-img",
        { scale: 1.1, autoAlpha: 0 },
        { scale: 1, autoAlpha: 0.3, duration: 2, ease: "power2.out" },
      );

      // Hero Content Entrance
      tlHero
        .fromTo(
          ".hero-pill",
          { y: -20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.7)" },
          "-=1.5",
        )
        .fromTo(
          ".hero-title",
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" },
          "-=1.2",
        )
        .fromTo(
          ".hero-desc",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out" },
          "-=1",
        );

      // 2. OVERVIEW SECTION
      gsap.fromTo(
        ".overview-img",
        { x: -50, autoAlpha: 0, rotation: -5 },
        {
          x: 0,
          autoAlpha: 1,
          rotation: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".overview-section",
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        ".floating-badge",
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          delay: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".overview-section",
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        ".overview-text",
        { x: 50, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".overview-section",
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        ".skill-item",
        { scale: 0.8, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 85%",
          },
        },
      );

      // 3. ROADMAP / CURRICULUM
      gsap.fromTo(
        ".roadmap-header",
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".roadmap-section",
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        ".roadmap-card",
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".roadmap-grid",
            start: "top 85%",
          },
        },
      );

      // 4. CAREER PROSPECTS
      gsap.fromTo(
        ".career-intro",
        { x: -30, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".career-section",
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        ".job-card",
        { x: 30, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".jobs-grid",
            start: "top 85%",
          },
        },
      );

      // 5. CTA FOOTER & SPINNING ICON
      gsap.fromTo(
        ".cta-content",
        { scale: 0.9, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".cta-section",
            start: "top 85%",
          },
        },
      );

      // do not create infinite repeats on main thread here; schedule below
    }, comp);

    // schedule long-running/looping tweens in idle time to reduce main-thread impact
    const rIC =
      typeof window !== "undefined" && window.requestIdleCallback
        ? window.requestIdleCallback.bind(window)
        : (fn) => setTimeout(fn, 600);
    const cIC =
      typeof window !== "undefined" && window.cancelIdleCallback
        ? window.cancelIdleCallback.bind(window)
        : (id) => clearTimeout(id);

    idleHandleRef.current = rIC(
      () => {
        idleCtxRef.current = gsap.context(() => {
          gsap.to(".spin-icon", {
            rotation: 360,
            duration: 30,
            repeat: -1,
            ease: "linear",
          });
        }, comp);
      },
      { timeout: 1200 },
    );

    return () => {
      try {
        ctx.revert();
      } catch (e) {
        /* ignore */
      }
      try {
        if (idleCtxRef.current) idleCtxRef.current.revert();
        if (idleHandleRef.current) cIC(idleHandleRef.current);
      } catch (e) {
        /* ignore */
      }
      try {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      } catch (e) {
        /* ignore */
      }
    };
  }, []);

  return (
    <div
      ref={comp}
      className="min-h-screen bg-white font-sans overflow-x-hidden"
    >
      {/* ==================== HERO SECTION ==================== */}
      <div className="relative bg-gray-900 py-24 lg:py-32 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1920"
              alt="Creative Studio"
              className="hero-bg-img w-full h-full object-cover opacity-0" // Start invisible
            />
          </div>
          {/* Purple Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-purple-900/70 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="hero-pill inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-6 backdrop-blur-sm invisible">
            <Palette size={16} />
            <span className="text-sm font-bold tracking-wider">
              INDUSTRI KREATIF
            </span>
          </div>
          <h1 className="hero-title text-4xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight invisible">
            Desain Komunikasi <span className="text-purple-500">Visual</span>
          </h1>
          <p className="hero-desc text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed invisible">
            Kembangkan bakat senimu menjadi keterampilan profesional di bidang
            desain grafis, fotografi, videografi, hingga desain antarmuka
            digital (UI/UX).
          </p>
        </div>
      </div>

      {/* ==================== OVERVIEW SECTION ==================== */}
      <section className="overview-section py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image */}
            <div className="overview-img w-full lg:w-1/2 invisible">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform hover:rotate-2 transition-transform duration-500 group">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"
                  alt="Siswa DKV sedang mendesain"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Floating Badge */}
                <div className="floating-badge absolute bottom-6 -left-4 bg-white/90 backdrop-blur p-4 rounded-r-xl shadow-lg border-l-4 border-purple-600 max-w-xs invisible">
                  <p className="text-sm font-bold text-gray-800">
                    "Fasilitas Studio Lengkap & Software Berlisensi"
                  </p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="overview-text w-full lg:w-1/2 invisible">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Apa itu Jurusan DKV?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Desain Komunikasi Visual (DKV) adalah ilmu yang mempelajari
                konsep komunikasi dan ungkapan kreatif melalui berbagai media
                untuk menyampaikan pesan dan gagasan secara visual.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Di SMK Dipo 1, siswa DKV dididik untuk menguasai *tools* standar
                industri seperti **Adobe Creative Suite (Ps, Ai, Pr, Ae)** dan
                diajarkan membangun portofolio yang kuat agar siap bersaing di
                industri kreatif global.
              </p>

              <div className="skills-grid grid grid-cols-2 gap-4">
                {[
                  { icon: <PenTool size={20} />, text: "Graphic Design" },
                  { icon: <Camera size={20} />, text: "Photography" },
                  { icon: <Video size={20} />, text: "Videography" },
                  { icon: <Layers size={20} />, text: "UI/UX Design" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="skill-item flex items-center gap-3 invisible"
                  >
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      {item.icon}
                    </div>
                    <span className="font-medium text-gray-700">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MATERI / KURIKULUM ==================== */}
      <section className="roadmap-section py-20 bg-purple-50/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="roadmap-header text-center mb-16 invisible">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Roadmap Kreatif
            </h2>
            <div className="w-20 h-1 bg-purple-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">
              Tahapan pembelajaran dari konsep dasar hingga produksi profesional
            </p>
          </div>

          <div className="roadmap-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kelas X */}
            <div className="roadmap-card bg-white p-8 rounded-2xl shadow-sm border-t-4 border-purple-400 hover:shadow-xl transition-all hover:-translate-y-2 duration-300 invisible">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="font-bold text-xl">X</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Dasar Seni & Grafis
              </h3>
              <ul className="space-y-3">
                {[
                  "Dasar Seni Rupa & Nirmana",
                  "Sketsa & Gambar Bentuk",
                  "Fotografi Dasar (Teknik Pengambilan)",
                  "Komputer Grafis Dasar (Vector/Bitmap)",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-gray-600 text-sm">
                    <CheckCircle
                      size={16}
                      className="text-purple-500 mt-0.5 min-w-[16px]"
                    />{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Kelas XI */}
            <div className="roadmap-card bg-white p-8 rounded-2xl shadow-sm border-t-4 border-purple-600 hover:shadow-xl transition-all md:-translate-y-4 hover:-translate-y-6 duration-300 invisible">
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mb-6">
                <span className="font-bold text-xl">XI</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Produksi Media
              </h3>
              <ul className="space-y-3">
                {[
                  "Desain Grafis Percetakan & Publikasi",
                  "Teknik Videografi & Editing Video",
                  "Animasi 2D Dasar",
                  "Tipografi & Tata Letak",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-gray-600 text-sm">
                    <CheckCircle
                      size={16}
                      className="text-purple-500 mt-0.5 min-w-[16px]"
                    />{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Kelas XII */}
            <div className="roadmap-card bg-white p-8 rounded-2xl shadow-sm border-t-4 border-purple-800 hover:shadow-xl transition-all hover:-translate-y-2 duration-300 invisible">
              <div className="w-12 h-12 bg-purple-200 text-purple-900 rounded-xl flex items-center justify-center mb-6">
                <span className="font-bold text-xl">XII</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Digital & Portofolio
              </h3>
              <ul className="space-y-3">
                {[
                  "Desain Media Interaktif (UI/UX)",
                  "Animasi 3D & Visual Effects",
                  "Penyusunan Portofolio Industri",
                  "Produk Kreatif & Kewirausahaan",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-gray-600 text-sm">
                    <CheckCircle
                      size={16}
                      className="text-purple-500 mt-0.5 min-w-[16px]"
                    />{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PROSPEK KERJA ==================== */}
      <section className="career-section py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="career-intro w-full md:w-1/3 invisible">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Prospek Karir
              </h2>
              <p className="text-gray-600 mb-6">
                Industri kreatif sedang berkembang pesat. Lulusan DKV SMK Dipo 1
                memiliki peluang emas untuk bekerja di agensi, startup, media,
                atau menjadi freelancer sukses.
              </p>
              <a
                href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition shadow-lg hover:shadow-purple-200"
              >
                Daftar Jurusan Ini <ArrowRight size={18} />
              </a>
            </div>

            <div className="jobs-grid w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Graphic Designer",
                  desc: "Membuat desain visual untuk branding, iklan, dan media cetak.",
                },
                {
                  title: "Video Editor & Videographer",
                  desc: "Mengambil dan menyunting video untuk konten kreatif.",
                },
                {
                  title: "UI/UX Designer",
                  desc: "Merancang antarmuka aplikasi/web yang user-friendly.",
                },
                {
                  title: "Social Media Specialist",
                  desc: "Membuat konten visual menarik untuk media sosial.",
                },
                {
                  title: "Photographer",
                  desc: "Fotografer profesional untuk produk, event, atau fashion.",
                },
                {
                  title: "Freelance Illustrator",
                  desc: "Menawarkan jasa ilustrasi digital secara mandiri.",
                },
              ].map((job, idx) => (
                <div
                  key={idx}
                  className="job-card flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-colors group cursor-default invisible"
                >
                  <div className="mt-1 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {job.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{job.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA FOOTER ==================== */}
      <section className="cta-section py-16 bg-purple-700 relative overflow-hidden">
        {/* Abstract shapes Animated */}
        <div className="spin-icon absolute bottom-0 right-0 text-purple-800 opacity-20 transform translate-x-1/4 translate-y-1/4 origin-center">
          <Palette size={300} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="cta-content invisible">
            <h2 className="text-3xl font-bold text-white mb-4">
              Gali Potensi Kreatifmu Di Sini
            </h2>
            <p className="text-purple-100 mb-8 max-w-xl mx-auto">
              Jangan biarkan bakat senimu terpendam. Mari asah bersama para ahli
              di SMK Diponegoro 1 Jakarta.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-white text-purple-700 font-bold rounded-full hover:bg-gray-100 transition shadow-lg"
              >
                Daftar Sekarang
              </a>
              <Link
                to="/jurusan"
                className="px-8 py-3 border border-white text-white font-bold rounded-full hover:bg-purple-800 transition"
              >
                Lihat Jurusan Lain
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DKV;
