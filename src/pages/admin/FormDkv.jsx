import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase"; // Sesuaikan path
import { Save, ArrowLeft, Plus, X, Loader2, CheckCircle2 } from "lucide-react";

const FormDkv = () => {
  const { id } = useParams(); // Jika ada ID, berarti mode Edit
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [classLevel, setClassLevel] = useState("X");
  const [displayOrder, setDisplayOrder] = useState(1);

  // Topic State
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState("");

  const isEditMode = Boolean(id);

  // Load data jika Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchDetail = async () => {
        setInitialLoading(true);
        // Table dkv_curriculum
        const { data, error } = await supabase
          .from("dkv_curriculum")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error(error);
          alert("Gagal memuat data");
          navigate("/admin/dkv");
        } else {
          setTitle(data.title);
          setClassLevel(data.class_level);
          setDisplayOrder(data.display_order);

          const parsedTopics =
            typeof data.topics === "string"
              ? JSON.parse(data.topics)
              : data.topics;
          setTopics(parsedTopics || []);
        }
        setInitialLoading(false);
      };
      fetchDetail();
    }
  }, [id, navigate]);

  const addTopic = (e) => {
    e.preventDefault();
    if (!currentTopic.trim()) return;
    setTopics([...topics, currentTopic]);
    setCurrentTopic("");
  };

  const removeTopic = (indexToRemove) => {
    setTopics(topics.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (topics.length === 0) {
      alert("Minimal harus ada 1 topik pembelajaran!");
      setLoading(false);
      return;
    }

    const payload = {
      title,
      class_level: classLevel,
      display_order: parseInt(displayOrder),
      topics: topics,
    };

    try {
      let error;
      if (isEditMode) {
        // Update tabel dkv
        const { error: err } = await supabase
          .from("dkv_curriculum")
          .update(payload)
          .eq("id", id);
        error = err;
      } else {
        // Insert tabel dkv
        const { error: err } = await supabase
          .from("dkv_curriculum")
          .insert([payload]);
        error = err;
      }

      if (error) throw error;

      navigate("/admin/dkv"); // Kembali ke dashboard DKV
    } catch (error) {
      console.error("Error saving:", error);
      alert(`Gagal menyimpan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 font-sans flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Tombol Kembali dengan hover Purple */}
        <Link
          to="/admin/dkv"
          className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-6 transition font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Kembali ke Daftar DKV
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Warna Ungu */}
          <div className="bg-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold">
              {isEditMode ? "Edit Materi DKV" : "Tambah Materi DKV Baru"}
            </h1>
            <p className="text-purple-100 text-sm mt-1">
              {isEditMode
                ? "Perbarui informasi kurikulum desain."
                : "Masukan data kurikulum desain baru."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Judul - Focus Ring Purple */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judul Materi
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Dasar Desain Grafis"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Kelas */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kelas
                </label>
                <div className="relative">
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none appearance-none bg-white cursor-pointer"
                  >
                    <option value="X">Kelas X (Sepuluh)</option>
                    <option value="XI">Kelas XI (Sebelas)</option>
                    <option value="XII">Kelas XII (Dua Belas)</option>
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                    ▼
                  </div>
                </div>
              </div>

              {/* Urutan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Urutan Tampilan
                </label>
                <input
                  type="number"
                  min="0"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none transition"
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Input Topik Dinamis */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Daftar Topik / Kompetensi
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={currentTopic}
                  onChange={(e) => setCurrentTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTopic(e)}
                  placeholder="Ketik topik desain..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={addTopic}
                  className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition active:scale-95"
                >
                  <Plus size={24} />
                </button>
              </div>

              {/* List Topik */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 min-h-[100px]">
                {topics.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center italic mt-2">
                    Belum ada topik ditambahkan.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {topics.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 group"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-purple-500" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTopic(idx)}
                          className="text-gray-400 hover:text-red-500 transition p-1"
                        >
                          <X size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all transform active:scale-[0.99] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={20} /> Simpan Kurikulum
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormDkv;
