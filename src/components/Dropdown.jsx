import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Dropdown = ({ item, isMobile, closeMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdown when clicking outside (Desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (!isMobile) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  // Check if any child is active
  const isActiveParent = item.submenu?.some(
    (sub) => sub.path === location.pathname
  );

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${isMobile ? "w-full" : ""}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`
          flex items-center justify-between w-full font-medium transition-colors duration-200
          ${
            isMobile
              ? "py-3 px-4 hover:bg-orange-50"
              : "px-3 py-2 hover:text-primary"
          }
          ${isActiveParent ? "text-primary font-bold" : "text-gray-700"}
        `}
      >
        {item.title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`
          ${
            isMobile
              ? "relative bg-gray-50 border-l-2 border-primary ml-4"
              : "absolute top-full left-0 mt-2 w-56 bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden"
          }
          transition-all duration-300 ease-in-out origin-top z-50
          ${
            isOpen
              ? "opacity-100 scale-y-100 max-h-96"
              : "opacity-0 scale-y-0 max-h-0"
          }
        `}
      >
        <div className={isMobile ? "py-1" : "py-2"}>
          {/* Direct Link to Parent Page (Optional, for easy access) */}
          <NavLink
            to={item.path}
            onClick={closeMenu}
            className={({ isActive }) => `
                block text-sm transition-colors
                ${
                  isMobile
                    ? "py-2 px-4"
                    : "px-4 py-2 hover:bg-orange-50 hover:text-primary"
                }
                ${
                  isActive
                    ? "text-primary font-semibold bg-orange-50"
                    : "text-gray-600"
                }
              `}
          >
            Overview {item.title}
          </NavLink>

          {item.submenu.map((sub, idx) => (
            <NavLink
              key={idx}
              to={sub.path}
              onClick={closeMenu}
              className={({ isActive }) => `
                block text-sm transition-colors
                ${
                  isMobile
                    ? "py-2 px-4"
                    : "px-4 py-2 hover:bg-orange-50 hover:text-primary"
                }
                ${
                  isActive
                    ? "text-primary font-semibold bg-orange-50"
                    : "text-gray-600"
                }
              `}
            >
              {sub.title}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
