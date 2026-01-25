import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import fotoKepsek from "../../assets/Bu Ipeh.webp";
import fotoWakasekKur from "../../assets/Pak Rian.webp";
import fotoWakasekSis from "../../assets/Pak Fajar.webp";
import fotoDkv from "../../assets/Pak Izur.webp";
import fotoTkj from "../../assets/Pak Yan.webp";
import fotoPo1 from "../../assets/Pak Fad.webp";
import fotoPo2 from "../../assets/Pak Lily.webp";
import fotoPo3 from "../../assets/Bu Rani.webp";
import fotoPo4 from "../../assets/Pak Yoga.webp";

// --- DATA PEGAWAI (Sama seperti sebelumnya) ---
const structData = {
  kepsek: {
    name: "Nurlathifah, M.Pd.Gr",
    role: "Kepala Sekolah",
    img: fotoKepsek,
  },
  ktu: {
    name: "M. Sulhan Ardananta, S.Hub. Int",
    role: "Kepala TU",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300",
  },
  waka: [
    {
      name: "Rian Hidayat, M.Pd",
      role: "Wakasek Kurikulum",
      img: fotoWakasekKur,
    },
    {
      name: "Fajar Andrian, S.Pd",
      role: "Wakasek Kesiswaan",
      img: fotoWakasekSis,
    },
  ],
  kaprog: [
    {
      name: "M. Izurdi Ramadhan, A.Md",
      role: "Kaprog DKV",
      img: fotoDkv,
    },
    {
      name: "Yanuar Setyadi, S.Tr",
      role: "Kaprog TKJ",
      img: fotoTkj,
    },
    {
      name: "Rian Hidayat, M.Pd",
      role: "Ka Hubin Industri",
      img: fotoWakasekKur,
    },
  ],
  pembina: [
    {
      name: "Fadil Wirawan, S.Ds",
      role: "Pembina OSIS",
      img: fotoPo1,
    },
    {
      name: "Lili Rapikal, S.Pd",
      role: "Pembina OSIS",
      img: fotoPo2,
    },
    {
      name: "Rani Nurhasanah, S.Pd",
      role: "Pembina OSIS",
      img: fotoPo3,
    },
    {
      name: "Ananda Prayoga, S.Pd",
      role: "Pembina OSIS",
      img: fotoPo4,
    },
  ],
};

// --- KOMPONEN KARTU ---
const OrgCard = ({ data, isMain = false }) => (
  <div
    className={`flex flex-col items-center bg-white rounded-xl shadow-lg border-t-4 border-primary p-4 md:p-6 relative z-10 transition-transform hover:-translate-y-1 w-full max-w-[250px] md:w-64 mx-auto ${
      isMain ? "ring-4 ring-orange-100" : ""
    }`}
  >
    <div className="w-20 h-20 md:w-24 md:h-24 mb-3 md:mb-4 rounded-full p-1 border-2 border-dashed border-primary">
      <img
        src={data.img}
        alt={data.name}
        className="w-full h-full rounded-full object-cover"
      />
    </div>
    <h4 className="text-primary font-bold text-base md:text-lg text-center leading-tight mb-1">
      {data.role}
    </h4>
    <p className="text-gray-700 font-medium text-xs md:text-sm text-center line-clamp-2">
      {data.name}
    </p>
  </div>
);

// --- KOMPONEN GARIS VERTIKAL (Responsive) ---
const VLine = ({ height = "h-8 md:h-12" }) => (
  <div className={`w-0.5 bg-gray-300 ${height} mx-auto`}></div>
);

