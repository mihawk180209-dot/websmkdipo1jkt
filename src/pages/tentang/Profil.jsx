import { useEffect, useRef, useMemo } from "react";
import {
  Building2,
  Award,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  CheckCircle,
} from "lucide-react";

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Pastikan path gambar benar
import gedungSekolah from "../../assets/WhatsApp Image 2021-01-12 at 10.38.27.jpeg";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const Profil = () => {
  const comp = useRef(null);

  useEffect(() => {
    let ctx;
    const start = () => {
      ctx = gsap.context(() => {
        // 1. HERO ANIMATION (Parallax Effect)
        const tlHero = gsap.timeline();

        // Gambar background zoom in pelan
        tlHero.fromTo(
          ".hero-bg-img",
          { scale: 1.1, autoAlpha: 0 },
          { scale: 1, autoAlpha: 0.4, duration: 2, ease: "power2.out" },
        );

        // Teks Hero muncul setelah gambar
        tlHero
          .fromTo(
            ".hero-badge",
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

        // 2. QUICK STATS CARDS (Staggered)
        gsap.fromTo(
          ".stat-card",
          { y: 50, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: { trigger: ".stats-container", start: "top 85%" },
          },
        );

        // 3. TABLE ROWS ANIMATION
        gsap.fromTo(
          ".table-row",
          { x: -20, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: { trigger: ".identity-table", start: "top 80%" },
          },
        );

        // 4. MAPS ANIMATION
        gsap.fromTo(
          ".maps-container",
          { scale: 0.95, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: ".maps-container", start: "top 85%" },
          },
        );

        // 5. SIDEBAR (Contact & Visi)
        gsap.fromTo(
          ".sidebar-item",
          { x: 30, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: { trigger: ".sidebar-container", start: "top 80%" },
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

  // Memoized static data to avoid re-creation
  const schoolIdentity = useMemo(
    () => [
      { label: "Nama Sekolah", value: "SMK Diponegoro 1 Jakarta" },
      { label: "NPSN", value: "20103701" },
      { label: "Status Sekolah", value: "Swasta" },
      { label: "Akreditasi", value: "A (Unggul)" },
      { label: "Tahun Berdiri", value: "1969" },
      { label: "SK Operasional", value: "012/SME/Sw/1969" },
      { label: "Luas Tanah", value: "2.942 m²" },
    ],
    [],
  );

  // Lightweight SEO metadata
  useEffect(() => {
    try {
      document.title = "Profil — SMK Diponegoro 1 Jakarta";
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute(
        "content",
        "Profil SMK Diponegoro 1 Jakarta — identitas, legalitas, lokasi, dan kontak.",
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
      className="min-h-screen bg-gray-50 font-sans overflow-x-hidden"
    >
      {/* ==================== HEADER HERO ==================== */}
      <div className="relative h-[500px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          {/* Efek Zoom Out pada Gambar Background */}
          <div className="w-full h-full">
            <img
              src={gedungSekolah}
              alt="Gedung Sekolah"
              className="hero-bg-img w-full h-full object-cover opacity-0" // Mulai opacity 0 biar dihandle GSAP
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 pb-20">
          <div className="container mx-auto px-4 lg:px-8">
            <span className="hero-badge inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 mb-4 backdrop-blur-sm invisible">
              Identitas Satuan Pendidikan
            </span>
            <h1 className="hero-title text-4xl lg:text-6xl font-extrabold text-white mb-4 invisible">
              Profil Sekolah
            </h1>
            <p className="hero-desc text-gray-300 text-lg max-w-2xl invisible">
              Informasi lengkap mengenai identitas, legalitas, dan domisili SMK
              Diponegoro 1 Jakarta.
            </p>
          </div>
        </div>
      </div>

      {/* ==================== QUICK STATS CARDS ==================== */}
      <div className="stats-container container mx-auto px-4 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <Award size={28} />,
              label: "Akreditasi",
              value: 'Grade "A"',
              color: "bg-orange-50 text-primary",
              border: "border-primary",
            },
            {
              icon: <Building2 size={28} />,
              label: "Status",
              value: "Swasta",
              color: "bg-blue-50 text-blue-600",
              border: "border-blue-500",
            },
            {
              icon: <BookOpen size={28} />,
              label: "Kurikulum",
              value: "Merdeka",
              color: "bg-green-50 text-green-600",
              border: "border-green-500",
            },
            {
              icon: <Calendar size={28} />,
              label: "Berdiri Sejak",
              value: "1969",
              color: "bg-purple-50 text-purple-600",
              border: "border-purple-500",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`stat-card bg-white p-6 rounded-xl shadow-lg border-b-4 ${item.border} flex items-center gap-4 hover:-translate-y-2 transition-all duration-300 invisible`}
            >
              <div className={`p-3 ${item.color} rounded-full`}>
                {item.icon}
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">
                  {item.label}
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {item.value}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== DETAIL IDENTITAS & KONTAK ==================== */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* KOLOM KIRI: TABEL IDENTITAS */}
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                Data Identitas Sekolah
              </h2>

              <div className="identity-table bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {schoolIdentity.map((item, idx) => (
                        <tr
                          key={idx}
                          className="table-row border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors invisible"
                        >
                          <td className="p-4 w-1/3 font-medium text-gray-600 bg-gray-50/50">
                            {item.label}
                          </td>
                          <td className="p-4 font-bold text-gray-800">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Maps Embed */}
              <div className="maps-container mt-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 invisible">
                <h3 className="font-bold text-gray-800 mb-4">Lokasi Kami</h3>
                <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden relative">
                  {/* GANTI SRC IFRAME DENGAN GOOGLE MAPS SEKOLAH ANDA */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5167357971472!2d106.88056437364303!3d-6.195343493792326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f494abd0f51f%3A0x5937869a37919bef!2sSekolah%20Menengah%20Atas%20Diponegoro%201!5e0!3m2!1sid!2sid!4v1766921555440!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN: KONTAK & VISI */}
            <div className="sidebar-container w-full lg:w-1/3 space-y-8">
              {/* Kontak Info Card */}
              <div className="sidebar-item bg-primary/5 border border-primary/10 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 invisible">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Hubungi Kami
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: <MapPin size={20} />,
                      title: "Alamat",
                      desc: "JLN. SUNAN GIRI NO. 5, Rawamangun, Jakarta Timur",
                    },
                    {
                      icon: <Phone size={20} />,
                      title: "Telepon",
                      desc: "(021) 4702446",
                    },
                    {
                      icon: <Mail size={20} />,
                      title: "Email",
                      desc: "smk_dipo01@yahoo.com",
                    },
                    {
                      icon: <Globe size={20} />,
                      title: "Website",
                      desc: "www.smkdipo1jkt.sch.id",
                    },
                  ].map((contact, idx) => (
                    <div key={idx} className="flex items-start gap-4 group">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-primary shrink-0 group-hover:scale-110 transition-transform">
                        {contact.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {contact.title}
                        </p>
                        <p className="text-sm text-gray-600">{contact.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ringkasan Visi */}
              <div className="sidebar-item bg-gray-900 text-white rounded-2xl p-8 relative overflow-hidden shadow-xl group invisible">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                <h3 className="text-xl font-bold mb-4 z-10 relative">
                  Visi Sekolah
                </h3>
                <p className="text-gray-300 italic mb-6 leading-relaxed relative z-10">
                  “Melahirkan institusi pendidikan vokasi unggulan yang
                  melahirkan generasi profesional, adaptif, dan berdaya saing
                  global; berlandaskan Pancasila, menguasai teknologi
                  terbarukan, serta mampu berkarya dan menciptakan perubahan
                  positif dalam masyarakat."
                </p>
                <a
                  href="/tentang/visi-misi"
                  className="text-primary font-bold hover:text-orange-300 transition text-sm flex items-center gap-2 group/link"
                >
                  Lihat Misi Lengkap{" "}
                  <CheckCircle
                    size={16}
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profil;
