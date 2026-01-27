import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, FileText, ImageOff } from "lucide-react";

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const Artikel = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const comp = useRef(null); // Ref untuk scope GSAP

  // --- FETCH DATA ---
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    let { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.log("Error:", error.message);
    else setArticles(data || []);

    setLoading(false);
  };

  // --- GSAP ANIMATION (Jalan setiap kali loading selesai) ---
  useLayoutEffect(() => {
    if (loading) return; // Jangan jalan kalau masih loading

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

      // 2. ARTICLE GRID ANIMATION (Staggered)
      // Kita gunakan requestAnimationFrame agar DOM benar-benar siap
      requestAnimationFrame(() => {
        gsap.fromTo(
          ".article-card",
          { y: 50, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.1, // Muncul berurutan dengan jeda 0.1s
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".articles-grid",
              start: "top 85%", // Trigger saat grid masuk viewport
            },
          },
        );

        // Animasi untuk Empty State (jika tidak ada artikel)
        if (articles.length === 0) {
          gsap.fromTo(
            ".empty-state",
            { scale: 0.9, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(1.7)" },
          );
        }
      });
    }, comp);

    return () => ctx.revert();
  }, [loading, articles]); // Re-run animasi saat loading selesai atau artikel berubah

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div ref={comp} className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* ==================== HEADER SECTION ==================== */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-16 px-4 mb-12">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="header-pill inline-block py-1 px-3 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-4 tracking-wide invisible">
            BLOG & INFORMASI
          </span>
          <h1 className="header-title text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight invisible">
            Artikel Terbaru
          </h1>
          <p className="header-desc text-gray-500 text-lg max-w-2xl mx-auto invisible">
            Dapatkan informasi terkini seputar kegiatan sekolah, prestasi siswa,
            dan perkembangan teknologi di SMK DIPO 1.
          </p>
        </div>
      </div>

      {/* ==================== CONTENT SECTION ==================== */}
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {loading ? (
          // SKELETON LOADING STATE
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm overflow-hidden h-96 animate-pulse border border-gray-100"
              >
                <div className="h-48 bg-gray-200 w-full"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // ARTICLE GRID
          <div className="articles-grid grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.length === 0 ? (
              // EMPTY STATE
              <div className="empty-state col-span-full py-20 text-center invisible">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <FileText size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Belum ada artikel
                </h3>
                <p className="text-gray-500 mt-2">
                  Nantikan update terbaru dari kami segera.
                </p>
              </div>
            ) : (
              articles.map((item) => (
                <div
                  key={item.id}
                  className="article-card group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full invisible"
                >
                  {/* Gambar Container */}
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    {item.image_url ? (
                      <>
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
                        <ImageOff size={32} className="mb-2 opacity-50" />
                        <span className="text-sm">Tidak ada gambar</span>
                      </div>
                    )}

                    {/* Badge Kategori */}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                      {item.category || "Umum"}
                    </span>
                  </div>

                  {/* Konten */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Tanggal */}
                    <div className="flex items-center text-xs text-gray-500 mb-3 gap-2">
                      <Calendar size={14} className="text-orange-500" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>

                    <h3 className="font-bold text-xl text-gray-900 mb-3 leading-snug group-hover:text-black-600 transition-colors line-clamp-2">
                      <Link to={`/artikel/${item.id}`}>{item.title}</Link>
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                      {item.content}
                    </p>

                    <Link
                      to={`/artikel/${item.id}`}
                      className="inline-flex items-center gap-2 text-orange-600 font-bold text-sm hover:text-orange-700 transition-colors group/link mt-auto"
                    >
                      Baca Selengkapnya
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Artikel;
