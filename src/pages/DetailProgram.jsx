import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  ArrowLeft,
  Calendar,
  Share2,
  Check, // Tambahin icon Check buat feedback
  CheckCircle2,
  Loader2,
  User,
} from "lucide-react";

const DetailProgram = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  // State untuk status copy link
  const [isCopied, setIsCopied] = useState(false);
  const mounted = useRef(true);
  const copyTimeout = useRef(null);

  useEffect(() => {
    const getDetail = async () => {
      try {
        const { data, error } = await supabase
          .from("program_unggulan")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (mounted.current) setProgram(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    getDetail();
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, [id]);

  // --- FUNGSI SHARE LINK ---
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (!mounted.current) return;
      setIsCopied(true);
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => {
        if (mounted.current) setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Gagal copy link:", err);
      try {
        // fallback: prompt with URL
        window.prompt("Copy link:", window.location.href);
      } catch (e) {
        /* ignore */
      }
    }
  }, []);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p>Memuat detail program...</p>
      </div>
    );

  if (!program)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800">
          Program Tidak Ditemukan
        </h2>
        <Link
          to="/tentang/program-unggulan"
          className="mt-4 text-orange-500 hover:underline"
        >
          Kembali ke daftar
        </Link>
      </div>
    );

  // Memoized values
  const formattedDate = useMemo(() => {
    try {
      return new Date(program.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "";
    }
  }, [program.created_at]);

  const benefits = useMemo(() => program.benefits || [], [program.benefits]);

  // Lightweight metadata injection
  useEffect(() => {
    try {
      if (typeof document !== "undefined" && program) {
        document.title = `${program.title} — Program Unggulan | SMK Diponegoro 1`;
        const md = document.querySelector('meta[name="description"]');
        const desc = (program.content || "").slice(0, 155);
        if (md) md.setAttribute("content", desc);
        else {
          const m = document.createElement("meta");
          m.name = "description";
          m.content = desc;
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
      /* ignore */
    }
  }, [program]);

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 1. HEADER SECTION */}
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <Link
            to="/tentang/program-unggulan"
            className="inline-flex items-center text-slate-500 hover:text-orange-600 transition-colors mb-6 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" /> Kembali ke Daftar Program
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {program.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 text-sm md:text-base border-b border-slate-100 pb-8 mb-8">
            <span className="flex items-center gap-2">
              <Calendar size={18} className="text-orange-500" />
              {formattedDate}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-2">
              <User size={18} className="text-orange-500" />
              Admin Sekolah
            </span>
          </div>
        </div>

        {/* 2. FEATURED IMAGE */}
        <div className="w-full mb-12 flex justify-center">
          <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-slate-50">
            <img
              src={program.image_url}
              alt={program.title}
              className="w-full h-auto max-h-[500px] object-contain mx-auto"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
          </div>
        </div>

        {/* 3. CONTENT & SIDEBAR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* KOLOM KIRI: ARTIKEL UTAMA */}
          <div className="lg:col-span-2">
            <article className="prose prose-lg prose-slate max-w-none text-slate-600">
              <p className="whitespace-pre-line leading-relaxed text-lg">
                {program.content}
              </p>
            </article>

            {/* Share Section (SUDAH AKTIF) */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-800">
                Bagikan Program Ini:
              </span>
              <button
                onClick={handleShare}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm border transition-all duration-300 ${
                  isCopied
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                }`}
              >
                {isCopied ? <Check size={18} /> : <Share2 size={18} />}
                {isCopied ? "Link Tersalin!" : "Share Link"}
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: SIDEBAR (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              {/* Kotak 1: Highlights / Benefits Dinamis */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                  Benefit Program
                </h3>

                {/* LOGIC RENDER BENEFIT */}
                <ul className="space-y-4">
                  {benefits && benefits.length > 0 ? (
                    benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2
                          size={20}
                          className="text-orange-500 mt-1 shrink-0"
                        />
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 italic text-sm">
                      Belum ada detail benefit untuk program ini.
                    </li>
                  )}
                </ul>
              </div>

              {/* Kotak 2: CTA Pendaftaran */}
              <div className="bg-slate-900 rounded-3xl p-8 text-center relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <h3 className="text-white font-bold text-xl mb-2 relative z-10">
                  Tertarik Bergabung?
                </h3>
                <p className="text-slate-400 text-sm mb-6 relative z-10 leading-relaxed">
                  Jangan lewatkan kesempatan untuk menjadi ahli di bidang ini
                  bersama SMK Dipo 1.
                </p>
                <a
                  href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/home"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-1 relative z-10"
                >
                  Daftar Sekarang
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProgram;
