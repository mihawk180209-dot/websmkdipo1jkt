import { Suspense, lazy } from "react"; // 1. Import ini
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Import ikon loading

// --- Components & Layouts ---
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopFade from "./components/ScrollToTopFade";

// --- 2. Ganti Import Biasa jadi Lazy Import ---
// Pages Public
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Overview = lazy(() => import("./pages/tentang/Overview"));
const Sejarah = lazy(() => import("./pages/tentang/Sejarah"));
const Seragam = lazy(() => import("./pages/tentang/Seragam"));
const Fasilitas = lazy(() => import("./pages/tentang/Fasilitas"));
const Struktur = lazy(() => import("./pages/tentang/Struktur"));
const Guru = lazy(() => import("./pages/tentang/Guru"));
const Profil = lazy(() => import("./pages/tentang/Profil"));
const VisiMisi = lazy(() => import("./pages/tentang/VisiMisi"));
const Jurusan = lazy(() => import("./pages/Jurusan/Jurusan"));
const TKJ = lazy(() => import("./pages/Jurusan/TKJ"));
const DKV = lazy(() => import("./pages/Jurusan/DKV"));
const Artikel = lazy(() => import("./pages/Artikel"));
const DetailArtikel = lazy(() => import("./pages/DetailArtikel"));
const ProgramUnggulan = lazy(() => import("./pages/tentang/ProgramUnggulan"));
const DetailProgram = lazy(() => import("./pages/DetailProgram"));

// Pages Admin (Ini PENTING banget di-lazy load biar user biasa gak perlu download codingan admin)
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageArtikel = lazy(() => import("./pages/admin/ManageArtikel"));
const FormArtikel = lazy(() => import("./pages/admin/FormArtikel"));
const ManageGuru = lazy(() => import("./pages/admin/ManageGuru"));
const FormGuru = lazy(() => import("./pages/admin/FormGuru"));
const ManageSeragam = lazy(() => import("./pages/admin/ManageSeragam"));
const FormSeragam = lazy(() => import("./pages/admin/FormSeragam"));
const ManageFasilitas = lazy(() => import("./pages/admin/ManageFasilitas"));
const FormFasilitas = lazy(() => import("./pages/admin/FormFasilitas"));
const ManageProgram = lazy(() => import("./pages/admin/ManageProgram"));
const FormProgram = lazy(() => import("./pages/admin/FormProgram"));
const ManagePopup = lazy(() => import("./pages/admin/ManagePopup"));
const FormPopup = lazy(() => import("./pages/admin/PopupForm"));
const FormStruktur = lazy(() => import("./pages/admin/FormStruktur"));
const ManageStruktur = lazy(() => import("./pages/admin/ManageStruktur"));
const ManageTkj = lazy(() => import("./pages/admin/ManageTkj"));
const FormTkj = lazy(() => import("./pages/admin/FormTkj"));
const ManageDkv = lazy(() => import("./pages/admin/ManageDkv"));
const FormDkv = lazy(() => import("./pages/admin/FormDkv"));
// Loading Component (Muncul pas pindah halaman)
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
    <Loader2 className="animate-spin text-orange-600 w-12 h-12 mb-4" />
    <p className="text-slate-500 font-medium animate-pulse">
      Memuat halaman...
    </p>
  </div>
);

const PagePlaceholder = ({ title }) => (
  <div className="container mx-auto px-4 py-20 text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
    <p className="text-gray-600">Halaman ini sedang dalam pengembangan.</p>
  </div>
);

function App() {
  return (
    <>
      {/* Komponen ScrollToTop untuk otomatis scroll ke atas saat pindah halaman */}
      <ScrollToTop />

      {/* 3. Bungkus Routes dengan Suspense */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            {/* ... Route lainnya sama persis seperti sebelumnya ... */}
            <Route path="/tentang/overview" element={<Overview />} />
            <Route path="/tentang/profil" element={<Profil />} />
            <Route path="/tentang/visi-misi" element={<VisiMisi />} />
            <Route path="/tentang/sejarah" element={<Sejarah />} />
            <Route
              path="tentang/program-unggulan"
              element={<ProgramUnggulan />}
            />
            <Route path="/program/:id" element={<DetailProgram />} />
            <Route
              path="/tentang/osis"
              element={<PagePlaceholder title="OSIS" />}
            />
            <Route path="/tentang/seragam" element={<Seragam />} />
            <Route path="/tentang/fasilitas" element={<Fasilitas />} />
            <Route path="/tentang/struktur" element={<Struktur />} />
            <Route path="/tentang/guru" element={<Guru />} />
            <Route path="/jurusan/jurusan" element={<Jurusan />} />
            <Route path="/jurusan/tkj" element={<TKJ />} />
            <Route path="/jurusan/dkv" element={<DKV />} />
            <Route path="/artikel" element={<Artikel />} />
            <Route path="/artikel/:id" element={<DetailArtikel />} />
            <Route path="/ppdb" element={<PagePlaceholder title="PPDB" />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              {/* ... Route Admin juga sama ... */}
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
              <Route
                path="/admin/fasilitas/tambah"
                element={<FormFasilitas />}
              />
              <Route
                path="/admin/fasilitas/edit/:id"
                element={<FormFasilitas />}
              />
              <Route path="/admin/program" element={<ManageProgram />} />
              <Route path="/admin/program/tambah/" element={<FormProgram />} />
              <Route path="/admin/program/edit/:id" element={<FormProgram />} />
              <Route path="/admin/popup" element={<ManagePopup />} />
              <Route path="/admin/popup/new" element={<FormPopup />} />
              <Route path="/admin/popup/edit/:id" element={<FormPopup />} />
              <Route path="/admin/struktur" element={<ManageStruktur />} />
              <Route
                path="/admin/struktur/tambah"
                element={<FormStruktur />}
              ></Route>
              <Route
                path="/admin/struktur/edit/:id"
                element={<FormStruktur />}
              ></Route>
              <Route path="/admin/tkj" element={<ManageTkj />} />
              <Route path="/admin/tkj/form/:id" element={<FormTkj />}></Route>
              <Route path="/admin/tkj/form" element={<FormTkj />}></Route>
              <Route path="/admin/dkv" element={<ManageDkv />} />
              <Route path="/admin/dkv/edit/:id" element={<FormDkv />}></Route>
              <Route path="/admin/dkv/tambah" element={<FormDkv />}></Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
