import { Routes, Route } from "react-router-dom";

// --- Components & Layouts ---
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// --- Pages Public ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import Overview from "./pages/tentang/Overview";
import Sejarah from "./pages/tentang/Sejarah";
import Seragam from "./pages/tentang/Seragam";
import Fasilitas from "./pages/tentang/Fasilitas";
import Struktur from "./pages/tentang/Struktur";
import Guru from "./pages/tentang/Guru";
import Profil from "./pages/tentang/Profil";
import VisiMisi from "./pages/tentang/VisiMisi";
import Jurusan from "./pages/Jurusan/Jurusan";
import TKJ from "./pages/Jurusan/TKJ";
import DKV from "./pages/Jurusan/DKV";
import Artikel from "./pages/Artikel";
import DetailArtikel from "./pages/DetailArtikel";

// --- Pages Admin ---
import Dashboard from "./pages/admin/Dashboard";
import ManageArtikel from "./pages/admin/ManageArtikel";
import FormArtikel from "./pages/admin/FormArtikel";

// Komponen Placeholder
const PagePlaceholder = ({ title }) => (
  <div className="container mx-auto px-4 py-20 text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
    <p className="text-gray-600">Halaman ini sedang dalam pengembangan.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        {/* Tentang */}
        <Route path="/tentang" element={<Overview />} />
        <Route path="/tentang/profil" element={<Profil />} />
        <Route path="/tentang/visi-misi" element={<VisiMisi />} />
        <Route path="/tentang/sejarah" element={<Sejarah />} />
        <Route
          path="/tentang/osis"
          element={<PagePlaceholder title="OSIS" />}
        />
        <Route path="/tentang/seragam" element={<Seragam />} />
        <Route path="/tentang/fasilitas" element={<Fasilitas />} />
        <Route path="/tentang/struktur" element={<Struktur />} />
        <Route path="/tentang/guru" element={<Guru />} />

        {/* Jurusan */}
        <Route path="/jurusan" element={<Jurusan />} />
        <Route path="/jurusan/tkj" element={<TKJ />} />
        <Route path="/jurusan/dkv" element={<DKV />} />

        {/* Artikel & Lainnya */}
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/artikel/:id" element={<DetailArtikel />} />

        {/* PERBAIKAN: ROUTE /BKK DIHAPUS 
           Agar link di Navbar langsung mengarah ke folder public/bkk
        */}

        <Route path="/ppdb" element={<PagePlaceholder title="PPDB" />} />
      </Route>

      {/* Admin Panel */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="artikel" element={<ManageArtikel />} />
          <Route path="artikel/tambah" element={<FormArtikel />} />
          <Route path="artikel/edit/:id" element={<FormArtikel />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
