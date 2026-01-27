import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  Plus,
  Pencil,
  Trash2,
  Layers, // Ikon ganti biar sesuai program
  Loader2,
  Link as LinkIcon,
} from "lucide-react";

const ManageProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    // Ambil data dari tabel 'program_unggulan'
    let { data, error } = await supabase
      .from("program_unggulan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching programs:", error);
      alert("Error ambil data: " + error.message);
    } else {
      setPrograms(data || []);
    }
    setLoading(false);
  };

  // --- HAPUS PROGRAM + FOTO ---
  const handleDelete = async (id, imageUrl) => {
    if (!confirm("Yakin hapus data program ini?")) return;

    try {
      // 1. Hapus Foto dari Storage
      if (imageUrl && imageUrl.includes("/program-images/")) {
        const filePath = imageUrl.split("/program-images/")[1];
        if (filePath) {
          await supabase.storage.from("program-images").remove([filePath]);
        }
      }

      // 2. Hapus Data dari DB
      const { error } = await supabase
        .from("program_unggulan")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // 3. Update State
      setPrograms(programs.filter((item) => item.id !== id));
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
            Kelola Program Unggulan
          </h2>
          <p className="text-slate-500 mt-1">
            Atur konten program unggulan dan kelas industri.
          </p>
        </div>
        <Link
          to="/admin/program/tambah" // Pastikan route ini sesuai di App.jsx
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={20} /> Tambah Program
        </Link>
      </div>

      {/* Kontainer Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>Mengambil data...</p>
          </div>
        ) : programs.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <Layers size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Belum ada program unggulan
            </h3>
            <p className="text-slate-500 max-w-sm mt-2 mb-8 leading-relaxed">
              Tambahkan program baru untuk ditampilkan di website.
            </p>
            <Link
              to="/admin/program/tambah"
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
                    Nama Program
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Deskripsi Singkat
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programs.map((item) => (
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
                            <Layers size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-md">
                      {/* Badge Slug sebagai pengganti Hari */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-500 mb-1">
                        <LinkIcon size={10} /> /{item.slug}
                      </span>
                      <p className="font-bold text-slate-800 text-base group-hover:text-teal-700 transition-colors">
                        {item.title}
                      </p>
                    </td>
                    <td className="px-6 py-5 max-w-xs">
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {item.excerpt}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/program/edit/${item.id}`} // Pastikan route edit ini benar
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

export default ManageProgram;
