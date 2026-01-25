import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { FileText, Database, Plus, ArrowRight, Activity } from "lucide-react";

const Dashboard = () => {
  const [articleCount, setArticleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count, error } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error ambil data:", error);
    } else {
      setArticleCount(count);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Dashboard
        </h2>
        <p className="text-slate-500 mt-2 text-lg">
          Ringkasan aktivitas website Anda hari ini.
        </p>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* KARTU 1: Total Artikel */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">
                Total Artikel
              </p>
              <h3 className="text-4xl font-bold text-slate-800">
                {loading ? (
                  <span className="animate-pulse bg-slate-200 h-10 w-16 block rounded"></span>
                ) : (
                  articleCount
                )}
              </h3>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <FileText size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-400">
            <span className="text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded-full mr-2">
              Live
            </span>
            Data terupdate
          </div>
        </div>

        {/* KARTU 2: Status Server */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">
                Status Database
              </p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <h3 className="text-2xl font-bold text-slate-800">Online</h3>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Database size={24} />
            </div>
          </div>
          <div className="mt-6 text-xs text-slate-400">
            Koneksi Supabase stabil
          </div>
        </div>

        {/* KARTU 3: Placeholder/Greeting */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div>
            <p className="text-slate-300 text-sm font-medium mb-1">Aktivitas</p>
            <h3 className="text-xl font-semibold">Selamat Bekerja!</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300 mt-4">
            <Activity size={16} /> Panel Admin v1.0
          </div>
        </div>
      </div>

      {/* Bagian Quick Actions */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Mulai Menulis
            </h3>
            <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
              Buat artikel baru untuk meningkatkan engagement pembaca atau
              kelola konten yang sudah ada.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Link to="/admin/artikel/tambah" className="flex-1 md:flex-none">
              <button className="w-full md:w-auto bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-200 transition-all flex items-center justify-center gap-2 group">
                <Plus
                  size={18}
                  className="group-hover:rotate-90 transition-transform"
                />
                Buat Artikel
              </button>
            </Link>
            <Link to="/admin/artikel" className="flex-1 md:flex-none">
              <button className="w-full md:w-auto bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group">
                Kelola
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
