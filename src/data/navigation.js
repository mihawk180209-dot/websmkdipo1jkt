import { title } from "framer-motion/client";
import { Target } from "lucide-react";

// src/data/navigation.js
export const navLinks = [
  { title: "Home", path: "/" },
  {
    title: "Tentang Kami",
    path: "/tentang",
    submenu: [
      { title: "Overview Tentang Kami", path: "/tentang/overview" },
      { title: "Profil Sekolah", path: "/tentang/profil" },
      { title: "Visi & Misi", path: "/tentang/visi-misi" },
      { title: "Sejarah", path: "/tentang/sejarah" },
      { title: "Program Unggulan", path: "/tentang/program-unggulan" },
      {
        title: "OSIS",
        path: "https://osissmkdipo1jkt.vercel.app", // <--- Ganti link web OSIS di sini
        isExternal: true,
        target: "_blank", // <--- Penanda ini link keluar
      },
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
      { title: "Overview Program Keahlian", path: "/jurusan/jurusan" },
      { title: "Teknik Komputer & Jaringan", path: "/jurusan/tkj" },
      { title: "Desain Komunikasi Visual", path: "/jurusan/dkv" },
    ],
  },
  { title: "BKK", path: "/bkk" },
  { title: "PPDB", path: "/ppdb" },
];
