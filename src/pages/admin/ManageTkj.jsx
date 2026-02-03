import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase"; // Sesuaikan path
import {
  Plus,
  Edit3,
  Trash2,
  Loader2,
  BookOpen,
  Layers,
  AlertCircle,
} from "lucide-react";

const ManageTkj = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from("tkj_curriculum")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus materi ini?")) return;

    try {
      const { error } = await supabase
        .from("tkj_curriculum")
        .delete()
        .eq("id", id);
      if (error) throw error;

      // Update state UI langsung agar tidak perlu fetch ulang
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Gagal menghapus data.");
    }
  };

  // Helper untuk warna badge kelas
  const getClassBadge = (level) => {
    const styles = {
      X: "bg-teal-100 text-teal-800 border-teal-200",
      XI: "bg-blue-100 text-blue-800 border-blue-200",
      XII: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return styles[level] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="text-teal-600" />
              Manajemen Kurikulum TKJ
            </h1>
            <p className="text-gray-500 mt-1">
              Kelola data materi pembelajaran jurusan.
            </p>
          </div>
          <Link
            to="/admin/tkj/form" // Sesuaikan route anda
            className="group flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-teal-700 hover:shadow-teal-500/30 transition-all transform hover:-translate-y-1"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            Tambah Materi Baru
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={40} className="animate-spin text-teal-600" />
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Belum ada data
            </h3>
            <p className="text-gray-500 mb-6">
              Silakan tambahkan materi kurikulum baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => {
              // Parsing topics handle
              let topics = [];
              try {
                topics =
                  typeof item.topics === "string"
                    ? JSON.parse(item.topics)
                    : item.topics;
              } catch (e) {
                topics = [];
              }

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getClassBadge(item.class_level)}`}
                      >
                        KELAS {item.class_level}
                      </span>
                      <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        Urutan: {item.display_order}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                      {item.title}
                    </h2>

                    <div className="mb-6 min-h-[60px]">
                      <p className="text-sm text-gray-500 mb-2 font-medium flex items-center gap-1">
                        <AlertCircle size={14} /> Topik Pembahasan:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {topics.slice(0, 3).map((t, i) => (
                          <span
                            key={i}
                            className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded border border-teal-100"
                          >
                            {t}
                          </span>
                        ))}
                        {topics.length > 3 && (
                          <span className="text-xs text-gray-400 px-1 py-1">
                            +{topics.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                      <Link
                        to={`/admin/tkj/form/${item.id}`} // Sesuaikan route edit
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition font-medium text-sm"
                      >
                        <Edit3 size={16} /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                      >
                        <Trash2 size={16} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTkj;
