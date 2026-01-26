import { useState, useEffect } from "react";
import { Search, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase"; // Sesuaikan path ini

const Guru = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");

  // --- 1. FETCH DATA DARI SUPABASE ---
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    // Ambil data dari tabel 'teachers' (sesuaikan nama tabel kakak)
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("id", { ascending: true }); // Bisa diganti order by name

    if (error) {
      console.error("Error fetching teachers:", error);
    } else {
      setTeachers(data || []);
    }
    setLoading(false);
  };

  // --- 2. FILTER LOGIC ---
  const filteredData = teachers.filter((item) => {
    // Search (Case insensitive)
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase());

    // Tab Category Filter
    // Pastikan di database kolom 'category' isinya: "Pimpinan", "Guru", atau "Staf"
    const matchesTab = activeTab === "Semua" || item.category === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* HERO HEADER */}
      <div className="bg-white pt-24 pb-12 border-b border-gray-100 px-6">
        <motion.div
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-4">
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
            <div className="flex p-1 bg-gray-100 rounded-lg overflow-x-auto max-w-full">
              {["Semua", "Pimpinan", "Guru", "Staf"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all relative whitespace-nowrap ${
                    activeTab === tab
                      ? "text-orange-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
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
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* GRID DISPLAY */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          {/* LOADING STATE */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2
                className="animate-spin text-orange-500 mb-4"
                size={40}
              />
              <p className="text-gray-500 font-medium">Memuat Data Guru...</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group flex flex-col items-center text-center cursor-default"
                    >
                      {/* Image Container */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-300 blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
                        <div className="w-32 h-32 rounded-full p-1 bg-white relative z-10">
                          <img
                            src={
                              item.image_url ||
                              "https://via.placeholder.com/150?text=No+Image"
                            }
                            alt={item.name}
                            className="w-full h-full rounded-full object-cover border-2 border-gray-100 group-hover:border-orange-500 transition-colors"
                          />
                        </div>

                        {/* Badge Category */}
                        <span
                          className={`absolute bottom-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-full z-20 border-2 border-white
                            ${
                              item.category === "Pimpinan"
                                ? "bg-purple-500"
                                : item.category === "Guru"
                                  ? "bg-orange-500"
                                  : "bg-gray-500"
                            }
                          `}
                        >
                          {item.category}
                        </span>
                      </div>

                      {/* Text Info */}
                      <h3
                        className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 w-full"
                        title={item.name}
                      >
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium mt-1 mb-4 h-10 flex items-center justify-center line-clamp-2 w-full">
                        {item.role}
                      </p>

                      {/* Button Profile */}
                      <button className="mt-auto text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white px-6 py-2 rounded-full transition-all w-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                        Lihat Profil
                      </button>
                    </motion.div>
                  ))
                ) : (
                  // Empty State
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
          )}
        </div>
      </section>
    </div>
  );
};

export default Guru;
