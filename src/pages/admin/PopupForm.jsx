import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase"; // Sesuaikan path
import {
  ArrowLeft,
  Image as ImageIcon,
  Save,
  Loader2,
  UploadCloud,
  CalendarClock,
} from "lucide-react";

const PopupForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const MAX_WIDTH = 1600;
  const MAX_HEIGHT = 1600;
  const MAX_WEBP_SIZE = 400 * 1024; // 400 KB

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cta_text: "",
    cta_link: "",
    open_in_new_tab: false,
    start_date: "",
    end_date: "",
    priority: 0,
    is_active: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImagePath, setCurrentImagePath] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPromotion();
    }
  }, [id]);

  const fetchPromotion = async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from("promotions")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
      const formatDateTime = (dateStr) =>
        new Date(dateStr).toISOString().slice(0, 16);

      setFormData({
        title: data.title,
        description: data.description || "",
        cta_text: data.cta_text || "",
        cta_link: data.cta_link || "",
        open_in_new_tab: data.open_in_new_tab,
        start_date: formatDateTime(data.start_date),
        end_date: formatDateTime(data.end_date),
        priority: data.priority,
        is_active: data.is_active,
      });
      setCurrentImage(data.image_url);
      setCurrentImagePath(data.image_path);
    }
    setLoadingData(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // --- HELPER: CONVERT KE WEBP ---
  const convertImageToWebP = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // --- Resize logic ---
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.85;

        const tryConvert = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject("Gagal konversi");

              // Kalau masih kegedean → turunin quality
              if (blob.size > MAX_WEBP_SIZE && quality > 0.5) {
                quality -= 0.1;
                tryConvert();
                return;
              }

              const webpFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, "") + ".webp",
                {
                  type: "image/webp",
                  lastModified: Date.now(),
                },
              );

              resolve(webpFile);
            },
            "image/webp",
            quality,
          );
        };

        tryConvert();
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert(
        "⛔ Format salah! Mohon hanya upload file gambar (JPG, PNG, WEBP).",
      );
      return;
    }

    if (width > 3000 || height > 3000) {
      alert("Resolusi terlalu besar. Maksimal 3000x3000 sebelum dikompres.");
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File terlalu besar. Maksimal 10MB sebelum dikompres.");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let finalImageUrl = currentImage;
    let finalImagePath = currentImagePath;

    try {
      // 1. Upload Image (If New)
      if (imageFile) {
        // Hapus gambar lama dulu jika ada (Biar hemat storage)
        if (id && currentImagePath) {
          await supabase.storage.from("promotions").remove([currentImagePath]);
        }

        const webpFile = await convertImageToWebP(imageFile);
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("promotions")
          .upload(fileName, webpFile, {
            contentType: "image/webp",
            upsert: false,
          });

        if (uploadError)
          throw new Error("Gagal upload gambar: " + uploadError.message);

        const { data: urlData } = supabase.storage
          .from("promotions")
          .getPublicUrl(fileName);

        finalImageUrl = urlData.publicUrl;
        finalImagePath = fileName;
      }

      // 2. Simpan Data
      const payload = {
        title: formData.title,
        description: formData.description,
        cta_text: formData.cta_text,
        cta_link: formData.cta_link,
        open_in_new_tab: formData.open_in_new_tab,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        priority: parseInt(formData.priority),
        is_active: formData.is_active,
        image_url: finalImageUrl,
        image_path: finalImagePath,
      };

      let dbError;
      if (id) {
        const { error } = await supabase
          .from("promotions")
          .update(payload)
          .eq("id", id);
        dbError = error;
      } else {
        const { error } = await supabase.from("promotions").insert([payload]);
        dbError = error;
      }

      if (dbError) throw new Error("Gagal simpan promo: " + dbError.message);

      alert("Berhasil menyimpan promo!");
      navigate("/admin/popup");
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
        <p>Memuat data promo...</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header Form */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <Link
          to="/admin/popup"
          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {id ? "Edit Promo Popup" : "Buat Promo Baru"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Atur konten promosi yang akan muncul sebagai popup.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Kolom Kiri: Input Utama */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Judul Promo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Contoh: Diskon Kemerdekaan 50%..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Deskripsi Singkat
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Deskripsi opsional..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all leading-relaxed"
              ></textarea>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <CalendarClock size={16} className="text-slate-400" /> Mulai
                  Tayang
                </label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <CalendarClock size={16} className="text-slate-400" /> Selesai
                  Tayang
                </label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
                />
              </div>
            </div>

            {/* CTA Config */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-bold text-teal-700 mb-4 bg-teal-50 p-2 rounded w-fit px-4">
                Call to Action (CTA)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Link Tujuan (URL)
                  </label>
                  <input
                    type="text"
                    name="cta_link"
                    value={formData.cta_link}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500 text-sm"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="openNewTab"
                  name="open_in_new_tab"
                  checked={formData.open_in_new_tab}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <label
                  htmlFor="openNewTab"
                  className="text-sm text-slate-600 cursor-pointer select-none"
                >
                  Buka link di tab baru
                </label>
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
                  <Save size={20} />{" "}
                  {id ? "Simpan Perubahan" : "Terbitkan Promo"}
                </>
              )}
            </button>
          </div>

          {/* Panel Status & Prioritas */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            {/* Status Switch */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <div className="flex items-center gap-3">
                <div
                  onClick={() =>
                    setFormData({ ...formData, is_active: !formData.is_active })
                  }
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.is_active ? "bg-teal-500" : "bg-slate-300"}`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${formData.is_active ? "translate-x-6" : "translate-x-0"}`}
                  ></div>
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {formData.is_active ? "Aktif" : "Non-Aktif"}
                </span>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Prioritas
              </label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Angka lebih besar muncul duluan jika tanggal bentrok.
              </p>
            </div>
          </div>

          {/* Panel Gambar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Gambar Popup (Auto WebP)
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
                      className="w-full h-full object-contain bg-gray-50" // Pakai contain biar kelihatan utuh
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
                      Otomatis convert ke WebP
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

export default PopupForm;
