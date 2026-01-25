import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";

const DetailArtikel = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSingleArticle();
  }, [id]);

  const fetchSingleArticle = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
    } else {
      setArticle(data);
    }
    setLoading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );

  if (!article)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Artikel Tidak Ditemukan
        </h2>
        <Link to="/artikel" className="text-teal-600 hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar/Header Sederhana */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link
            to="/artikel"
            className="flex items-center gap-2 text-gray-500 hover:text-teal-600 transition font-medium"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Kembali ke Daftar Artikel</span>
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Meta Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase flex items-center gap-1">
              <Tag size={14} /> {article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-center text-gray-500 text-sm gap-6 border-y border-gray-100 py-4 max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                {new Date(article.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>5 min read</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.image_url && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-lg prose-teal mx-auto text-gray-700 leading-loose">
          {/* Menggunakan white-space-pre-wrap untuk menjaga paragraf */}
          {article.content.split("\n").map(
            (paragraph, idx) =>
              paragraph.trim() !== "" && (
                <p key={idx} className="mb-6 text-lg">
                  {paragraph}
                </p>
              )
          )}
        </div>
      </article>

      {/* Footer Read More */}
      <div className="bg-gray-50 py-12 border-t border-gray-100 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Suka artikel ini?
          </h3>
          <Link to="/artikel">
            <button className="px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-700 font-semibold hover:border-teal-600 hover:text-teal-600 transition shadow-sm">
              Baca Artikel Lainnya
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailArtikel;
