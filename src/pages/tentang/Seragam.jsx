import { useLayoutEffect, useRef } from "react";
import { Shirt, Clock, Info } from "lucide-react";

// --- GSAP IMPORTS ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// IMPORT ASSETS
import senin from "../../assets/Senin.webp";
import dkv from "../../assets/DKV.webp";
import tkj from "../../assets/TKJ.webp";
import rabu from "../../assets/Rabu.webp";
import kamis from "../../assets/Kamis.webp";
import jumat from "../../assets/Jumat.webp";
import pjok from "../../assets/PJOK.webp";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

// DATA SERAGAM
const uniformData = [
  {
    id: 1,
    day: "Senin",
    title: "Putih-Putih Lengkap",
    desc: "Setiap hari Senin, siswa mengenakan seragam Putih-Putih lengkap dengan atribut dasi, topi, dan sepatu hitam polos.",
    image: senin,
  },
  {
    id: 2,
    day: "Selasa",
    title: "Seragam Kejuruan DKV",
    desc: "Identitas siswa jurusan Desain Komunikasi Visual (DKV) ditampilkan melalui kemeja berwarna ungu muda (lavender) yang dikenakan setiap hari Selasa.",
    image: dkv,
  },
  {
    id: 3,
    day: "Selasa",
    title: "Seragam Kejuruan TKJ",
    desc: "Siswa jurusan Teknik Komputer dan Jaringan (TKJ) memiliki ciri khas tersendiri dengan kemeja berwarna hijau toska yang diberi aksen oranye pada bagian lengan dan saku.",
    image: tkj,
  },
  {
    id: 4,
    day: "Rabu",
    title: "Seragam Pramuka",
    desc: "Hari Rabu didedikasikan untuk semangat kepanduan melalui penggunaan Seragam Pramuka lengkap.",
    image: rabu,
  },
  {
    id: 5,
    day: "Kamis",
    title: "Batik Yayasan/Sekolah",
    desc: "Nuansa budaya hadir di hari Kamis lewat penggunaan Batik Yayasan bernuansa biru dengan motif khas sekolah.",
    image: kamis,
  },
  {
    id: 6,
    day: "Jumat",
    title: "Seragam Muslim Sekolah",
    desc: "Untuk menumbuhkan karakter religius, setiap Jumat siswa mengenakan Seragam Muslim sesuai ketentuan sekolah.",
    image: jumat,
  },
  {
    id: 7,
    day: "Mapel PJOK",
    title: "Baju Olahraga",
    desc: "Agar nyaman bergerak saat pelajaran PJOK, siswa diwajibkan mengenakan baju olahraga resmi sekolah.",
    image: pjok,
  },
];

const Seragam = () => {
  const comp = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. HEADER ANIMATION (Pakai fromTo biar aman)
      const tlHeader = gsap.timeline();

      tlHeader
        .fromTo(
          ".header-pill",
          { y: -30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.7)" },
        )
        .fromTo(
          ".header-title",
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5",
        )
        .fromTo(
          ".header-desc",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out" },
          "-=0.6",
        );

      // 2. GRID ITEMS ANIMATION (Perbaikan Utama)
      // Menggunakan fromTo untuk memastikan elemen muncul dari opacity 0 ke 1
      gsap.fromTo(
        ".uniform-card",
        { y: 60, autoAlpha: 0 }, // State Awal (Invisible)
        {
          y: 0,
          autoAlpha: 1, // State Akhir (Visible)
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".gallery-section",
            start: "top 85%", // Trigger lebih awal
            toggleActions: "play none none reverse",
          },
        },
      );

      // 3. NOTE SECTION
      gsap.fromTo(
        ".note-card",
        { scale: 0.9, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".note-card",
            start: "top 90%",
          },
        },
      );

      // 4. ICON PULSE
      gsap.to(".info-icon-pulse", {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={comp}
      className="min-h-screen bg-gray-50 font-sans overflow-x-hidden"
    >
      {/* ==================== HEADER SECTION ==================== */}
      <div className="bg-white py-16 lg:py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="header-pill inline-block py-1 px-3 rounded-full bg-orange-100 text-primary text-sm font-bold mb-4 invisible">
            Tata Tertib
          </span>
          <h1 className="header-title text-4xl lg:text-5xl font-bold text-gray-900 mb-4 invisible">
            Seragam Sekolah
          </h1>
          <p className="header-desc text-gray-600 text-lg max-w-2xl mx-auto invisible">
            Ketentuan penggunaan seragam di SMK Diponegoro 1 Jakarta untuk
            menanamkan kedisiplinan dan kerapian siswa.
          </p>
        </div>
      </div>

      {/* ==================== GALLERY GRID ==================== */}
      <section className="gallery-section py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uniformData.map((item) => (
              <div
                key={item.id}
                // Class 'uniform-card' & 'invisible' (biar gak flicker di awal)
                className="uniform-card group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full hover:-translate-y-2 invisible"
              >
                {/* IMAGE CONTAINER */}
                <div className="relative h-80 overflow-hidden bg-gray-200">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-primary font-bold text-sm">
                      <Clock size={16} /> {item.day}
                    </span>
                  </div>

                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* CONTENT BOX */}
                <div className="p-6 flex flex-col flex-grow relative">
                  <div className="absolute top-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500 ease-out"></div>

                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <Shirt
                      size={20}
                      className="text-gray-300 group-hover:text-primary transition-colors"
                    />
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                    {item.desc}
                  </p>

                  <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                    <Info size={14} />
                    <span>Pastikan atribut lengkap</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ==================== NOTE TAMBAHAN ==================== */}
          <div className="note-card mt-16 bg-orange-50 border border-orange-100 rounded-xl p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left shadow-sm invisible">
            <div className="info-icon-pulse p-4 bg-white rounded-full shadow-md text-primary">
              <Info size={32} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                Catatan Penting Kedisiplinan
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Siswa yang tidak mengenakan seragam sesuai ketentuan jadwal
                tidak diperkenankan mengikuti kegiatan belajar mengajar (KBM)
                dan akan dikenakan sanksi poin pelanggaran sesuai tata tertib
                sekolah.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Seragam;