const Struktur = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <div className="bg-white py-12 md:py-16 border-b border-gray-100 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Struktur Organisasi
          </h1>
          <p className="text-gray-600">
            Bagan Fungsional SMK Diponegoro 1 Jakarta
          </p>
        </div>
      </div>

      {/* CHART CONTAINER - Responsive handling */}
      <div className="container mx-auto px-4 mt-8 md:mt-12">
        {/*
            Di Mobile: Flex-col (Vertikal).
            Di Desktop (md+): Flex-col tapi elemen di dalamnya diatur secara horizontal.
        */}
        <div className="flex flex-col items-center w-full">
          {/* LEVEL 1: KEPSEK */}
          <OrgCard data={structData.kepsek} isMain={true} />
          <VLine />

          {/* LEVEL 2: KEPALA TU */}
          <OrgCard data={structData.ktu} />
          <VLine />

          {/* LEVEL 3: WAKASEK (Grid di Mobile, Flex di Desktop) */}
          <div className="w-full flex flex-col items-center relative">
            {/* Konektor Horizontal Desktop */}
            <div className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 w-[50%] h-12 border-t-2 border-x-2 border-gray-300 rounded-t-xl"></div>

            <div className="grid grid-cols-1 md:flex md:justify-center md:gap-16 w-full max-w-lg md:max-w-none gap-6 relative">
              {structData.waka.map((person, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center relative w-full"
                >
                  {/* Konektor Vertical Desktop */}
                  <div className="hidden md:block h-8 w-0.5 bg-gray-300 absolute -top-8"></div>

                  {/* Konektor Vertical Mobile (kecuali item pertama) */}
                  {idx > 0 && (
                    <div className="md:hidden h-6 w-0.5 bg-gray-300 -mt-6 mb-0 mx-auto"></div>
                  )}

                  <OrgCard data={person} />
                </div>
              ))}
            </div>
          </div>

          {/* CONNECTOR TO NEXT LEVEL */}
          <VLine height="h-8 md:h-12 md:-mt-8" />
          {/* Note: di desktop margin negatif menarik garis ke atas agar nyambung, di mobile normal */}

          {/* LEVEL 4: KAPROG & HUBIN */}
          <div className="w-full flex flex-col items-center relative">
            <div className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 w-[70%] h-12 border-t-2 border-x-2 border-gray-300 rounded-t-xl"></div>

            <div className="grid grid-cols-1 md:flex md:justify-center md:gap-8 w-full max-w-lg md:max-w-none gap-6 relative">
              {structData.kaprog.map((person, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center relative w-full"
                >
                  <div className="hidden md:block h-8 w-0.5 bg-gray-300 absolute -top-8"></div>
                  {idx > 0 && (
                    <div className="md:hidden h-6 w-0.5 bg-gray-300 -mt-6 mb-0 mx-auto"></div>
                  )}
                  <OrgCard data={person} />
                </div>
              ))}
            </div>
          </div>

          <VLine height="h-8 md:h-12 md:-mt-8" />

          {/* LEVEL 5: PEMBINA OSIS */}
          <div className="w-full flex flex-col items-center relative">
            <div className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 w-[80%] h-12 border-t-2 border-x-2 border-gray-300 rounded-t-xl"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:justify-center md:gap-6 w-full max-w-lg md:max-w-none gap-6 relative">
              {structData.pembina.map((person, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center relative w-full"
                >
                  <div className="hidden md:block h-8 w-0.5 bg-gray-300 absolute -top-8"></div>
                  {/* Mobile Grid Connector Logic: Rumit untuk grid 2 kol, jadi kita sederhanakan tanpa garis antar item grid di mobile, cukup margin */}
                  <OrgCard data={person} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: GURU & TENDIK */}
      <div className="container mx-auto px-4 mt-16 md:mt-20 max-w-4xl text-center">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-8 md:p-10 shadow-xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <Users size={48} className="mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Guru & Tenaga Kependidikan
            </h2>
            <p className="mb-8 text-orange-100 text-sm md:text-base">
              Seluruh Tenaga Pendidik dan Kependidikan SMK Diponegoro 1 Jakarta
            </p>
            <Link
              to="/tentang/guru"
              className="inline-block px-8 py-3 bg-white text-primary font-bold rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-sm md:text-base"
            >
              Lihat Daftar Lengkap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Struktur;
