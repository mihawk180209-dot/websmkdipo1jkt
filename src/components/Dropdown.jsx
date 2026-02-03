// src/components/Dropdown.jsx
import { useState, useCallback, useId, memo } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";

// Terima prop 'closeMenu' di sini untuk menutup menu mobile
const Dropdown = ({ item, isMobile, closeMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const submenuId = useId();

  const toggleOpen = useCallback(() => setIsOpen((s) => !s), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const onTriggerKey = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleOpen();
      }
    },
    [toggleOpen],
  );

  // --- TAMPILAN MOBILE ---
  if (isMobile) {
    return (
      <div className="flex flex-col">
        <button
          onClick={toggleOpen}
          onKeyDown={onTriggerKey}
          aria-expanded={isOpen}
          aria-controls={submenuId}
          // Tetap ada px-4 biar sejajar sama link lain
          className="flex items-center justify-between w-full py-2 px-4 text-gray-700 font-medium hover:text-primary transition-colors"
        >
          {item.title}
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {/* Submenu Mobile */}
        <div
          id={submenuId}
          role="region"
          aria-hidden={!isOpen}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col pl-4 border-l-2 border-gray-100 space-y-2 ml-4">
            {item.submenu.map((subItem, idx) => (
              <SubMenuItem key={idx} item={subItem} closeMenu={closeMenu} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN DESKTOP (Hover) ---
  return (
    <div
      className="relative group"
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
    >
      {/* Trigger Button */}
      <button
        className={`flex items-center gap-1 px-4 py-2 font-medium rounded-full transition-colors duration-200 ${
          isOpen
            ? "text-primary bg-orange-50"
            : "text-gray-600 hover:text-primary hover:bg-gray-50"
        }`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={submenuId}
      >
        {item.title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 👇 PERBAIKAN "ANTI LICIN" (Jembatan Padding) */}
      <div
        id={submenuId}
        role="menu"
        className={`absolute top-full left-0 w-56 pt-4 z-50 transform transition-all duration-200 origin-top-left ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* 👇 DIV DALAM: Ini yang punya warna putih & kotak visual */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="py-2 flex flex-col">
            {item.submenu.map((subItem, idx) => (
              <SubMenuItem key={idx} item={subItem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN ITEM ---
const SubMenuItemComp = ({ item, closeMenu }) => {
  // Logic External Link
  if (item.isExternal || item.target === "_blank") {
    return (
      <a
        href={item.path}
        target={item.target || "_blank"}
        rel="noopener noreferrer"
        onClick={closeMenu} // 👇 Jalankan fungsi close saat diklik
        role="menuitem"
        className="block px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-primary transition-colors"
      >
        {item.title}
      </a>
    );
  }

  // Logic Internal Link
  return (
    <NavLink
      to={item.path}
      onClick={closeMenu} // 👇 Jalankan fungsi close saat diklik
      role="menuitem"
      className={({ isActive }) =>
        `block px-4 py-2 text-sm transition-colors ${
          isActive
            ? "text-primary bg-orange-50 font-medium"
            : "text-gray-600 hover:bg-orange-50 hover:text-primary"
        }`
      }
    >
      {item.title}
    </NavLink>
  );
};

const SubMenuItem = memo(SubMenuItemComp);

export default memo(Dropdown);
