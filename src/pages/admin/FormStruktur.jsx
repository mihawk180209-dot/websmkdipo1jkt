import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  ArrowLeft,
  Image as ImageIcon,
  Save,
  Loader2,
  UploadCloud,
  Hash,
  Users,
} from "lucide-react";

const FormStruktur = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    category: "waka",
    sort_order: 1,
  });

  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (id) fetchMember();
  }, [id]);

  const fetchMember = async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from("organization_structure")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      setFormData({
        name: data.name,
        role: data.role,
        category: data.category,
        sort_order: data.sort_order,
      });
      setCurrentImage(data.image_url);
    }
    setLoadingData(false);
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "number" ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const convertImageToWebP = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, "") + ".webp",
                {
                  type: "image/webp",
                  lastModified: Date.now(),
                },
              );
              resolve(newFile);
            } else {
              reject(new Error("Gagal konversi"));
            }
          },
          "image/webp",
          0.8,
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const deleteOldImage = async (url) => {
    if (!url || !url.includes("/org-images/")) return;
    const filePath = url.split("/org-images/")[1];
    if (filePath) await supabase.storage.from("org-images").remove([filePath]);
  };

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Validasi Tipe
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("⛔ Format salah! Mohon upload file gambar (JPG, PNG, WEBP).");
      e.target.value = "";
      return;
    }

    // Validasi Ukuran
    if (file.size > 5 * 1024 * 1024) {
      alert("⚠️ File terlalu besar! Maksimal 5MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let finalImageUrl = currentImage;

    try {
      if (imageFile) {
        if (id && currentImage) await deleteOldImage(currentImage);
        const webpFile = await convertImageToWebP(imageFile);
        const fileName = `struct_${Date.now()}_${Math.random().toString(36).substring(2)}.webp`;

        const { error: upErr } = await supabase.storage
          .from("org-images")
          .upload(fileName, webpFile, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: false,
          });

        if (upErr) throw new Error("Gagal upload gambar: " + upErr.message);
        const { data: urlData } = supabase.storage
          .from("org-images")
          .getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      const payload = { ...formData, image_url: finalImageUrl };

      let dbError;
      if (id) {
        const { error } = await supabase
          .from("organization_structure")
          .update(payload)
          .eq("id", id);
        dbError = error;
      } else {
        const { error } = await supabase
          .from("organization_structure")
          .insert([payload]);
        dbError = error;
      }

      if (dbError) throw new Error("Gagal simpan data: " + dbError.message);

      alert("Berhasil menyimpan data struktur!");
      navigate("/admin/struktur");
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loadingData)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Memuat data...</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header Form */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <Link
          to="/admin/struktur"
          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {id ? "Edit Data Struktur" : "Tambah Pejabat Baru"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Lengkapi profil pejabat dalam struktur organisasi sekolah.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Kolom Kiri: Input Data Diri */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="space-y-6">
              {/* INPUT NAMA */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nama Lengkap & Gelar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  required
                  placeholder="Contoh: Dr. Ahmad Riyadi, M.Pd"
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
                />
              </div>

              {/* INPUT JABATAN */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Jabatan Struktural <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  required
                  placeholder="Contoh: Wakil Kepala Sekolah Bidang Kurikulum"
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
              </div>

              {/* INPUT URUTAN */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Urutan Tampil <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    required
                    min="1"
                    placeholder="1"
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  *Angka terkecil akan ditampilkan pertama dalam kategori yang
                  sama.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Sidebar Options */}
        <div className="space-y-6">
          {/* Panel Publish */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 text-lg">
              Simpan Data
            </h3>
            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                uploading
                  ? "bg-slate-400 cursor-not-allowed shadow-none"
                  : "bg-teal-600 hover:bg-teal-700 hover:shadow-teal-500/30"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Menyimpan...
                </>
              ) : (
                <>
                  <Save size={20} /> {id ? "Simpan Perubahan" : "Tambahkan"}
                </>
              )}
            </button>
          </div>

          {/* Panel Kategori */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Posisi dalam Bagan
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 cursor-pointer hover:bg-slate-100 transition"
              >
                <option value="kepsek">Kepala Sekolah</option>
                <option value="ktu">Kepala Tata Usaha</option>
                <option value="waka">Wakil Kepala Sekolah</option>
                <option value="kaprog">Kepala Program (Kaprog)</option>
                <option value="pembina">Pembina OSIS</option>
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              *Menentukan level dan warna dalam bagan.
            </p>
          </div>

          {/* Panel Gambar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Foto Profil (Auto WebP)
            </label>

            <div className="relative group">
              <div
                className={`w-full h-56 rounded-xl overflow-hidden border-2 ${
                  previewUrl || currentImage
                    ? "border-slate-200"
                    : "border-dashed border-slate-300 bg-slate-50"
                } flex flex-col items-center justify-center relative transition-colors group-hover:border-teal-400`}
              >
                {previewUrl || currentImage ? (
                  <>
                    <img
                      src={previewUrl || currentImage}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium flex items-center gap-2">
                        <UploadCloud size={18} /> Ganti Foto
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users size={24} />
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      Upload Foto
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      JPG/PNG (Max 5MB)
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormStruktur;
