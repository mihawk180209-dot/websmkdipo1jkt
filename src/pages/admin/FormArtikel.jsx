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

const FormArtikel = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    category: "Berita",
    content: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      setFormData({
        title: data.title,
        category: data.category,
        content: data.content,
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

        // Convert ke WebP, Quality 0.8 (80%)
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
    // Asumsi bucket bernama 'article-images' sesuai kode kakak
    if (url.includes("/article-images/")) {
      const filePath = url.split("/article-images/")[1];
      if (filePath) {
        await supabase.storage.from("article-images").remove([filePath]);
      }
    }
  };

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // 1. Cek Tipe File
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "⛔ Format salah! Mohon hanya upload file gambar (JPG, PNG, WEBP).",
      );
      e.target.value = "";
      return;
    }

    // 2. Cek Ukuran File (Max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("⚠️ File terlalu besar! Maksimal ukuran file adalah 10MB.");
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
      // Jika ada file baru yang diupload
      if (imageFile) {
        // 1. Hapus gambar lama dulu jika mode EDIT (Biar hemat storage)
        if (id && currentImage) {
          await deleteOldImage(currentImage);
        }

        // 2. Convert gambar ke WebP
        const webpFile = await convertImageToWebP(imageFile);

        // 3. Buat nama file unik dengan akhiran .webp
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(2)}.webp`;

        // 4. Upload ke Supabase
        const { error: uploadError } = await supabase.storage
          .from("article-images")
          .upload(fileName, webpFile, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error("Gagal upload gambar: " + uploadError.message);
        }

        // 5. Dapatkan URL publik
        const { data: urlData } = supabase.storage
          .from("article-images")
          .getPublicUrl(fileName);

        finalImageUrl = urlData.publicUrl;
      }

      // Siapkan data Database
      const payload = {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        image_url: finalImageUrl,
      };

      let dbError;

      if (id) {
        // Mode EDIT
        const { error } = await supabase
          .from("articles")
          .update(payload)
          .eq("id", id);
        dbError = error;
      } else {
        // Mode TAMBAH BARU
        const { error } = await supabase.from("articles").insert([payload]);
        dbError = error;
      }

      if (dbError) {
        throw new Error("Gagal simpan artikel: " + dbError.message);
      }

      alert("Berhasil menyimpan artikel!");
      navigate("/admin/artikel");
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
        <p>Memuat data artikel...</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header Form */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <Link
          to="/admin/artikel"
          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {id ? "Edit Artikel" : "Tulis Artikel Baru"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Lengkapi detail di bawah untuk mempublikasikan konten.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Kolom Kiri: Input Utama */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  required
                  placeholder="Contoh: Kegiatan Porseni 2024..."
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Konten Utama <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  rows="15"
                  required
                  placeholder="Mulai menulis cerita anda di sini..."
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all leading-relaxed"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Sidebar Options */}
        <div className="space-y-6">
          {/* Panel Publish */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 text-lg">Publikasi</h3>
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
                  <Save size={20} /> {id ? "Simpan Perubahan" : "Terbitkan"}
                </>
              )}
            </button>
          </div>

          {/* Panel Kategori */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Kategori
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 cursor-pointer hover:bg-slate-100 transition"
              >
                <option value="Berita">Berita</option>
                <option value="Prestasi">Prestasi</option>
                <option value="Pengumuman">Pengumuman</option>
              </select>
            </div>
          </div>

          {/* Panel Gambar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Gambar Unggulan (Auto WebP)
            </label>

            {/* Custom File Upload UI */}
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
                        <UploadCloud size={18} /> Ganti Gambar
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ImageIcon size={24} />
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      Klik untuk upload
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      JPG/PNG akan otomatis diubah ke WebP
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
            {(previewUrl || currentImage) && (
              <p className="text-xs text-center text-slate-400 mt-3">
                Gambar berhasil dipilih
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormArtikel;
