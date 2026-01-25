import { useLayoutEffect, useRef } from "react";
import { Wifi, Monitor, BookOpen, Coffee, Zap, Shield } from "lucide-react";

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

// DATA FASILITAS
const facilitiesData = [
  {
    id: 1,
    title: "Laboratorium Komputer Utama",
    category: "Teknologi",
    desc: "Dilengkapi dengan 40 unit PC spesifikasi tinggi (Core i7, RTX Series) untuk menunjang praktikum TKJ dan simulasi jaringan.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800&h=500",
  },
  {
    id: 2,
    title: "Studio Multimedia & DKV",
    category: "Kreatif",
    desc: "Ruang kreatif kedap suara dengan fasilitas Green Screen, kamera DSLR/Mirrorless, dan PC editing untuk siswa jurusan DKV.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800&h=500",
  },
  {
    id: 3,
    title: "Perpustakaan Digital",
    category: "Literasi",
    desc: "Perpustakaan modern dengan ribuan koleksi buku fisik dan e-book, dilengkapi area baca lesehan yang nyaman dan ber-AC.",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800&h=500",
  },
  {
    id: 4,
    title: "Masjid Al-Hidayah",
    category: "Ibadah",
    desc: "Masjid sekolah yang luas dan bersih sebagai pusat kegiatan keagamaan, sholat berjamaah, dan pembentukan karakter akhlak mulia.",
    image:
      "https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&q=80&w=800&h=500",
  },
  {
    id: 5,
    title: "Lapangan Serbaguna",
    category: "Olahraga",
    desc: "Lapangan outdoor untuk kegiatan upacara bendera, olahraga (Futsal, Basket, Voli), dan kegiatan ekstrakurikuler.",
    image:
      "https://images.unsplash.com/photo-1562771242-a02d9090c90c?auto=format&fit=crop&q=80&w=800&h=500",
  },
  {
    id: 6,
    title: "Smart Classroom",
    category: "Pembelajaran",
    desc: "Ruang kelas nyaman ber-AC dilengkapi Proyektor/Smart TV dan CCTV untuk memantau keamanan dan kondusifitas belajar.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800&h=500",
  },
];

const Fasilitas = () => {
  const comp = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. HEADER ANIMATION (FIX: Pake fromTo)
      const tlHeader = gsap.timeline();

      gsap.to(".header-blob", {
        y: 20,
        x: 10,
        scale: 1.1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      tlHeader
        .fromTo(
          ".header-title",
          { y: -30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" },
        )
        .fromTo(
          ".header-desc",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out" },
          "-=0.5",
        );

      // 2. FEATURE ICONS BAR (FIX: Pake fromTo)
      gsap.fromTo(
        ".feature-item",
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".feature-bar",
            start: "top 85%",
          },
        },
      );

      // 3. GALLERY SECTION (FIX: Pake fromTo - INI YANG ILANG TADI)
      gsap.fromTo(
        ".facility-card",
        { y: 60, autoAlpha: 0 }, // Mulai transparan & turun
        {
          y: 0,
          autoAlpha: 1, // Jadi muncul
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".gallery-grid",
            start: "top 85%", // Trigger lebih awal biar aman
            toggleActions: "play none none reverse",
          },
        },
      );

      // 4. ADDITIONAL INFO CARD (FIX: Pake fromTo)
      gsap.fromTo(
        ".info-card",
        { y: 50, autoAlpha: 0, scale: 0.95 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".info-card",
            start: "top 90%",
          },
        },
      );

      // 5. BACKGROUND ICON SPIN
      gsap.to(".bg-icon-spin", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "linear",
      });
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={comp}
      className="min-h-screen bg-gray-50 font-sans overflow-x-hidden"
    >
      {/* ==================== HEADER SECTION ==================== */}
      <div className="bg-white py-16 lg:py-20 border-b border-gray-100 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="header-blob absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <h1 className="header-title text-4xl lg:text-5xl font-bold text-gray-900 mb-4 invisible">
            Fasilitas Sekolah
          </h1>
          <p className="header-desc text-gray-600 text-lg max-w-2xl mx-auto invisible">
            Sarana dan prasarana modern untuk mendukung kenyamanan belajar serta
            pengembangan bakat siswa SMK Diponegoro 1 Jakarta.
          </p>
        </div>
      </div>

      {/* ==================== FEATURE ICONS BAR ==================== */}
      <div className="feature-bar bg-primary py-8 shadow-lg relative -mt-8 mx-4 lg:mx-auto max-w-5xl rounded-xl z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
          {/* Feature 1 */}
          <div className="feature-item flex flex-col items-center gap-2 border-r border-orange-400/50 last:border-0 group invisible">
            <div>
              <Wifi
                size={28}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="font-semibold text-sm md:text-base">
              Free WiFi Zone
            </span>
          </div>
          {/* Feature 2 */}
          <div className="feature-item flex flex-col items-center gap-2 border-r border-orange-400/50 last:border-0 group invisible">
            <div>
              <Monitor
                size={28}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="font-semibold text-sm md:text-base">
              Full AC Lab
            </span>
          </div>
          {/* Feature 3 */}
          <div className="feature-item flex flex-col items-center gap-2 border-r border-orange-400/50 last:border-0 group invisible">
            <div>
              <Shield
                size={28}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="font-semibold text-sm md:text-base">
              24 Jam CCTV
            </span>
          </div>
          {/* Feature 4 */}
          <div className="feature-item flex flex-col items-center gap-2 group invisible">
            <div>
              <Zap
                size={28}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="font-semibold text-sm md:text-base">
              Genset Ready
            </span>
          </div>
        </div>
      </div>

      {/* ==================== GALLERY SECTION ==================== */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilitiesData.map((item) => (
              <div
                key={item.id}
                className="facility-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-default hover:-translate-y-2 invisible"
              >
                {/* IMAGE */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-wider">
                    {item.category}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 relative">
                  {/* Decorative Line Animation */}
                  <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-orange-300 group-hover:w-full transition-all duration-500 ease-out"></div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ==================== ADDITIONAL INFO CARD ==================== */}
          <div className="info-card mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 lg:p-12 text-white text-center relative overflow-hidden shadow-2xl invisible">
            {/* Background Icon (GSAP Animation) */}
            <div className="bg-icon-spin absolute top-0 right-0 p-12 opacity-10">
              <BookOpen size={200} />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Dukung Proses Belajar Mengajar
              </h2>
              <p className="text-gray-300 mb-0 leading-relaxed">
                Kami terus berkomitmen untuk meremajakan dan melengkapi
                fasilitas sekolah setiap tahunnya demi menciptakan lingkungan
                belajar yang kondusif, aman, dan menyenangkan bagi seluruh
                siswa.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Fasilitas;
