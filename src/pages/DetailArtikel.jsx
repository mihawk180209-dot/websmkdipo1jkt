import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";

const DetailArtikel = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    mounted.current = true;

    const fetchSingleArticle = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (!mounted.current) return;

      if (error) {
        console.error(error);
        setArticle(null);
      } else {
        setArticle(data);
      }
      setLoading(false);
    };

    fetchSingleArticle();

    return () => {
      mounted.current = false;
    };
  }, [id]);

  /* =========================
     MEMOIZED DATA
  ========================= */
  const formattedDate = useMemo(() => {
    if (!article?.created_at) return "";
    try {
      return new Date(article.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }, [article?.created_at]);

  const paragraphs = useMemo(() => {
    return article?.content
      ? article.content.split("\n").filter((p) => p.trim())
      : [];
  }, [article?.content]);

  /* =========================
     SEO META (LIGHTWEIGHT)
  ========================= */
  useEffect(() => {
    if (!article) return;

    try {
      document.title = `${article.title} — SMK Diponegoro 1`;

      const desc = (paragraphs[0] || "").slice(0, 155);

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", desc);

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = window.location.href;
    } catch {
      /* ignore */
    }
  }, [article, paragraphs]);

  /* =========================
     EARLY RETURNS
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Artikel Tidak Ditemukan
        </h2>
        <Link to="/artikel" className="text-orange-600 hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link
            to="/artikel"
            className="flex items-center gap-2 text-gray-500 hover:text-orange-700 transition font-medium"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Kembali ke Daftar Artikel</span>
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Meta */}
        <header className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-bold uppercase flex items-center gap-1">
              <Tag size={14} /> {article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
            {article.title}
          </h1>

          <div className="flex justify-center gap-6 text-sm text-gray-500 border-y py-4 max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <Calendar size={16} /> {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} /> 5 min read
            </div>
          </div>
        </header>

        {/* Image */}
        {article.image_url && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full max-h-[450px] object-cover"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </div>
        )}

        {/* Content */}
        <main className="prose prose-lg mx-auto">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </main>
      </article>

      {/* Footer */}
      <div className="bg-gray-50 py-12 border-t mt-12 text-center">
        <h3 className="text-xl font-bold mb-4">Suka artikel ini?</h3>
        <Link to="/artikel">
          <button className="px-6 py-3 border rounded-full hover:text-orange-600 hover:border-orange-600 transition">
            Baca Artikel Lainnya
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DetailArtikel;
