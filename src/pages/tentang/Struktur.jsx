import React, { useEffect, useRef, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Sparkles, ChevronDown, Loader2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "../../lib/supabase";
// Register Plugin
gsap.registerPlugin(ScrollTrigger);

// --- KOMPONEN KARTU ---
const OrgCard = React.memo(({ data, isMain = false }) => {
  // Fallback image jika tidak ada foto
  const defaultImg =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(data?.name || "User") +
    "&background=random";

  return (
    <div
      className={`anim-card flex flex-col items-center bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 relative z-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-orange-500/10 hover:border-orange-200 w-full max-w-[260px] md:w-72 mx-auto cursor-default group opacity-0 ${
        isMain
          ? "ring-4 ring-orange-50 border-orange-200"
          : "border-t-4 border-t-orange-500"
      }`}
    >
      {/* Image Container */}
      <div className="w-24 h-24 mb-4 rounded-full p-1.5 border-2 border-dashed border-orange-300 group-hover:border-orange-500 transition-colors">
        <img
          src={data?.image_url || defaultImg}
          alt={data?.name}
          className="w-full h-full rounded-full object-cover shadow-sm"
          loading={isMain ? "eager" : "lazy"}
        />
      </div>

      {/* Content */}
      <div className="text-center">
        <h4 className="text-slate-900 font-bold text-lg leading-tight mb-1 group-hover:text-orange-600 transition-colors">
          {data?.role}
        </h4>
        <p className="text-slate-500 text-sm font-medium line-clamp-2">
          {data?.name}
        </p>
      </div>

      {/* Decorative Badge for Main */}
      {isMain && (
        <div className="absolute -top-3 px-3 py-1 bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
          Pimpinan
        </div>
      )}
    </div>
  );
});

// --- KOMPONEN GARIS VERTIKAL ---
const VLine = ({ height = "h-8 md:h-12", className = "" }) => (
  <div
    className={`anim-line w-0.5 bg-slate-300 ${height} mx-auto ${className}`}
  ></div>
);

const Struktur = () => {
  const comp = useRef(null);
  // State untuk data dinamis
  const [structData, setStructData] = useState({
    kepsek: null,
    ktu: null,
    waka: [],
    kaprog: [],
    pembina: [],
  });
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA DARI SUPABASE ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil semua data diurutkan berdasarkan sort_order
        const { data, error } = await supabase
          .from("organization_structure")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) throw error;

        if (data) {
          // Mapping data flat dari SQL ke struktur object frontend
          const mappedData = {
            kepsek: data.find((item) => item.category === "kepsek"),
            ktu: data.find((item) => item.category === "ktu"),
            waka: data.filter((item) => item.category === "waka"),
            kaprog: data.filter((item) => item.category === "kaprog"),
            pembina: data.filter((item) => item.category === "pembina"),
          };
          setStructData(mappedData);
        }
      } catch (err) {
        console.error("Error fetching struct data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- GSAP ANIMATION ---
  // Kita jalankan GSAP hanya setelah loading selesai dan data sudah ter-render
  useEffect(() => {
    if (loading) return; // Jangan animasi kalau masih loading

    let ctx = gsap.context(() => {
      ScrollTrigger.refresh();

      // Header reveal
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

      // Connector lines and cards
      // Note: Kita kasih sedikit delay agar DOM benar-benar siap
      gsap.fromTo(
        ".anim-line, .anim-connector",
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".chart-container",
            start: "top 90%",
          },
        },
      );

      gsap.fromTo(
        ".anim-card",
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".chart-container",
            start: "top 90%",
          },
        },
      );

      gsap.fromTo(
        ".anim-footer",
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".footer-cta",
            start: "top 95%",
          },
        },
      );
    }, comp);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loading]); // Dependency loading: Animasi jalan ulang saat loading selesai

  // --- MEMOIZED RENDERS ---
  const renderedWaka = useMemo(
    () =>
      structData.waka.map((person, idx) => (
        <div
          key={person.id || idx}
          className="flex flex-col items-center relative w-full"
        >
          <div className="anim-line hidden md:block h-8 w-0.5 bg-slate-300 absolute -top-8"></div>
          {idx > 0 && (
            <div className="anim-line md:hidden h-8 w-0.5 bg-slate-300 -mt-8 mb-0 mx-auto"></div>
          )}
          <OrgCard data={person} />
        </div>
      )),
    [structData.waka],
  );

  const renderedKaprog = useMemo(
    () =>
      structData.kaprog.map((person, idx) => (
        <div
          key={person.id || idx}
          className="flex flex-col items-center relative w-full"
        >
          <div className="anim-line hidden md:block h-16 w-0.5 bg-slate-300 absolute -top-16"></div>
          {idx > 0 && (
            <div className="anim-line md:hidden h-8 w-0.5 bg-slate-300 -mt-8 mb-0 mx-auto"></div>
          )}
          <OrgCard data={person} />
        </div>
      )),
    [structData.kaprog],
  );

  const renderedPembina = useMemo(
    () =>
      structData.pembina.map((person, idx) => (
        <div
          key={person.id || idx}
          className="flex flex-col items-center relative w-full"
        >
          <div className="anim-line hidden md:block h-16 w-0.5 bg-slate-300 absolute -top-16"></div>
          <OrgCard data={person} />
        </div>
      )),
    [structData.pembina],
  );

  // SEO Metadata
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Struktur Organisasi — SMK Diponegoro 1 Jakarta";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={comp}
      className="min-h-screen bg-[#F8FAFC] pb-24 font-sans overflow-x-hidden"
    >
      {/* ==================== HEADER SECTION ==================== */}
      <div className="bg-white py-16 lg:py-20 border-b border-slate-100 text-center relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="anim-header inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-6 opacity-0">
            <Sparkles size={16} /> Organisasi Sekolah
          </div>
          <h1 className="anim-header text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight opacity-0">
            Struktur{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Organisasi
            </span>
          </h1>
          <p className="anim-header text-slate-500 text-lg max-w-2xl mx-auto opacity-0">
            Bagan fungsional dan hierarki kepemimpinan di SMK Diponegoro 1
            Jakarta.
          </p>
        </div>
      </div>

      {/* ==================== CHART CONTAINER ==================== */}
      <div className="chart-container container mx-auto px-4 mt-16 md:mt-20">
        <div className="flex flex-col items-center w-full">
          {/* LEVEL 1: KEPSEK */}
          {structData.kepsek && (
            <>
              <OrgCard data={structData.kepsek} isMain={true} />
              <VLine />
            </>
          )}

          {/* LEVEL 2: KEPALA TU */}
          {structData.ktu && (
            <>
              <OrgCard data={structData.ktu} />
              <VLine />
            </>
          )}

          {/* LEVEL 3: WAKASEK */}
          {structData.waka.length > 0 && (
            <div className="w-full flex flex-col items-center relative">
              <div className="anim-connector hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 w-[50%] h-12 border-t-2 border-x-2 border-slate-300 rounded-t-3xl"></div>
              <div className="grid grid-cols-1 md:flex md:justify-center md:gap-16 w-full max-w-lg md:max-w-none gap-8 relative">
                {renderedWaka}
              </div>
            </div>
          )}

          {/* CONNECTOR TO NEXT LEVEL */}
          {/* Render VLine hanya jika ada data Waka dan data Kaprog untuk menghubungkannya */}
          {structData.waka.length > 0 && structData.kaprog.length > 0 && (
            <VLine height="h-8 md:h-16 md:-mt-8" className="z-0 relative" />
          )}

          {/* LEVEL 4: KAPROG & HUBIN */}
          {structData.kaprog.length > 0 && (
            <div className="w-full flex flex-col items-center relative">
              <div className="anim-connector hidden md:block absolute -top-16 left-1/2 -translate-x-1/2 w-[70%] h-16 border-t-2 border-x-2 border-slate-300 rounded-t-3xl"></div>
              <div className="grid grid-cols-1 md:flex md:justify-center md:gap-8 w-full max-w-lg md:max-w-none gap-8 relative">
                {renderedKaprog}
              </div>
            </div>
          )}

          {structData.kaprog.length > 0 && structData.pembina.length > 0 && (
            <VLine height="h-8 md:h-16 md:-mt-8" className="z-0 relative" />
          )}

          {/* LEVEL 5: PEMBINA OSIS */}
          {structData.pembina.length > 0 && (
            <div className="w-full flex flex-col items-center relative">
              <div className="anim-connector hidden md:block absolute -top-16 left-1/2 -translate-x-1/2 w-[80%] h-16 border-t-2 border-x-2 border-slate-300 rounded-t-3xl"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:justify-center md:gap-6 w-full max-w-lg md:max-w-none gap-8 relative">
                {renderedPembina}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== FOOTER CTA SECTION ==================== */}
      <div className="footer-cta container mx-auto px-4 mt-24 max-w-4xl text-center">
        <div className="anim-footer bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 md:p-14 shadow-2xl text-white relative overflow-hidden group opacity-0">
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/10">
              <Users size={32} className="text-orange-400" />
            </div>

            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Guru & Tenaga Kependidikan
            </h2>
            <p className="mb-8 text-slate-300 text-base md:text-lg max-w-xl mx-auto">
              Kenali lebih dekat sosok-sosok inspiratif di balik keberhasilan
              siswa-siswi SMK Diponegoro 1 Jakarta.
            </p>

            <Link
              to="/tentang/guru"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-900/50 hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300"
            >
              Lihat Daftar Lengkap{" "}
              <ChevronDown className="-rotate-90" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Struktur;
