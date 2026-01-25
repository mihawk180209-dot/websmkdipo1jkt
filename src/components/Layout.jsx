import { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom"; // 1. Import Outlet
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const { pathname } = useLocation();

  // Scroll ke atas setiap pindah halaman
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* PERBAIKAN:
         Gunakan <Outlet /> untuk menampilkan konten halaman 
         sesuai route yang sedang aktif di App.jsx.
      */}
      <main className="flex-grow pt-20 lg:pt-24 relative z-0 isolation-isolate">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
