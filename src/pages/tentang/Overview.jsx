import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Flag,
  ArrowRight,
  History,
  Users,
  Building,
  FileText,
  UserCheck,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Ganti dengan path logo sekolah Anda
import logo from "../../assets/logo yayasan al-hidayah-02.png";

const Overview = () => {
  // --- INISIALISASI AOS ---
  useEffect(() => {
    AOS.init({
      duration: 1000, // Durasi animasi 1 detik (Biar smooth)
      once: true, // Animasi cuma jalan sekali (Gak ilang pas scroll atas)
      offset: 100, // Mulai animasi pas elemen naik 100px
      easing: "ease-in-out-cubic", // Gerakan lebih luwes
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* ==================== HEADER SECTION ==================== */}
      <div className="bg-secondary text-white py-16 lg:py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          data-aos="zoom-in"
          data-aos-duration="1500"
          className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"
        ></div>
        <div
          data-aos="zoom-in"
          data-aos-duration="1500"
          data-aos-delay="200"
          className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"
        ></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1
            data-aos="fade-down"
            className="text-4xl lg:text-5xl font-bold mb-4"
          >
            Tentang Kami
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Mengenal lebih dekat profil, visi, dan semangat SMK Diponegoro 1
            Jakarta dalam mencetak generasi unggul.
          </p>
        </div>
      </div>

      {/* ==================== INTRODUCTION & LOGO SECTION ==================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            {/* Kolom Logo (Medium Size) */}
            <div
              className="w-full md:w-1/3 flex justify-center md:justify-end"
              data-aos="fade-right" // Muncul dari kiri ke kanan
            >
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-orange-100 rounded-full scale-110 blur-xl opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
                <div className="relative bg-white p-6 rounded-full shadow-xl border border-gray-100 w-40 h-40 lg:w-48 lg:h-48 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500">
                  <img
                    src={logo}
                    alt="Logo SMK Dipo 1"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Kolom Teks */}
            <div
              className="w-full md:w-2/3 text-center md:text-left"
              data-aos="fade-left" // Muncul dari kanan ke kiri
              data-aos-delay="200"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Selamat Datang di{" "}
                <span className="text-primary">SMK Dipo 1</span>
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto md:mx-0 rounded-full mb-6"></div>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                SMK Diponegoro 1 Jakarta adalah lembaga pendidikan kejuruan yang
                berdedikasi untuk mengembangkan potensi siswa melalui pendidikan
                berbasis teknologi dan karakter. Kami percaya bahwa pendidikan
                bukan hanya tentang mengisi pikiran, tetapi juga membentuk hati
                dan keterampilan tangan.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Dengan fasilitas modern dan tenaga pengajar profesional, kami
                siap mengantarkan siswa-siswi kami menjadi tenaga kerja yang
                kompeten, wirausahawan tangguh, atau melanjutkan ke jenjang
                pendidikan yang lebih tinggi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== VISI & MISI TEASER ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Visi */}
            <div
              data-aos="fade-up"
              data-aos-delay="0"
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange-50 text-primary rounded-lg">
                  <Target size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Visi Kami</h3>
              </div>
              <p className="text-gray-600 italic">
                "Terbentuknya Insan yang Kuat dalam Imtaq Maju dalam Ipteks dan
                Prima dalam Layanan."
              </p>
            </div>

            {/* Card Misi */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Flag size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Misi Kami</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                {[
                  "Membekali warga sekolah dengan keimanan dan ketaqwaan kepada Allah SWT",
                  "Melaksanakan proses pembelajaran yang mengarah kepada pembentukan pribadi yang Mandiri dan berjiwa kompetitif",
                  "Meningkatkan pemahaman terhadap ajaran agama sehingga menjadi landasan dalam bersikap dan bertindak.",
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/tentang/visi-misi"
                className="mt-6 inline-flex items-center text-sm font-bold text-primary hover:underline group"
              >
                Lihat Selengkapnya{" "}
                <ArrowRight
                  size={16}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== QUICK LINKS GRID ==================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-gray-800">
              Jelajahi Profil Lebih Dalam
            </h2>
            <p className="text-gray-500 mt-2">
              Informasi detail mengenai sekolah kami
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                title: "Sejarah",
                icon: <History />,
                path: "/tentang/sejarah",
                color: "bg-red-50 text-red-600",
              },
              {
                title: "Guru & Staf",
                icon: <Users />,
                path: "/tentang/guru",
                color: "bg-green-50 text-green-600",
              },
              {
                title: "Fasilitas",
                icon: <Building />,
                path: "/tentang/fasilitas",
                color: "bg-purple-50 text-purple-600",
              },
              {
                title: "Struktur Org",
                icon: <FileText />,
                path: "/tentang/struktur",
                color: "bg-yellow-50 text-yellow-600",
              },
              {
                title: "OSIS",
                icon: <UserCheck />,
                path: "/tentang/osis",
                color: "bg-cyan-50 text-cyan-600",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                data-aos="zoom-in-up"
                data-aos-delay={idx * 100} // Stagger effect (muncul satu2)
              >
                <Link
                  to={item.path}
                  className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:border-primary/50 transition-all group h-full"
                >
                  <div
                    className={`p-4 rounded-full mb-3 ${item.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-semibold text-gray-700 text-sm md:text-base group-hover:text-primary transition-colors text-center">
                    {item.title}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
