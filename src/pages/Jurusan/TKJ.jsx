import { useEffect, useRef, useMemo, useState } from "react";
import {
  Server,
  Shield,
  Cpu,
  Wifi,
  CheckCircle,
  Briefcase,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

// --- SUPABASE IMPORT ---
// Sesuaikan path ini dengan file config supabase project anda
import { supabase } from "../../lib/supabase";

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import tkjfoto from "../../assets/tkjfoto.webp";
import tkj from "../../assets/exp.avif";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const TKJ = () => {
  const comp = useRef(null);
  const idleCtxRef = useRef(null);
  const idleHandleRef = useRef(null);

  // State untuk data dinamis
  const [curriculumData, setCurriculumData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const techIcons = useMemo(
    () => [
      { icon: <Server size={20} />, label: "Server Admin" },
      { icon: <Wifi size={20} />, label: "Fiber Optic" },
      { icon: <Shield size={20} />, label: "Cyber Security" },
      { icon: <Cpu size={20} />, label: "IoT System" },
    ],
    [],
  );

  const jobs = useMemo(
    () => [
      {
        title: "Network Engineer",
        desc: "Merancang dan mengelola jaringan komputer perusahaan.",
      },
      {
        title: "System Administrator",
        desc: "Mengelola server, user, dan keamanan sistem.",
      },
      {
        title: "IT Support / Helpdesk",
        desc: "Menangani troubleshooting hardware dan software user.",
      },
      {
        title: "CCTV & Security Tech",
        desc: "Instalasi dan maintenance sistem keamanan digital.",
      },
      {
        title: "Fiber Optic Technician",
        desc: "Instalasi jaringan kabel fiber optik untuk ISP.",
      },
      {
        title: "IT Entrepreneur",
        desc: "Membuka jasa servis komputer, RT/RW Net, atau Web Hosting.",
      },
    ],
    [],
  );

  // --- FETCH DATA SUPABASE ---
  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const { data, error } = await supabase
          .from("tkj_curriculum") // Pastikan nama tabel sama dengan di SQL
          .select("*")
          .order("display_order", { ascending: true });

        if (error) throw error;

        if (data) {
          setCurriculumData(data);
        }
      } catch (error) {
        console.error("Error fetching curriculum:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurriculum();
  }, []);

  // --- SEO EFFECT ---
  useEffect(() => {
    try {
      if (typeof document !== "undefined") {
        document.title = "TKJ — Teknik Komputer & Jaringan | SMK Diponegoro 1";
        // ... (kode meta description tetap sama)
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

  // --- GSAP ANIMATION EFFECT ---
  // Kita tambahkan dependency [curriculumData, isLoading] agar GSAP
  // me-refresh animasi kurikulum setelah data ter-load.
  useEffect(() => {
    // Jika masih loading, jangan jalankan GSAP dulu untuk bagian dinamis
    if (isLoading) return;

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
        // 1. HERO ANIMATION (Tetap sama)
        const tlHero = gsap.timeline();
        tlHero.fromTo(
          ".hero-bg-img",
          { scale: 1.1, autoAlpha: 0 },
          { scale: 1, autoAlpha: 0.2, duration: 2, ease: "power2.out" },
        );
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

        // Overview reveals (Tetap sama)
        gsap.fromTo(
          ".overview-img",
          { x: -50, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".overview-section", start: "top 80%" },
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
            scrollTrigger: { trigger: ".overview-section", start: "top 80%" },
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
            scrollTrigger: { trigger: ".overview-section", start: "top 80%" },
          },
        );
        gsap.fromTo(
          ".tech-icon",
          { scale: 0.8, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.5)",
            scrollTrigger: { trigger: ".tech-icons-grid", start: "top 85%" },
          },
        );

        // Curriculum Header
        gsap.fromTo(
          ".curriculum-header",
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            scrollTrigger: { trigger: ".curriculum-section", start: "top 80%" },
          },
        );

        // --- DINAMIS: Curriculum Cards ---
        // GSAP akan mendeteksi .curriculum-card yang sudah di-render oleh React map()
        if (curriculumData.length > 0) {
          gsap.fromTo(
            ".curriculum-card",
            { y: 60, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".curriculum-grid",
                start: "top 85%",
              },
            },
          );
        }

        // Career & CTA (Tetap sama)
        gsap.fromTo(
          ".career-title",
          { x: -30, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.8,
            scrollTrigger: { trigger: ".career-section", start: "top 80%" },
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
            scrollTrigger: { trigger: ".jobs-grid", start: "top 85%" },
          },
        );
        gsap.fromTo(
          ".cta-content",
          { scale: 0.9, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: "back.out(1.2)",
            scrollTrigger: { trigger: ".cta-section", start: "top 85%" },
          },
        );
      }, comp);

      // Idle: schedule repeating tweens (Tetap sama)
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
            // ... (Animasi floating icon lainnya tetap sama, disingkat agar rapi)
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
  }, [isLoading, curriculumData]); // Re-run GSAP kalau data sudah berubah/selesai load

  // Helper function untuk warna background card berdasarkan kelas (agar UI tetap konsisten)
  const getCardStyle = (level) => {
    switch (level) {
      case "X":
        return {
          border: "border-teal-400",
          bgIcon: "bg-teal-50",
          textIcon: "text-teal-600",
        };
      case "XI":
        return {
          border: "border-teal-600",
          bgIcon: "bg-teal-100",
          textIcon: "text-teal-700",
        };
      case "XII":
        return {
          border: "border-teal-800",
          bgIcon: "bg-teal-200",
          textIcon: "text-teal-900",
        };
      default:
        return {
          border: "border-teal-400",
          bgIcon: "bg-teal-50",
          textIcon: "text-teal-600",
        };
    }
  };

  return (
    <div
      ref={comp}
      className="min-h-screen bg-white font-sans overflow-x-hidden"
    >
      {/* ... HERO SECTION & OVERVIEW SECTION (CODE TETAP SAMA, TIDAK ADA PERUBAHAN) ... */}

      {/* ==================== HERO SECTION (Copy paste code lama) ==================== */}
      <div className="relative bg-gray-900 py-24 lg:py-32 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full">
            <img
              src={tkjfoto}
              alt="Server Room"
              className="hero-bg-img w-full h-full object-cover opacity-0"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="hero-pill inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-6 backdrop-blur-sm invisible">
            <Cpu size={16} />
            <span className="text-sm font-bold tracking-wider">
              TEKNOLOGI INFORMASI
            </span>
          </div>
          <h1 className="hero-title text-4xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight invisible">
            Teknik Komputer <span className="text-teal-400">&</span> Jaringan
          </h1>
          <p className="hero-desc text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed invisible">
            Kuasai dunia infrastruktur digital mulai dari perakitan, instalasi
            jaringan fiber optik, administrasi server cloud, hingga keamanan
            siber.
          </p>
        </div>
      </div>

      {/* ==================== OVERVIEW SECTION (Copy paste code lama) ==================== */}
      <section className="overview-section py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image */}
            <div className="overview-img w-full lg:w-1/2 invisible">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white group">
                <img
                  src={tkj}
                  alt="Siswa TKJ Praktek"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="floating-badge absolute bottom-6 right-6 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border-l-4 border-teal-600 max-w-xs invisible">
                  <p className="text-sm font-bold text-gray-800">
                    "Praktek Langsung dengan Perangkat Standar Industri"
                  </p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="overview-text w-full lg:w-1/2 invisible">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Apa itu Jurusan TKJ?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Teknik Komputer dan Jaringan (TKJ) adalah kompetensi keahlian
                yang mempelajari cara merakit komputer, instalasi sistem
                operasi, hingga merancang dan mengelola jaringan komputer baik
                skala lokal (LAN) maupun luas (WAN).
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Di SMK Dipo 1, kurikulum TKJ diperkaya dengan materi kekinian
                seperti{" "}
                <strong>
                  Mikrotik, Cisco, Virtualisasi (Proxmox), dan Cloud Computing
                </strong>{" "}
                untuk menjawab tantangan Revolusi Industri 4.0.
              </p>

              <div className="tech-icons-grid grid grid-cols-2 gap-4">
                {techIcons.map((item, idx) => (
                  <div
                    key={idx}
                    className="tech-icon flex items-center gap-3 invisible"
                  >
                    <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                      {item.icon}
                    </div>
                    <span className="font-medium text-gray-700">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MATERI / KURIKULUM (UPDATED DYNAMIC) ==================== */}
      <section className="curriculum-section py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="curriculum-header text-center mb-16 invisible">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Materi Keahlian
            </h2>
            <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">
              Tahapan pembelajaran berjenjang dari dasar hingga mahir
            </p>
          </div>

          <div className="curriculum-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              // Optional: Loading Skeleton jika internet lambat
              <div className="col-span-3 text-center text-gray-400">
                Memuat materi...
              </div>
            ) : (
              // Render Dinamis dari State Supabase
              curriculumData.map((item, index) => {
                const style = getCardStyle(item.class_level);
                // Parse topics jika string JSON, atau gunakan langsung jika object
                // Supabase biasanya mengembalikan JSONB sebagai object/array JS langsung
                const topicsArray =
                  typeof item.topics === "string"
                    ? JSON.parse(item.topics)
                    : item.topics;

                return (
                  <div
                    key={item.id || index}
                    className={`curriculum-card bg-white p-8 rounded-2xl shadow-sm border-t-4 ${style.border} hover:shadow-xl transition-all ${item.class_level === "XI" ? "md:-translate-y-4 hover:-translate-y-6" : "hover:-translate-y-2"} duration-300 invisible`}
                  >
                    <div
                      className={`w-12 h-12 ${style.bgIcon} ${style.textIcon} rounded-xl flex items-center justify-center mb-6`}
                    >
                      <span className="font-bold text-xl">
                        {item.class_level}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {item.title}
                    </h3>
                    <ul className="space-y-3">
                      {topicsArray.map((topic, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-gray-600 text-sm"
                        >
                          <CheckCircle
                            size={16}
                            className="text-teal-500 mt-0.5 min-w-[16px]"
                          />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ... PROSPEK KERJA & CTA FOOTER (CODE TETAP SAMA) ... */}

      {/* ==================== PROSPEK KERJA (Copy paste code lama) ==================== */}
      <section className="career-section py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="career-title w-full md:w-1/3 invisible">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Prospek Karir
              </h2>
              <p className="text-gray-600 mb-6">
                Lulusan TKJ memiliki peluang kerja yang sangat luas di berbagai
                sektor industri, instansi pemerintah, maupun sebagai wirausaha
                mandiri.
              </p>
              <a
                href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/"
                target="_blank"
                rel="noopener noferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition shadow-lg hover:shadow-teal-200"
              >
                Daftar Jurusan Ini <ArrowRight size={18} />
              </a>
            </div>

            <div className="jobs-grid w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {jobs.map((job, idx) => (
                <div
                  key={idx}
                  className="job-card flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition-colors group invisible"
                >
                  <div className="mt-1 text-teal-600 group-hover:scale-110 transition-transform">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
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

      {/* ==================== CTA FOOTER (Copy paste code lama) ==================== */}
      <section className="cta-section py-16 bg-teal-700">
        <div className="container mx-auto px-4 text-center">
          <div className="cta-content invisible">
            <BookOpen size={48} className="mx-auto text-teal-200 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Siap Menjadi Ahli IT Masa Depan?
            </h2>
            <p className="text-teal-100 mb-8 max-w-xl mx-auto">
              Bergabunglah dengan jurusan TKJ SMK Diponegoro 1 Jakarta dan mulai
              bangun karirmu di dunia teknologi.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/"
                target="_blank"
                rel="noopener noferrer"
                className="px-8 py-3 bg-white text-teal-700 font-bold rounded-full hover:bg-gray-100 transition shadow-lg"
              >
                Daftar Sekarang
              </a>
              <Link
                to="/jurusan"
                className="px-8 py-3 border border-white text-white font-bold rounded-full hover:bg-teal-800 transition"
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

export default TKJ;
