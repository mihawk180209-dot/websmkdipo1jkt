import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Calendar, Flag, Award, TrendingUp, ArrowRight } from "lucide-react";

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

  useLayoutEffect(() => {
    let ctx = gsap.context((self) => {
      // 1. ANIMASI HEADER (Blob & Text)
      const tlHeader = gsap.timeline();

      // Blob floating animation (Infinite)
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

      // Header Text Entrance
      tlHeader
        .from(".header-title", {
          y: -50,
          autoAlpha: 0, // Gunakan autoAlpha untuk opacity + visibility
          duration: 1,
          ease: "power3.out",
        })
        .from(
          ".header-desc",
          {
            y: 20,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5",
        );

      // 2. ANIMASI INTRO STORY
      const tlIntro = gsap.timeline({
        scrollTrigger: {
          trigger: ".intro-section",
          start: "top 80%",
        },
      });

      tlIntro
        .from(".intro-title", {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
        .from(
          ".intro-text",
          {
            y: 20,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .from(
          ".intro-divider",
          {
            width: 0,
            duration: 1,
            ease: "power3.inOut",
          },
          "-=0.4",
        );

      // 3. ANIMASI TIMELINE (Vertical Line)
      gsap.from(".timeline-line", {
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top 70%",
          end: "bottom 80%",
          scrub: 1, // Garis tumbuh mengikuti scroll mouse
        },
        height: 0,
        ease: "none",
      });

      // 4. ANIMASI TIMELINE ITEMS (Perbaikan Utama Disini)
      // Gunakan self.selector untuk memastikan hanya mengambil elemen di komponen ini
      const items = self.selector(".timeline-item");

      items.forEach((item, i) => {
        const isEven = i % 2 === 0;
        const card = item.querySelector(".timeline-card");
        const dot = item.querySelector(".timeline-dot");

        const tlItem = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 90%", // Trigger lebih awal biar gak telat muncul
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
          // Card Slide In (Kiri/Kanan gantian) - Pakai fromTo biar pasti muncul
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
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }, comp); // Scope ref ke comp

    return () => ctx.revert();
  }, []);

  // Helper untuk hover button
  const onBtnEnter = (e) => {
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 });
  };
  const onBtnLeave = (e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
  };

  return (
    <div
      ref={comp}
      className="min-h-screen bg-white font-sans overflow-x-hidden"
    >
      {/* ==================== HEADER SECTION ==================== */}
      <div className="bg-orange-50 py-16 lg:py-20 relative overflow-hidden border-b border-orange-100">
        <div className="header-blob absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay opacity-50 blur-3xl translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="header-title text-4xl lg:text-5xl font-bold text-gray-900 mb-4 invisible">
            Sejarah Perjalanan
          </h1>
          <p className="header-desc text-gray-600 text-lg max-w-2xl mx-auto invisible">
            Jejak langkah SMK Diponegoro 1 Jakarta dalam mengabdi untuk
            pendidikan bangsa dari masa ke masa.
          </p>
        </div>
      </div>

      {/* ==================== INTRO STORY ==================== */}
      <section className="intro-section py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="intro-title text-2xl font-bold text-gray-800 mb-6 invisible">
              Dedikasi Lebih Dari 20 Tahun
            </h2>
            <p className="intro-text text-gray-600 leading-relaxed text-lg mb-8 invisible">
              SMK Diponegoro 1 Jakarta tidak berdiri dalam satu malam. Ia adalah
              hasil dari visi para pendiri yang ingin menciptakan lembaga
              pendidikan yang terjangkau namun berkualitas. Seiring berjalannya
              waktu, kami terus bertransformasi, beradaptasi dengan perubahan
              zaman, namun tetap memegang teguh nilai-nilai karakter luhur.
            </p>
            <div className="intro-divider h-1 bg-primary mx-auto rounded-full w-24"></div>
          </div>
        </div>
      </section>

      {/* ==================== TIMELINE SECTION ==================== */}
      <section className="timeline-section py-10 pb-24 bg-gray-50 relative">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="relative">
            {/* Vertical Line */}
            <div className="timeline-line absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 bg-gray-300/50 rounded-full top-0 h-full origin-top"></div>

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
                  <div className="hidden md:block w-5/12"></div>

                  {/* TITIK TENGAH (DOT) */}
                  <div className="timeline-dot absolute left-8 md:left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white border-4 border-primary rounded-full flex items-center justify-center z-10 shadow-md invisible">
                    <div className="text-primary scale-75">{item.icon}</div>
                  </div>

                  {/* CARD CONTENT - Pastikan Class 'timeline-card' ada */}
                  <div className="ml-20 md:ml-0 w-full md:w-5/12">
                    <div className="timeline-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative group cursor-default invisible">
                      {/* Arrow Decoration */}
                      <div
                        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45 
                                    ${
                                      idx % 2 === 0
                                        ? "-left-2"
                                        : "-right-2 border-t-0 border-l-0 border-b border-r"
                                    }`}
                      ></div>

                      <span className="inline-block px-3 py-1 bg-orange-100 text-primary text-sm font-bold rounded-full mb-3">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
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
      <section className="cta-section py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="cta-content invisible">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Menjadi Bagian dari Sejarah Kami
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Bergabunglah bersama keluarga besar SMK Diponegoro 1 Jakarta dan
              raih masa depan gemilang.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/tentang/visi-misi"
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-primary hover:text-primary transition"
              >
                Lihat Visi & Misi
              </Link>
              <a
                href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={onBtnEnter}
                onMouseLeave={onBtnLeave}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 transition flex items-center gap-2"
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
