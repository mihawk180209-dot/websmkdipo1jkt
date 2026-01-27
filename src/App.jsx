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
import ProgramUnggulan from "./pages/tentang/ProgramUnggulan";
import DetailProgram from "./pages/DetailProgram";

// --- Pages Admin ---
import Dashboard from "./pages/admin/Dashboard";
import ManageArtikel from "./pages/admin/ManageArtikel";
import FormArtikel from "./pages/admin/FormArtikel";
import ManageGuru from "./pages/admin/ManageGuru";
import FormGuru from "./pages/admin/FormGuru";
import ManageSeragam from "./pages/admin/ManageSeragam";
import FormSeragam from "./pages/admin/FormSeragam";
import ManageFasilitas from "./pages/admin/ManageFasilitas";
import FormFasilitas from "./pages/admin/FormFasilitas";
import ManageProgram from "./pages/admin/ManageProgram";
import FormProgram from "./pages/admin/FormProgram";

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
        <Route path="/tentang/overview" element={<Overview />} />
        <Route path="/tentang/profil" element={<Profil />} />
        <Route path="/tentang/visi-misi" element={<VisiMisi />} />
        <Route path="/tentang/sejarah" element={<Sejarah />} />
        <Route path="tentang/program-unggulan" element={<ProgramUnggulan />} />
        <Route path="/program/:id" element={<DetailProgram />} />
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
          <Route path="/admin/guru" element={<ManageGuru />} />
          <Route path="/admin/guru/tambah" element={<FormGuru />} />
          <Route path="/admin/guru/edit/:id" element={<FormGuru />} />
          <Route path="/admin/seragam" element={<ManageSeragam />} />
          <Route path="/admin/seragam/tambah" element={<FormSeragam />} />
          <Route path="/admin/seragam/edit/:id" element={<FormSeragam />} />
          <Route path="/admin/fasilitas" element={<ManageFasilitas />} />
          <Route path="/admin/fasilitas/tambah" element={<FormFasilitas />} />
          <Route path="/admin/fasilitas/edit/:id" element={<FormFasilitas />} />
          <Route path="/admin/program" element={<ManageProgram />} />
          <Route path="/admin/program/tambah/" element={<FormProgram />} />
          <Route path="/admin/program/edit/:id" element={<FormProgram />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
