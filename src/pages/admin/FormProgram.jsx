import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  ArrowLeft,
  Image as ImageIcon,
  Save,
  Loader2,
  UploadCloud,
  Link as LinkIcon,
  Plus,
  X,
  ListChecks, // Icon baru buat section benefit
} from "lucide-react";

const FormProgram = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // State Data Utama
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
  });

  // State Khusus Benefit (Array)
  const [benefits, setBenefits] = useState([""]); // Default 1 input kosong

  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProgram();
    }
  }, [id]);

  const fetchProgram = async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from("program_unggulan")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
      });
      setCurrentImage(data.image_url);

      // Load benefits kalo ada, kalo null kasih array kosong
      if (data.benefits && Array.isArray(data.benefits)) {
        setBenefits(data.benefits.length > 0 ? data.benefits : [""]);
      }
    }
    setLoadingData(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" && !id) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      setFormData((prev) => ({ ...prev, title: value, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- LOGIC DYNAMIC BENEFIT ---
  const handleBenefitChange = (index, value) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const addBenefitField = () => {
    setBenefits([...benefits, ""]);
  };

  const removeBenefitField = (index) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(newBenefits);
  };

  // --- IMAGE HELPERS ---
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
                { type: "image/webp", lastModified: Date.now() },
              );
              resolve(newFile);
            } else reject(new Error("Gagal konversi"));
          },
          "image/webp",
          0.8,
        );
      };
      img.onerror = (err) => reject(err);
      img.src = URL.createObjectURL(file);
    });
  };

  const deleteOldImage = async (url) => {
    if (!url) return;
    if (url.includes("/program-images/")) {
      const filePath = url.split("/program-images/")[1];
      if (filePath)
        await supabase.storage.from("program-images").remove([filePath]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let finalImageUrl = currentImage;

    try {
      if (imageFile) {
        if (id && currentImage) await deleteOldImage(currentImage);
        const webpFile = await convertImageToWebP(imageFile);
        const fileName = `prog_${Date.now()}_${Math.random().toString(36).substring(2)}.webp`;
        const { error: uploadError } = await supabase.storage
          .from("program-images")
          .upload(fileName, webpFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("program-images")
          .getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      // Filter benefit yang kosong biar gak nyampah di DB
      const cleanBenefits = benefits.filter((b) => b.trim() !== "");

      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        image_url: finalImageUrl,
        benefits: cleanBenefits, // Masukin ke payload
      };

      if (id) {
        await supabase.from("program_unggulan").update(payload).eq("id", id);
      } else {
        await supabase.from("program_unggulan").insert([payload]);
      }

      alert("Berhasil menyimpan data program!");
      navigate("/admin/program");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loadingData) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header Form */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <Link
          to="/admin/program"
          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {id ? "Edit Program" : "Tambah Program"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Masukan detail program unggulan sekolah.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Kolom Kiri */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="space-y-6">
              {/* INPUT STANDARD (Title, Slug, Excerpt, Content) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nama Program *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-lg focus:outline-none focus:border-teal-500 transition-all"
                  placeholder="Contoh: Kelas Industri Samsung"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Slug URL (Auto)
                </label>
                <div className="relative">
                  <LinkIcon
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Deskripsi Singkat *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  rows="2"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 transition-all"
                  placeholder="Ringkasan untuk kartu..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Konten Lengkap *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  rows="8"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 transition-all"
                  placeholder="Detail artikel program..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-6">
          {/* Tombol Simpan */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {uploading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {uploading ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>

          {/* INPUT FOTO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Foto Sampul
            </label>
            <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center hover:border-teal-500 transition-colors">
              {previewUrl || currentImage ? (
                <img
                  src={previewUrl || currentImage}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <ImageIcon size={24} className="mx-auto mb-2" />
                  <span className="text-xs">Upload Gambar</span>
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

          {/* INPUT DYNAMIC BENEFITS (BARU) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <ListChecks size={18} className="text-orange-500" /> Poin
                Benefit
              </label>
              <button
                type="button"
                onClick={addBenefitField}
                className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-lg font-bold hover:bg-orange-100 transition-colors"
              >
                + Tambah
              </button>
            </div>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder={`Benefit ${index + 1}`}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-all"
                  />
                  {benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBenefitField(index)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <p className="text-xs text-slate-400 mt-2 italic">
                * Kosongkan jika ingin dihapus otomatis.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormProgram;
