import useAccountContext from "../../contexts/AccountContext";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getLogout } from "../../apis/logout";
import { ClientRouteKey, LocalStorageKey } from "../../constants/keys";
import { UserIcon } from "@heroicons/react/24/solid";

const Navbar: React.FC = () => {
  const { setAccountData } = useAccountContext();
  const { accountData } = useAccountContext();
  const [activeRoute, setActiveRoute] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await getLogout();
    setAccountData(null);
    localStorage.removeItem(LocalStorageKey.Auth);
    navigate(ClientRouteKey.Login);
  };

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname]);

  const renderNavItem = (to: string, imgSrc: string, label?: string) => (
    <li
      className={`nav-item flex flex-row justify-start items-center text-center w-[200px] p-2 rounded-[24px] ${
        activeRoute === to ? "active" : "text-black"
      }`}
      style={{
        background:
          activeRoute === to
            ? `linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 181, 147, 0.35) 75%,
          rgba(255, 89, 103, 0.35) 100%
        ), #fff7e6`
            : "none",
      }}
    >
      <Link
        to={to}
        className="flex flex-row items-center justify-start px-2 gap-4"
      >
        <img src={imgSrc} className="w-[25px] h-[25px]" />
        {label && (
          <p className="text-[14px] text-center flex items-center justify-center">
            {label}
          </p>
        )}
      </Link>
    </li>
  );

  const renderNavHeader = (to: string, imgSrc: string, label?: string) => (
    <li className="nav-item flex flex-row justify-center items-center text-center">
      <Link to={to} className="flex flex-row items-center justify-center">
        <img
          src={imgSrc}
          className="transition-all duration-300 transform group hover:scale-125 w-[120px] h-[44px]"
        />
        {<p className="text-[14px] mt-2 text-black">{label}</p>}
      </Link>
    </li>
  );

  return (
    <nav
      className="navbar p-4 border-1 border-r overflow-hidden"
      role="navigation"
      aria-label="Main Navigation"
    >
      <ul className="navbar-nav">
        <div
          className="absolute bg-[#FFF6EE] bg-gradient-to-t from-[#FFC895]/35 rounded-full pointer-events-none"
          style={{
            width: "483px",
            height: "483px",
            left: "311px",
            top: "850px",
            transform: "translate(-100%, -20%)",
          }}
        ></div>
        {renderNavHeader(ClientRouteKey.Home, "/imgs/icon.svg", "")}
        <div className="my-4"></div>
        {renderNavItem(ClientRouteKey.Book, "/imgs/bookmark.svg", "จองห้อง")}
        {renderNavItem(
          ClientRouteKey.Calendar,
          "/imgs/calendar.svg",
          "ปฎิทินการจองห้อง"
        )}
        {renderNavItem(
          ClientRouteKey.History,
          "/imgs/history.svg",
          "ประวัติการจองห้อง"
        )}

        <li className="nav-bot mb-4 flex flex-col justify-center items-center text-center">
          <p className="flex flex-row px-4 p-2 m-4 bg-white text-maincolor rounded-[24px] text-sm gap-4 cursor-default">
            <UserIcon className="w-[20px] h-[20px]" />
            {accountData?.userData?.firstname
              ? accountData.userData.firstname.charAt(0).toUpperCase() +
                accountData.userData.firstname.slice(1).toLowerCase()
              : ""}
          </p>
          <button
            className="nav-link flex flex-row items-center justify-center gap-2 "
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              padding: "0",
              cursor: "pointer",
            }}
            aria-label="Log out"
          >
            <div className="hover:bg-[#FFDCD8] flex-row flex gap-2 px-10 p-2 rounded-[24px]">
              <img src="/imgs/logout.svg" className="w-[20px] h-[20px]" />
              <p className="text-sm text-center" style={{ color: "#E54A5F" }}>
                Logout
              </p>
            </div>
          </button>
          <p
            style={{ color: "#D0A095" }}
            className="text-xs my-4 cursor-default"
          >
            @SD Eng
          </p>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
