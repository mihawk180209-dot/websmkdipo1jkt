import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Menu,
  X,
  Globe,
  Users,
  Shirt,
  Monitor,
  Layers,
  BellRing,
  UserRoundPen,
  Bot,
  Palette,
  // <--- TAMBAHAN ICON BARU
} from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Helper untuk cek active link (termasuk sub-route)
  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") {
      return "bg-teal-600 text-white shadow-md shadow-teal-200";
    }
    return location.pathname.startsWith(path) && path !== "/admin"
      ? "bg-teal-600 text-white shadow-md shadow-teal-200"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900";
  };

  const handleLogout = async () => {
    const confirm = window.confirm(
      "Apakah Anda yakin ingin keluar dari Admin Panel?",
    );

    if (confirm) {
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-teal-600 to-teal-400 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-500/30">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Admin<span className="text-teal-600">Panel</span>
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Menu Utama
          </p>

          {/* DASHBOARD */}
          <Link
            to="/admin"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(
              "/admin",
            )}`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={20} />
              Dashboard
            </div>
          </Link>

          {/* ARTIKEL */}
          <Link
            to="/admin/artikel"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(
              "/admin/artikel",
            )}`}
          >
            <div className="flex items-center gap-3">
              <FileText size={20} />
              Kelola Artikel
            </div>
          </Link>

          {/* DATA GURU & STAF */}
          <Link
            to="/admin/guru"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(
              "/admin/guru",
            )}`}
          >
            <div className="flex items-center gap-3">
              <Users size={20} />
              Data Guru & Staf
            </div>
          </Link>

          {/* SERAGAM */}
          <Link
            to="/admin/seragam"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(
              "/admin/seragam",
            )}`}
          >
            <Shirt size={20} />
            Kelola Seragam
          </Link>

          {/* FASILITAS */}
          <Link
            to="/admin/fasilitas"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(
              "/admin/fasilitas",
            )}`}
          >
            <Monitor size={20} />
            Fasilitas Sekolah
          </Link>

          {/* PROGRAM UNGGULAN (BARU DISINI) */}
          <Link
            to="/admin/program"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(
              "/admin/program",
            )}`}
          >
            <Layers size={20} />
            Program Unggulan
          </Link>
          {/* PROMO POPUP */}
          <Link
            to="/admin/popup"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(
              "/admin/popup",
            )}`}
          >
            <BellRing size={20} />
            Popup Promo
          </Link>

          <Link
            to="/admin/struktur"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(
              "/admin/struktur",
            )}`}
          >
            <UserRoundPen size={20} />
            Struktur Organisasi
          </Link>

          <Link
            to="/admin/tkj"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(
              "/admin/tkj",
            )}`}
          >
            <Bot size={20} />
            Materi TKJ
          </Link>

          <Link
            to="/admin/dkv"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(
              "/admin/dkv",
            )}`}
          >
            <Palette size={20} />
            Materi DKV
          </Link>

          {/* BAGIAN AKUN */}
          <div className="pt-8 mt-8 border-t border-slate-100 space-y-2">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Akun & Navigasi
            </p>

            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-slate-500 rounded-xl hover:bg-slate-50 hover:text-teal-600 transition-colors"
            >
              <Globe size={20} />
              Lihat Website Utama
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-slate-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors group text-left"
            >
              <LogOut
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Keluar (Logout)
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:hidden sticky top-0 z-30">
          <div className="font-bold text-slate-800">Dashboard</div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
