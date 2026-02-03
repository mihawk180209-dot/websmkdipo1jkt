import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  ArrowLeft,
  Image as ImageIcon,
  Save,
  Loader2,
  UploadCloud,
} from "lucide-react";

const FormGuru = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // State Data (Sesuaikan dengan kolom DB teachers)
  const [formData, setFormData] = useState({
    name: "",
    role: "", // Jabatan atau Mapel
    category: "Guru", // Default
  });

  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTeacher();
    }
  }, [id]);

  const fetchTeacher = async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from("teachers")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      setFormData({
        name: data.name,
        role: data.role,
        category: data.category,
      });
      setCurrentImage(data.image_url);
    }
    setLoadingData(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- HELPER: CONVERT KE WEBP ---
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
              reject(new Error("Gagal konversi gambar"));
            }
          },
          "image/webp",
          0.8,
        );
      };
      img.onerror = (error) => reject(error);
      img.src = URL.createObjectURL(file);
    });
  };

  // --- HELPER: HAPUS GAMBAR LAMA ---
  const deleteOldImage = async (url) => {
    if (!url) return;
    // Cek bucket 'teacher-images'
    if (url.includes("/teacher-images/")) {
      const filePath = url.split("/teacher-images/")[1];
      if (filePath) {
        await supabase.storage.from("teacher-images").remove([filePath]);
      }
    }
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

    // Validasi Ukuran (Max 5MB cukup untuk profil)
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
      // PROSES UPLOAD GAMBAR
      if (imageFile) {
        // 1. Hapus gambar lama jika edit
        if (id && currentImage) {
          await deleteOldImage(currentImage);
        }

        // 2. Convert ke WebP
        const webpFile = await convertImageToWebP(imageFile);

        // 3. Nama file unik
        const fileName = `guru_${Date.now()}_${Math.random().toString(36).substring(2)}.webp`;

        // 4. Upload ke bucket 'teacher-images'
        const { error: uploadError } = await supabase.storage
          .from("teacher-images")
          .upload(fileName, webpFile, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError)
          throw new Error("Gagal upload gambar: " + uploadError.message);

        // 5. Ambil URL Publik
        const { data: urlData } = supabase.storage
          .from("teacher-images")
          .getPublicUrl(fileName);

        finalImageUrl = urlData.publicUrl;
      }

      // DATA PAYLOAD
      const payload = {
        name: formData.name,
        role: formData.role,
        category: formData.category,
        image_url: finalImageUrl,
      };

      let dbError;

      if (id) {
        // EDIT
        const { error } = await supabase
          .from("teachers")
          .update(payload)
          .eq("id", id);
        dbError = error;
      } else {
        // TAMBAH BARU
        const { error } = await supabase.from("teachers").insert([payload]);
        dbError = error;
      }

      if (dbError) throw new Error("Gagal simpan data: " + dbError.message);

      alert("Berhasil menyimpan data guru!");
      navigate("/admin/guru");
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
          to="/admin/guru"
          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {id ? "Edit Data Guru" : "Tambah Guru Baru"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Lengkapi profil tenaga pendidik atau kependidikan.
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
                  placeholder="Contoh: Budi Santoso, S.Pd"
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
                />
              </div>

              {/* INPUT JABATAN */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Jabatan / Mata Pelajaran{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  required
                  placeholder="Contoh: Wakasek Kurikulum / Guru Matematika"
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
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
              Kategori Pegawai
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 cursor-pointer hover:bg-slate-100 transition"
              >
                <option value="Guru">Guru</option>
                <option value="Pimpinan">Pimpinan</option>
                <option value="Staf">Staf / Tata Usaha</option>
              </select>
            </div>
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
                      <ImageIcon size={24} />
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

export default FormGuru;
