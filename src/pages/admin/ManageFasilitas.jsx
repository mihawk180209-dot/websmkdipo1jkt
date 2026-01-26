import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Plus, Pencil, Trash2, Building, Loader2, Monitor } from "lucide-react";

const ManageFasilitas = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    // Ambil data dari tabel 'facilities'
    let { data, error } = await supabase
      .from("facilities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching facilities:", error);
      alert("Error ambil data: " + error.message);
    } else {
      setFacilities(data || []);
    }
    setLoading(false);
  };

  // --- HAPUS FASILITAS + FOTO ---
  const handleDelete = async (id, imageUrl) => {
    if (!confirm("Yakin hapus fasilitas ini?")) return;

    try {
      // 1. Hapus Foto dari Storage
      if (imageUrl && imageUrl.includes("/facility-images/")) {
        const filePath = imageUrl.split("/facility-images/")[1];
        if (filePath) {
          await supabase.storage.from("facility-images").remove([filePath]);
        }
      }

      // 2. Hapus Data dari DB
      const { error } = await supabase.from("facilities").delete().eq("id", id);

      if (error) throw error;

      // 3. Update State
      setFacilities(facilities.filter((item) => item.id !== id));
    } catch (error) {
      alert("Gagal hapus: " + error.message);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Kelola Fasilitas
          </h2>
          <p className="text-slate-500 mt-1">
            Total{" "}
            <strong className="text-slate-800">{facilities.length}</strong>{" "}
            fasilitas terdaftar.
          </p>
        </div>
        <Link
          to="/admin/fasilitas/tambah"
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={20} /> Tambah Fasilitas
        </Link>
      </div>

      {/* Kontainer Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>Mengambil data...</p>
          </div>
        ) : facilities.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <Building size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Belum ada fasilitas
            </h3>
            <p className="text-slate-500 max-w-sm mt-2 mb-8 leading-relaxed">
              Tambahkan sarana dan prasarana sekolah di sini.
            </p>
            <Link
              to="/admin/fasilitas/tambah"
              className="text-teal-600 font-semibold hover:text-teal-700 hover:underline"
            >
              Tambah data sekarang &rarr;
            </Link>
          </div>
        ) : (
          /* Tabel Data Responsive */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nama Fasilitas
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
                {facilities.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Monitor size={24} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-md">
                      <p className="font-bold text-slate-800 text-base mb-1 group-hover:text-teal-700 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-500 line-clamp-1">
                        {item.description}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/fasilitas/edit/${item.id}`}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-teal-600 hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.image_url)}
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

export default ManageFasilitas;
