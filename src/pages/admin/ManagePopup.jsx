import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase"; // Sesuaikan path ini
import {
  Plus,
  Pencil,
  Trash2,
  Layers,
  Loader2,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";

const ManagePopup = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from("promotions")
      .select("*")
      .order("is_active", { ascending: false }) // Yang aktif di atas
      .order("priority", { ascending: false }); // Prioritas tinggi di atas

    if (error) {
      console.error("Error fetching promotions:", error);
      alert("Error ambil data: " + error.message);
    } else {
      setPromotions(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id, imagePath) => {
    if (
      confirm("Yakin hapus promo ini? Data dan gambar akan dihapus selamanya.")
    ) {
      // 1. Hapus Gambar di Storage dulu
      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from("promotions")
          .remove([imagePath]);

        if (storageError) console.error("Gagal hapus gambar:", storageError);
      }

      // 2. Hapus Data di Tabel
      const { error } = await supabase.from("promotions").delete().eq("id", id);

      if (error) {
        alert("Gagal hapus data!");
      } else {
        setPromotions(promotions.filter((item) => item.id !== id));
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Kelola Popup Promo
          </h2>
          <p className="text-slate-500 mt-1">
            Total{" "}
            <strong className="text-slate-800">{promotions.length}</strong>{" "}
            promo terdaftar.
          </p>
        </div>
        <Link
          to="/admin/popup/new"
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={20} /> Buat Promo Baru
        </Link>
      </div>

      {/* Kontainer Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>Mengambil data promo...</p>
          </div>
        ) : promotions.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <Layers size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Belum ada promo
            </h3>
            <p className="text-slate-500 max-w-sm mt-2 mb-8 leading-relaxed">
              Buat popup promosi pertama Anda untuk menarik perhatian
              pengunjung.
            </p>
            <Link
              to="/admin/popup/new"
              className="text-teal-600 font-semibold hover:text-teal-700 hover:underline"
            >
              Buat promo sekarang &rarr;
            </Link>
          </div>
        ) : (
          /* Tabel Data Responsive */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">
                    Preview
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Judul & Jadwal
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promotions.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Gambar Thumbnail */}
                    <td className="px-6 py-4 align-top">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                        <img
                          src={item.image_url}
                          alt="Promo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Info Utama */}
                    <td className="px-6 py-4 align-top max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-teal-700 transition-colors">
                          {item.title}
                        </p>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                          Pri: {item.priority}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar size={12} />
                          <span>
                            {new Date(item.start_date).toLocaleDateString(
                              "id-ID",
                            )}{" "}
                            -{" "}
                            {new Date(item.end_date).toLocaleDateString(
                              "id-ID",
                            )}
                          </span>
                        </div>
                        {item.cta_link && (
                          <div className="flex items-center gap-2 text-xs text-blue-500">
                            <LinkIcon size={12} />
                            <span className="truncate max-w-[200px]">
                              {item.cta_link}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 align-top">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                          item.is_active
                            ? "bg-teal-50 text-teal-700 border-teal-100"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {item.is_active ? "Aktif" : "Non-Aktif"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/popup/edit/${item.id}`}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-teal-600 hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.image_path)}
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

export default ManagePopup;
