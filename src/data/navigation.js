// src/data/navigation.js
export const navLinks = [
  { title: "Home", path: "/" },
  {
    title: "Tentang Kami",
    path: "/tentang",
    submenu: [
      { title: "Profil Sekolah", path: "/tentang/profil" },
      { title: "Visi & Misi", path: "/tentang/visi-misi" },
      { title: "Sejarah", path: "/tentang/sejarah" },
      { title: "OSIS", path: "/tentang/osis" },
      { title: "Seragam", path: "/tentang/seragam" },
      { title: "Fasilitas", path: "/tentang/fasilitas" },
      { title: "Struktur Organisasi", path: "/tentang/struktur" },
      { title: "Guru & Staf", path: "/tentang/guru" },
    ],
  },
  { title: "Artikel", path: "/artikel" },
  {
    title: "Program Keahlian",
    path: "/jurusan",
    submenu: [
      { title: "Teknik Komputer & Jaringan", path: "/jurusan/tkj" },
      { title: "Desain Komunikasi Visual", path: "/jurusan/dkv" },
    ],
  },
  { title: "BKK", path: "/bkk" },
  { title: "PPDB", path: "/ppdb" },
];
