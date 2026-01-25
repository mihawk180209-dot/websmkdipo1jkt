import { useState } from "react";
import { Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// IMPORT ASSETS
import fotoKepsek from "../../assets/Bu Ipeh.webp";
import fotoWakasekKur from "../../assets/Pak Rian.webp";
import fotoWakasekSis from "../../assets/Pak Fajar.webp";
import fotoDkv from "../../assets/Pak Izur.webp";
import fotoTkj from "../../assets/Pak Yan.webp";
import fotoPo1 from "../../assets/Pak Fad.webp";
import fotoPo2 from "../../assets/Pak Lily.webp";
import fotoPo3 from "../../assets/Bu Rani.webp";
import fotoPo4 from "../../assets/Pak Yoga.webp";
import inggris from "../../assets/Mam Trias.webp";
import pai from "../../assets/Pak Hasbi.webp";
import ipas from "../../assets/Bu Fenty.webp";
import tu2 from "../../assets/Pak Haikal.jpg";
import bakti from "../../assets/Pak Rusdi.jpg";
import bila from "../../assets/Bu Nabila.jpg";
import bk from "../../assets/Bu Syahra.jpg";
import dkv1 from "../../assets/Pak Bicky.webp";
import ppkn from "../../assets/Pak Wasro.webp";
import dkvtkj from "../../assets/Bu Savi.webp";
import dkv2 from "../../assets/Bu Pur.webp";

// --- DATA STAFF ---
const staffData = [
  // PIMPINAN
  {
    id: 1,
    name: "Nurlathifah, M.Pd.Gr",
    role: "Kepala Sekolah",
    category: "Pimpinan",
    image: fotoKepsek,
  },
  {
    id: 2,
    name: "M. Sulhan Ardananta",
    role: "Kepala Tata Usaha",
    category: "Pimpinan",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300",
  },
  // GURU
  {
    id: 3,
    name: "Rian Hidayat, M.Pd",
    role: "Wakasek Kurikulum & Guru MTK",
    category: "Guru",
    image: fotoWakasekKur,
  },
  {
    id: 4,
    name: "Fajar Andrian, S.Pd",
    role: "Wakasek Kesiswaan & Guru Sejarah",
    category: "Guru",
    image: fotoWakasekSis,
  },
  {
    id: 5,
    name: "M. Izurdi Ramadhan, A.Md",
    role: "Kaprog DKV",
    category: "Guru",
    image: fotoDkv,
  },
  {
    id: 6,
    name: "Yanuar Setyadi, S.Tr",
    role: "Kaprog TKJ",
    category: "Guru",
    image: fotoTkj,
  },
  {
    id: 7,
    name: "Trias Anggraeni, M.Pd",
    role: "Guru Bahasa Inggris",
    category: "Guru",
    image: inggris,
  },
  {
    id: 8,
    name: "Lili Rapikal, S.Pd",
    role: "Guru Matematika",
    category: "Guru",
    image: fotoPo2,
  },
  {
    id: 9,
    name: "Hasbialloh, S.Pd",
    role: "Guru Mapel PAI",
    category: "Guru",
    image: pai,
  },
  {
    id: 10,
    name: "Rani Nurhasanah, S.Pd",
    role: "Guru Mapel IPA",
    category: "Guru",
    image: fotoPo3,
  },
  {
    id: 11,
    name: "Fenty Kurniawati, S.Pd",
    role: "Guru Mapel IPAS",
    category: "Guru",
    image: ipas,
  },
  {
    id: 12,
    name: "Ananda Prayoga, S.Pd",
    role: "Guru Mapel PJOK",
    category: "Guru",
    image: fotoPo4,
  },
  {
    id: 13,
    name: "Kurniawan, S.Pd",
    role: "Guru Mapel B.Indonesia",
    category: "Guru",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    id: 14,
    name: "Syahra Azhar Kamila, S.Pd",
    role: "Guru Mapel BK/BP",
    category: "Guru",
    image: bk,
  },
  {
    id: 15,
    name: "Nabila Anisha, S.Pd",
    role: "Guru Mapel Informatika & PKK DKV",
    category: "Guru",
    image: bila,
  },
  {
    id: 16,
    name: "Wasro, S.Pd",
    role: "Guru Mapel PPKN",
    category: "Guru",
    image: ppkn,
  },
  {
    id: 17,
    name: "Fadil Wirawan, S.Ds",
    role: "Guru Kejuruan DKV",
    category: "Guru",
    image: fotoPo1,
  },
  {
    id: 18,
    name: "Imrothus Savinah, S.Kom",
    role: "Guru Kejuruan TKJ & DKV",
    category: "Guru",
    image: dkvtkj,
  },
  {
    id: 19,
    name: "Sirep Purwanti, M.T",
    role: "Guru Kejuruan DKV",
    category: "Guru",
    image: dkv2,
  },
  {
    id: 20,
    name: "Bicky Perdana, S.Kom",
    role: "Guru Kejuruan DKV",
    category: "Guru",
    image: dkv1,
  },
  // STAF
  {
    id: 21,
    name: "M. Haikal K, A.Md",
    role: "Staf Tata Usaha",
    category: "Staf",
    image: tu2,
  },
  {
    id: 22,
    name: "Rusdi",
    role: "Petugas Kebersihan",
    category: "Staf",
    image: bakti,
  },
];

const Guru = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");

  // Filter Logic
  const filteredData = staffData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "Semua" || item.category === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HERO HEADER */}
      <div className="bg-white pt-16 pb-12 border-b border-gray-100">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-primary text-sm font-bold mb-4">
            SDM Unggul
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Guru & Staf
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Berkenalan dengan tenaga pendidik dan kependidikan profesional yang
            siap membimbing siswa SMK Diponegoro 1 Jakarta.
          </p>

          {/* SEARCH & FILTER BAR */}
          <motion.div
            className="mt-10 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Tabs Filter */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
              {["Semua", "Pimpinan", "Guru", "Staf"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all relative ${
                    activeTab === tab
                      ? "text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {/* Animasi Background Tab (Sliding Effect) */}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-md shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari nama atau mapel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* GRID DISPLAY */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Layout prop di sini penting agar container grid menyesuaikan tinggi dengan smooth */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          >
            {/* AnimatePresence menangani animasi saat item dihapus dari list (exit animation) */}
            <AnimatePresence mode="popLayout">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <motion.div
                    layout // Kartu akan bergeser otomatis (shuffle)
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }} // Efek hover fisik
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group flex flex-col items-center text-center cursor-default"
                  >
                    {/* Image Container with Ring */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-orange-300 blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
                      <div className="w-32 h-32 rounded-full p-1 bg-white relative z-10">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full rounded-full object-cover border-2 border-gray-100 group-hover:border-primary transition-colors"
                        />
                      </div>

                      {/* Badge Category */}
                      <span
                        className={`absolute bottom-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-full z-20 border-2 border-white
                          ${
                            item.category === "Pimpinan"
                              ? "bg-purple-500"
                              : item.category === "Guru"
                              ? "bg-primary"
                              : "bg-gray-500"
                          }
                        `}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Text Info */}
                    <h3
                      className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 w-full"
                      title={item.name}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-1 mb-4 h-10 flex items-center justify-center line-clamp-2 w-full">
                      {item.role}
                    </p>

                    {/* Button Profile (Fade-in saat hover) */}
                    <button className="mt-auto text-sm font-bold text-primary bg-orange-50 hover:bg-primary hover:text-white px-6 py-2 rounded-full transition-all w-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                      Lihat Profil
                    </button>
                  </motion.div>
                ))
              ) : (
                // Empty State Animation
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full text-center py-20"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                    <User size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Tidak ditemukan
                  </h3>
                  <p className="text-gray-500">
                    Coba cari dengan kata kunci lain.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Guru;
