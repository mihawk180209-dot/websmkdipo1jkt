import { NavLink } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Youtube,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10 border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-8">
        {/* GRID UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
          {/* KOLOM 1: Brand & About */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-extrabold text-white mb-6 tracking-tight">
              SMK DIPO 1
            </h3>
            <p className="text-gray-400 leading-relaxed mb-8 text-sm">
              Mewujudkan generasi muda yang berkarakter kuat, berkarya nyata,
              dan menguasai teknologi masa depan untuk Indonesia Maju.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/smk_diponegoro1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 group"
              >
                <Instagram
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
              <a
                href="https://www.facebook.com/smkdiponegoro1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 group"
              >
                <Facebook
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
              <a
                href="https://www.youtube.com/@SMKDipo1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 group"
              >
                <Youtube
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
            </div>
          </div>

          {/* KOLOM 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Tautan Cepat</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <NavLink
                  to="/tentang/profil"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Profil Sekolah
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/jurusan"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Program Keahlian
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/artikel"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Berita & Artikel
                </NavLink>
              </li>
              <li>
                <a
                  href="https://bkk-dipo.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Bursa Kerja (BKK)
                </a>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-400">
                  Jl. Sunan Giri No. 5, RT.8/RW.15, Rawamangun, Kec. Pulo
                  Gadung, Jakarta Timur, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <span className="text-gray-400">(021) 4702446</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <span className="text-gray-400">humas.smkdipo1@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* KOLOM 4: CTA PPDB (Highlight) */}
          <div className="self-start">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h4 className="text-white font-bold mb-2">
                Pendaftaran Siswa Baru
              </h4>
              <p className="text-xs text-gray-400 mb-4">
                Bergabunglah bersama kami dan raih masa depan gemilang.
              </p>
              <a
                href="https://ppdb-smkdipo1.perguruandiponegoro.sch.id/home"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-primary text-white text-center font-bold text-sm rounded-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 group"
              >
                Daftar Sekarang{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} SMK Diponegoro 1 Jakarta. All
            rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
