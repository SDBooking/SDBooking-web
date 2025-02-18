import useAccountContext from "../../contexts/AccountContext";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getLogout } from "../../apis/logout";
import { ClientRouteKey, LocalStorageKey } from "../../constants/keys";
import { ListBulletIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Divider } from "@mui/material";

function Navbar() {
  const { setAccountData, accountData } = useAccountContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await getLogout();
    setAccountData(null);
    localStorage.removeItem(LocalStorageKey.Auth);
  };

  const navigationItems = [
    {
      to: ClientRouteKey.Home,
      icon: "/imgs/calendar.svg", // Updated with imgSrc
      label: "ปฎิทินการจองห้อง",
    },
    {
      to: ClientRouteKey.Book,
      icon: "/imgs/bookmark.svg", // Updated with imgSrc
      label: "จองห้อง",
    },
    {
      to: ClientRouteKey.History,
      icon: "/imgs/mailbox.svg", // Updated with imgSrc
      label: "รายการของคุณ",
    },
    ...(accountData?.isAdmin
      ? [
          {
            to: ClientRouteKey.RoomManagement,
            icon: "/imgs/setting.svg", // Updated with imgSrc
            label: "จัดการห้อง",
          },
          {
            to: ClientRouteKey.UserSetting,
            icon: "/imgs/usersetting.svg", // Updated with imgSrc
            label: "จัดการผู้ใช้",
          },
        ]
      : []),
  ];

  const externalLinks = [
    {
      href: "https://forms.office.com/r/y0jCJG50qu",
      icon: "/imgs/feedback.svg", // Updated with imgSrc
      label: "แบบสอบถาม",
    },
    {
      href: "https://forms.gle/urK2QyhZDYZoFcNf6",
      icon: "/imgs/report.svg", // Updated with imgSrc
      label: "รายงานปัญหา",
    },
  ];

  const NavItem = ({
    to,
    icon,
    label,
  }: {
    to: string;
    icon: string; // Changed to string for imgSrc
    label: string;
  }) => (
    <li className="w-full">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-xl transition-colors
          ${
            isActive
              ? "text-orange-600 bg-orange-50 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <img src={icon} alt={label} className="w-6 h-6" />{" "}
        {/* Updated to use imgSrc */}
        <span className="text-sm">{label}</span>
      </NavLink>
    </li>
  );

  const ExternalLinkItem = ({
    href,
    icon,
    label,
  }: {
    href: string;
    icon: string; // Changed to string for imgSrc
    label: string;
  }) => (
    <li className="w-full">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <img src={icon} alt={label} className="w-6 h-6" />{" "}
        {/* Updated to use imgSrc */}
        <span className="text-sm">{label}</span>
      </a>
    </li>
  );

  return (
    <>
      {/* Top Navbar for Mobile */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex items-center justify-center overflow-hidden rounded-full bg-transparent shadow-lg transition-all duration-300 w-12 h-12 hover:bg-gray-50`}
        >
          <div className="flex items-center gap-2">
            {/* Animated icon container */}
            <div
              className={`rounded-full transition-colors ${
                isMobileMenuOpen ? "bg-orange-100" : "bg-transparent"
              }`}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="size-5 text-orange-600" />
              ) : (
                <ListBulletIcon className="size-5 text-gray-700" />
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Mobile + Desktop) */}
      <aside
        className={`fixed md:relative md:translate-x-0 inset-y-0 left-0 w-64 bg-white z-50 shadow-lg md:shadow-none
        transform transition-transform duration-300 ease-in-out 
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <Link
            to={ClientRouteKey.Home}
            className="mb-8 px-2 py-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img src="/imgs/icon.svg" alt="Logo" className="md:h-full p-4" />
          </Link>

          {/* Navigation Items */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}

              <Divider className="my-4" />

              {externalLinks.map((link) => (
                <ExternalLinkItem key={link.href} {...link} />
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="mt-auto border-t pt-4">
            <div className="flex items-center gap-3 px-2 py-3 text-gray-700">
              <UserIcon className="w-6 h-6 text-gray-500" />
              <span className="text-sm font-medium">
                {accountData?.userData?.firstname || "Guest"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 bg-white hover:bg-red-50 transition-colors"
            >
              <img src="/imgs/logout.svg" alt="Logout" className="w-6 h-6" />{" "}
              {/* Updated to use imgSrc */}
              <span className="text-sm">Logout</span>
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">@SD Eng</p>
          </div>
        </div>
      </aside>

      {/* Padding for Mobile Top Navbar */}
      <div className="md:hidden h-16" />
    </>
  );
}

export default Navbar;
