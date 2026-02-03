import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  Plus,
  Pencil,
  Trash2,
  UserX,
  Loader2,
  User,
  Layers,
} from "lucide-react";

const ManageStruktur = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from("organization_structure")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });

    if (!error) setMembers(data || []);
    setLoading(false);
  };

  const handleDelete = async (id, imageUrl) => {
    if (!confirm("Hapus pejabat ini dari struktur?")) return;
    try {
      if (imageUrl?.includes("/org-images/")) {
        const filePath = imageUrl.split("/org-images/")[1];
        await supabase.storage.from("org-images").remove([filePath]);
      }
      await supabase.from("organization_structure").delete().eq("id", id);
      setMembers(members.filter((m) => m.id !== id));
    } catch (err) {
      alert("Gagal hapus");
    }
  };

  const getCategoryStyle = (cat) => {
    const styles = {
      kepsek: "bg-red-50 text-red-700 border-red-100",
      ktu: "bg-blue-50 text-blue-700 border-blue-100",
      waka: "bg-orange-50 text-orange-700 border-orange-100",
      kaprog: "bg-emerald-50 text-emerald-700 border-emerald-100",
      pembina: "bg-purple-50 text-purple-700 border-purple-100",
    };
    return styles[cat] || "bg-slate-50 text-slate-700 border-slate-100";
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      kepsek: "Kepala Sekolah",
      ktu: "Kepala TU",
      waka: "Wakil Kepala",
      kaprog: "Kaprog",
      pembina: "Pembina",
    };
    return labels[cat] || cat;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Bagan Organisasi
          </h2>
          <p className="text-slate-500 mt-1">
            Total <strong className="text-slate-800">{members.length}</strong>{" "}
            pejabat dalam struktur.
          </p>
        </div>
        <Link
          to="/admin/struktur/tambah"
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={20} /> Tambah Pejabat
        </Link>
      </div>

      {/* Kontainer Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>Mengambil data...</p>
          </div>
        ) : members.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <Layers size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Belum ada struktur organisasi
            </h3>
            <p className="text-slate-500 max-w-sm mt-2 mb-8 leading-relaxed">
              Tambahkan data pimpinan dan struktur organisasi sekolah di sini.
            </p>
            <Link
              to="/admin/struktur/tambah"
              className="text-teal-600 font-semibold hover:text-teal-700 hover:underline"
            >
              Buat struktur sekarang &rarr;
            </Link>
          </div>
        ) : (
          /* Tabel Data Responsive */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Profil
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nama & Jabatan
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Urutan
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-md">
                      <p className="font-bold text-slate-800 text-base line-clamp-1 mb-0.5 group-hover:text-teal-700 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-sm text-slate-500">{item.role}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getCategoryStyle(
                          item.category,
                        )}`}
                      >
                        {getCategoryLabel(item.category)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        #{item.sort_order}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/struktur/edit/${item.id}`}
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

export default ManageStruktur;
