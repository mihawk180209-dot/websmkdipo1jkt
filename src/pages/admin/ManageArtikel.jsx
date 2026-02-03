import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Plus, Pencil, Trash2, FileX, Loader2, Calendar } from "lucide-react";

const ManageArtikel = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
      alert("Error ambil data: " + error.message);
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin hapus artikel ini selamanya?")) {
      const { error } = await supabase.from("articles").delete().eq("id", id);

      if (error) {
        alert("Gagal hapus!");
      } else {
        setArticles(articles.filter((item) => item.id !== id));
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Kelola Artikel
          </h2>
          <p className="text-slate-500 mt-1">
            Total <strong className="text-slate-800">{articles.length}</strong>{" "}
            artikel diterbitkan.
          </p>
        </div>
        <Link
          to="/admin/artikel/tambah"
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={20} /> Tambah Artikel
        </Link>
      </div>

      {/* Kontainer Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>Mengambil data...</p>
          </div>
        ) : articles.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <FileX size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Belum ada artikel
            </h3>
            <p className="text-slate-500 max-w-sm mt-2 mb-8 leading-relaxed">
              Mulai menulis artikel pertama Anda untuk mengisi konten website.
            </p>
            <Link
              to="/admin/artikel/tambah"
              className="text-teal-600 font-semibold hover:text-teal-700 hover:underline"
            >
              Buat artikel sekarang &rarr;
            </Link>
          </div>
        ) : (
          /* Tabel Data Responsive */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Judul & Tanggal
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-5 max-w-md">
                      <p className="font-bold text-slate-800 text-base line-clamp-1 mb-1 group-hover:text-teal-700 transition-colors">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar size={12} />
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                          item.category === "Berita"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : item.category === "Prestasi"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-purple-50 text-purple-700 border-purple-100"
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/artikel/edit/${item.id}`}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-teal-600 hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-red-600 hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageArtikel;
