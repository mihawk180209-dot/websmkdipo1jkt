import { useEffect } from "react";
import {
  Target,
  Flag,
  CheckCircle,
  Lightbulb,
  Users,
  Globe,
  Heart,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const VisiMisi = () => {
  // --- INISIALISASI AOS ---
  useEffect(() => {
    AOS.init({
      duration: 1000, // Durasi animasi 1 detik (Smooth)
      once: true, // Animasi hanya jalan sekali (tidak hilang saat scroll ke atas)
      offset: 100, // Mulai animasi ketika elemen masuk 100px ke viewport
      easing: "ease-out-cubic", // Easing yang halus
    });
  }, []);

  const missions = [
    "Membekali murid dengan keterampilan praktis dan pemikiran inovatif untuk menciptakan karya dan solusi yang berdampak di bidang desain visual maupun teknologi informasi.",
    "Membangun karakter profesional yang adaptif, kolaboratif, dan beretika, agar lulusan mampu bersaing dan bekerja secara kompeten di berbagai lingkungan kerja.",
    "Menanamkan nilai-nilai Pancasila, kebhinekaan, dan tanggung jawab sosial dalam setiap proses pembelejaran dan hasil karya murid.",
    "Mendorong semangat berkarya dan berwirausaha berbasis teknologi dan budaya lokal, agar murid dapat menjadi pelaku perubahan yang relevan dengan perkembangan zaman dan kebutuhan masyarakat.",
  ];

  const values = [
    {
      icon: <Users size={32} />,
      title: "Profesionalisme",
      desc: "Melambangkan sikap kerja yang tangguh, bertanggung jawab, siap industri, dan menjunjung etika tinggi.",
    },
    {
      icon: <Lightbulb size={32} />,
      title: "Inovatif",
      desc: "Menggambarkan semangat berkarya, beripikir kreatif, dan menciptakan solusi baru di bidang desain maupun teknologi.",
    },
    {
      icon: <Globe size={32} />,
      title: "Kolaborasi",
      desc: "Mampu bekerja sama lintas bidang dan latar belakang dengan semangat saling menghargai, untuk menghasilkan karya dan solusi yang lebih kuat.",
    },
    {
      icon: <Heart size={32} />,
      title: "Berkarakter",
      desc: "Mewakili nilai-nilai kebhinekaan, Pancasila, empati sosial, dan tanggung jawab sebagai warga negara yang baik.",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ==================== HEADER HERO ==================== */}
      <div className="bg-orange-50 pt-20 pb-32 lg:pt-32 lg:pb-40 relative overflow-hidden">
        {/* Background Blobs (Animated with standard CSS for continuous effect) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <span
            data-aos="fade-down"
            className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block"
          >
            Arah & Tujuan Kami
          </span>
          <h1
            data-aos="zoom-in"
            data-aos-delay="200"
            className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6"
          >
            Visi & Misi Sekolah
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="400"
            className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Menjadi landasan kami dalam melangkah, mendidik, dan mempersiapkan
            generasi masa depan yang gemilang.
          </p>
        </div>
      </div>

      {/* ==================== VISI SECTION ==================== */}
      <div className="container mx-auto px-4 -mt-20 lg:-mt-24 relative z-20">
        <div
          data-aos="fade-up"
          data-aos-duration="1200"
          className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 text-center max-w-4xl mx-auto transform hover:-translate-y-2 transition-transform duration-500"
        >
          <div
            data-aos="zoom-in"
            data-aos-delay="300"
            className="w-20 h-20 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30"
          >
            <Target size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-4">
            Visi Kami
          </h2>
          <blockquote className="text-2xl lg:text-4xl font-serif font-medium text-gray-900 leading-snug">
            “Melahirkan institusi pendidikan vokasi unggulan yang melahirkan
            generasi{" "}
            <span className="text-primary underline decoration-4 decoration-primary/30">
              profesional
            </span>
            ,{" "}
            <span className="text-primary underline decoration-4 decoration-primary/30">
              adaptif
            </span>
            , dan{" "}
            <span className="text-primary underline decoration-4 decoration-primary/30">
              berdaya saing global;
            </span>
            berlandaskan Pancasila, menguasai teknologi terbarukan, serta mampu
            berkarya dan menciptakan perubahan positif dalam masyarakat."
          </blockquote>
        </div>
      </div>

      {/* ==================== MISI SECTION ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* Kolom Kiri: Judul */}
            <div className="w-full lg:w-1/3 relative lg:sticky lg:top-24">
              <div
                data-aos="fade-right"
                className="flex items-center gap-3 mb-4 text-primary"
              >
                <Flag size={32} />
                <h2 className="text-3xl font-bold text-gray-900">Misi Kami</h2>
              </div>
              <p
                data-aos="fade-right"
                data-aos-delay="200"
                className="text-gray-600 text-lg leading-relaxed mb-8"
              >
                Menyelenggarakan pendidikan vokasi berbasis teknologi dan
                kreativitas yang kontekstual dan terintegrasi dengan kebutuhan
                industri masa kini dan masa depan.
              </p>
              <div
                data-aos="zoom-in"
                data-aos-delay="400"
                className="hidden lg:block p-6 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <p className="font-bold text-gray-800 mb-2"></p>
                <p className="text-sm text-gray-600">
                  Kami berkomitmen memberikan layanan pendidikan terbaik dengan
                  standar kualitas yang terus ditingkatkan.
                </p>
              </div>
            </div>

            {/* Kolom Kanan: Daftar Misi */}
            <div className="w-full lg:w-2/3">
              <div className="space-y-6">
                {missions.map((misi, idx) => (
                  <div
                    key={idx}
                    data-aos="fade-up"
                    data-aos-delay={idx * 100} // Stagger effect: Muncul satu per satu
                    className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:border-primary/50 hover:shadow-lg transition-all group cursor-default hover:-translate-x-[-10px]"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle
                        className="text-gray-300 group-hover:text-primary transition-colors duration-300"
                        size={24}
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300 mb-2">
                        Misi Ke-{idx + 1}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">{misi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CORE VALUES SECTION ==================== */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2
              data-aos="fade-up"
              className="text-3xl lg:text-4xl font-bold mb-4"
            >
              Nilai & Tujuan
            </h2>
            <div
              data-aos="zoom-in"
              data-aos-delay="200"
              className="w-20 h-1 bg-primary mx-auto rounded-full"
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <div
                key={idx}
                data-aos="flip-up"
                data-aos-delay={idx * 150} // Stagger effect
                className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:bg-gray-700 transition-all text-center group hover:-translate-y-2 duration-300"
              >
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-primary border border-gray-600 group-hover:border-primary duration-300">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisiMisi;
