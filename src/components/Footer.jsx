import { NavLink } from "react-router-dom";
import { memo, useMemo } from "react";
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
  const socialLinks = useMemo(
    () => [
      {
        href: "https://www.instagram.com/smk_diponegoro1",
        label: "Instagram",
        icon: Instagram,
        bg: "bg-gray-800 hover:bg-pink-600",
      },
      {
        href: "https://www.facebook.com/smkdiponegoro1",
        label: "Facebook",
        icon: Facebook,
        bg: "bg-gray-800 hover:bg-blue-600",
      },
      {
        href: "https://www.youtube.com/@SMKDipo1",
        label: "YouTube",
        icon: Youtube,
        bg: "bg-gray-800 hover:bg-red-600",
      },
    ],
    [],
  );

  const quickLinks = useMemo(
    () => [
      { to: "/tentang/profil", label: "Profil Sekolah" },
      { to: "/jurusan", label: "Program Keahlian" },
      { to: "/artikel", label: "Berita & Artikel" },
      {
        href: "https://bkk-dipo.vercel.app/",
        label: "Bursa Kerja (BKK)",
        external: true,
      },
    ],
    [],
  );

  return (
    <footer
      className="bg-gray-900 text-gray-300 pt-20 pb-10 border-t border-gray-800"
      role="contentinfo"
    >
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
              {socialLinks.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center text-white transition-all duration-300 group`}
                  >
                    <Icon
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* KOLOM 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Tautan Cepat</h4>
            <ul className="space-y-3 text-sm" aria-label="Tautan Cepat">
              {quickLinks.map((ql, idx) => (
                <li key={idx}>
                  {ql.external ? (
                    <a
                      href={ql.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors flex items-center gap-2 group"
                      title={ql.label}
                    >
                      <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-primary transition-colors"></span>
                      {ql.label}
                    </a>
                  ) : (
                    <NavLink
                      to={ql.to}
                      className="hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-primary transition-colors"></span>
                      {ql.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* KOLOM 3: Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Hubungi Kami</h4>
            <address className="space-y-4 text-sm not-italic">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-400">
                  Jl. Sunan Giri No. 5, RT.8/RW.15, Rawamangun, Kec. Pulo
                  Gadung, Jakarta Timur, Indonesia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <a
                  href="tel:+62214702446"
                  className="text-gray-400 hover:text-white"
                >
                  (021) 4702446
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <a
                  href="mailto:humas.smkdipo1@gmail.com"
                  className="text-gray-400 hover:text-white"
                >
                  humas.smkdipo1@gmail.com
                </a>
              </div>
            </address>
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

export default memo(Footer);
