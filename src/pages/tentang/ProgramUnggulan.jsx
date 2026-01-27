import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ArrowRight, Calendar, Loader2, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const ProgramUnggulan = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ref untuk scoping animasi
  const containerRef = useRef(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from("program_unggulan")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrograms(data);
    } catch (error) {
      console.error("Error fetching programs:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- GSAP ANIMATION SETUP ---
  useLayoutEffect(() => {
    if (loading) return; // Tunggu data ready

    // Context cleaning otomatis
    let ctx = gsap.context(() => {
      // 1. Animasi Header (Judul, Badge, Deskripsi)
      gsap.from(".anim-header", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".header-container",
          start: "top 85%",
        },
      });

      // 2. Animasi Kartu Muncul (Staggered)
      gsap.from(".anim-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15, // Jeda antar kartu
        ease: "back.out(1.2)", // Efek membal sedikit
        scrollTrigger: {
          trigger: ".cards-grid",
          start: "top 80%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  // --- INTERAKSI HOVER (PENGGANTI CSS) ---
  const handleMouseEnter = (e) => {
    const card = e.currentTarget;
    const img = card.querySelector(".anim-img");
    const overlay = card.querySelector(".anim-overlay");
    const title = card.querySelector(".anim-title");
    const btn = card.querySelector(".anim-btn");
    const arrow = card.querySelector(".anim-arrow");

    // 1. Card Lift & Shadow
    gsap.to(card, {
      y: -10,
      boxShadow: "0 20px 30px -10px rgba(249, 115, 22, 0.15)", // Orange shadow halus
      duration: 0.4,
      ease: "power2.out",
    });

    // 2. Image Zoom
    gsap.to(img, {
      scale: 1.1,
      duration: 0.6,
      ease: "power2.out",
    });

    // 3. Overlay Darken (biar teks makin jelas)
    gsap.to(overlay, {
      opacity: 0.4, // dari 0.6 ke 0.4 (lebih terang dikit atau gelap sesuai selera)
      duration: 0.4,
    });

    // 4. Title Color
    gsap.to(title, {
      color: "#ea580c", // orange-600
      duration: 0.3,
    });

    // 5. Button Fill
    gsap.to(btn, {
      backgroundColor: "#f97316", // orange-500
      color: "#ffffff",
      duration: 0.3,
    });

    // 6. Arrow Move
    gsap.to(arrow, {
      x: 5,
      duration: 0.3,
      ease: "back.out(2)",
    });
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    const img = card.querySelector(".anim-img");
    const overlay = card.querySelector(".anim-overlay");
    const title = card.querySelector(".anim-title");
    const btn = card.querySelector(".anim-btn");
    const arrow = card.querySelector(".anim-arrow");

    // Reset ke kondisi awal
    gsap.to(card, {
      y: 0,
      boxShadow: "none",
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
    gsap.to(overlay, { opacity: 0.6, duration: 0.4 });
    gsap.to(title, { color: "#0f172a", duration: 0.3 }); // slate-900
    gsap.to(btn, {
      backgroundColor: "#f8fafc",
      color: "#334155",
      duration: 0.3,
    }); // slate-50 text-slate-700
    gsap.to(arrow, { x: 0, duration: 0.3 });
  };

  return (
    <section ref={containerRef} className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="header-container text-center mb-16 relative">
          <div className="anim-header absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-orange-200 rounded-full blur-3xl opacity-50"></div>

          <div className="anim-header inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-4">
            <Sparkles size={16} /> SMK Diponegoro 1 Jakarta
          </div>

          <h2 className="anim-header text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Program{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Unggulan
            </span>
          </h2>

          <p className="anim-header text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Menyiapkan talenta digital masa depan dengan kurikulum berbasis
            industri dan teknologi terkini.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-medium">Memuat program terbaik...</p>
          </div>
        ) : (
          /* Grid Card Modern */
          <div className="cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div
                key={program.id}
                // HAPUS class hover/transition bawaan CSS, ganti dengan logic JS
                className="anim-card bg-white rounded-3xl overflow-hidden border border-slate-100 flex flex-col h-full cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Image Wrapper */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={program.image_url || "https://placehold.co/600x400"}
                    alt={program.title}
                    className="anim-img w-full h-full object-cover" // Hapus transition CSS
                  />
                  <div className="anim-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Badge Floating */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-orange-600 text-xs font-bold rounded-lg shadow-sm">
                      Program Unggulan
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-3">
                    <Calendar size={14} />
                    {new Date(program.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <h3 className="anim-title text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                    {program.title}
                  </h3>

                  <p className="text-slate-500 mb-6 text-sm leading-relaxed line-clamp-3 flex-grow">
                    {program.excerpt}
                  </p>

                  <Link
                    to={`/program/${program.id}`}
                    // Hapus hover CSS di sini
                    className="anim-btn inline-flex items-center justify-between w-full px-5 py-3 bg-slate-50 text-slate-700 font-semibold rounded-xl"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight
                      size={18}
                      className="anim-arrow" // Hapus transform CSS
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgramUnggulan;
