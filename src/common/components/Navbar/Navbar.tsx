import useAccountContext from "../../contexts/AccountContext";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getLogout } from "../../apis/logout";
import { ClientRouteKey, LocalStorageKey } from "../../constants/keys";
import { ListBulletIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Divider, Box } from "@mui/material";

interface NavbarProps {
  isMobile: boolean;
}

function Navbar({ isMobile }: NavbarProps) {
  const { setAccountData } = useAccountContext();
  const { accountData } = useAccountContext();
  const [activeRoute, setActiveRoute] = useState<string>("");
  const [isOpened, setIsOpened] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleBurgerClick = () => {
    setIsOpened((prev) => !prev);
  };

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
    <Box
      component="li"
      className={`flex flex-row justify-start items-center text-center p-2 rounded-[24px] w-full my-2 ${
        activeRoute === to
          ? "text-[#f57c00] bg-gradient-to-r from-[#ffc163] via-[#fd7427] to-[#e54a5f] bg-clip-text text-transparent whitespace-nowrap"
          : "text-black"
      }`}
    >
      <Link
        to={to}
        className="flex flex-row items-center justify-start px-2 gap-4"
        onClick={() => setIsOpened(false)}
      >
        <img src={imgSrc} className="w-[25px] h-[25px]" />
        {label && (
          <p className="text-[14px] text-center flex items-center justify-center whitespace-nowrap">
            {label}
          </p>
        )}
      </Link>
    </Box>
  );

  const renderNavHeader = (to: string, imgSrc: string, label?: string) => (
    <li className="flex flex-row justify-start items-start text-start mt-4">
      <Link to={to} className="flex flex-row items-center justify-center">
        <img
          src={imgSrc}
          className="w-3/4 transition-all duration-300 transform group hover:scale-125"
        />
        {<p className="text-[14px] mt-2 text-black hidden md:block">{label}</p>}
      </Link>
    </li>
  );

  const renderExternalLink = (href: string, imgSrc: string, label?: string) => (
    <Box
      component="li"
      className={`flex flex-row justify-start items-center text-center p-2 rounded-[24px] w-full my-2 ${
        activeRoute === href
          ? "text-[#f57c00] bg-gradient-to-r from-[#ffc163] via-[#fd7427] to-[#e54a5f] bg-clip-text text-transparent whitespace-nowrap"
          : "text-black"
      }`}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-row items-center justify-start px-2 gap-4"
        onClick={() => setIsOpened(false)}
      >
        <img src={imgSrc} className="w-[25px] h-[25px]" />
        {label && (
          <p className="text-[14px] text-center flex items-center justify-center whitespace-nowrap">
            {label}
          </p>
        )}
      </a>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <div className="fixed items-center p-2 top-4 left-4 rounded-full bg-[#FD7427] z-50">
            <div className="text-white block" onClick={handleBurgerClick}>
              {isOpened ? (
                <XMarkIcon className="size-5" />
              ) : (
                <ListBulletIcon className="size-5" />
              )}
            </div>
          </div>
          {isOpened && (
            <nav
              className="fixed inset-0 bg-white z-30 p-4 overflow-hidden w-full"
              role="navigation"
              aria-label="Main Navigation"
            >
              <ul className="list-none flex flex-col items-start m-4 ml-8">
                {renderNavHeader(ClientRouteKey.Home, "/imgs/icon.svg", "")}
                <div className="my-4"></div>
                <Divider className="w-full mx-auto my-4" />
                <div className="my-4"></div>
                {renderNavItem(
                  ClientRouteKey.Home,
                  "/imgs/calendar.svg",
                  "ปฎิทินการจองห้อง"
                )}
                {renderNavItem(
                  ClientRouteKey.Book,
                  "/imgs/bookmark.svg",
                  "จองห้อง"
                )}
                {renderNavItem(
                  ClientRouteKey.History,
                  "/imgs/mailbox.svg",
                  "รายการของคุณ"
                )}
                {/* {accountData?.isAdmin &&
                  renderNavItem(
                    ClientRouteKey.Setting,
                    "/imgs/setting.svg",
                    "ตั้งค่าระบบ"
                  )} */}
                {accountData?.isAdmin &&
                  renderNavItem(
                    ClientRouteKey.RoomManagement,
                    "/imgs/setting.svg",
                    "จัดการห้อง"
                  )}
                {accountData?.isAdmin &&
                  renderNavItem(
                    ClientRouteKey.UserSetting,
                    "/imgs/usersetting.svg",
                    "จัดการผู้ใช้"
                  )}
                {renderExternalLink(
                  "https://forms.office.com/r/y0jCJG50qu",
                  "/imgs/feedback.svg",
                  "แบบสอบถาม"
                )}
                {renderExternalLink(
                  "https://forms.gle/urK2QyhZDYZoFcNf6",
                  "/imgs/report.svg",
                  "รายงานปัญหา"
                )}
                <li className="mb-4 flex flex-col justify-start items-start text-start mt-10">
                  <button
                    className="flex flex-row items-start justify-start gap-2"
                    onClick={handleLogout}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "0",
                      cursor: "pointer",
                    }}
                    aria-label="Log out"
                  >
                    <div className="hover:bg-[#FFDCD8] flex-row flex gap-2 p-2 rounded-[24px]">
                      <img src="/imgs/logout.svg" className="size-4" />
                      <p
                        className="text-sm text-start"
                        style={{ color: "#E54A5F" }}
                      >
                        Logout
                      </p>
                    </div>
                  </button>
                  <p
                    className="text-xs my-4 cursor-default"
                    style={{ color: "#D0A095" }}
                  >
                    @SD Eng
                  </p>
                </li>
              </ul>
            </nav>
          )}
        </>
      ) : (
        <nav
          className="bg-white text-white relative flex flex-col left-0 h-auto w-64 z-40 p-4 border-r overflow-hidden"
          role="navigation"
          aria-label="Main Navigation"
        >
          <div
            className="absolute bg-[#FFF6EE] bg-gradient-to-t from-[#FFC895]/35 rounded-full pointer-events-none overflow-hidden"
            style={{
              width: "483px",
              height: "483px",
              left: "311px",
              top: "850px",
              transform: "translate(-100%, -20%)",
            }}
          />
          <ul className="flex flex-col items-center overflow-hidden">
            <div className="flex flex-col items-center gap-2 fixed p-4 overflow-hidden  ">
              {renderNavHeader(ClientRouteKey.Home, "/imgs/icon.svg", "")}
              <Divider className="w-full mx-auto my-4 p-4" />
              {renderNavItem(
                ClientRouteKey.Home,
                "/imgs/calendar.svg",
                "ปฎิทินการจองห้อง"
              )}
              {renderNavItem(
                ClientRouteKey.Book,
                "/imgs/bookmark.svg",
                "จองห้อง"
              )}
              {renderNavItem(
                ClientRouteKey.History,
                "/imgs/mailbox.svg",
                "รายการของคุณ"
              )}
              {/* {accountData?.isAdmin &&
              renderNavItem(
              ClientRouteKey.Setting,
              "/imgs/setting.svg",
              "ตั้งค่าระบบ"
              )} */}
              {accountData?.isAdmin &&
                renderNavItem(
                  ClientRouteKey.RoomManagement,
                  "/imgs/setting.svg",
                  "จัดการห้อง"
                )}
              {accountData?.isAdmin &&
                renderNavItem(
                  ClientRouteKey.UserSetting,
                  "/imgs/usersetting.svg",
                  "จัดการผู้ใช้"
                )}
              {renderExternalLink(
                "https://forms.office.com/r/y0jCJG50qu",
                "/imgs/feedback.svg",
                "แบบสอบถาม"
              )}
              {renderExternalLink(
                "https://forms.gle/urK2QyhZDYZoFcNf6",
                "/imgs/report.svg",
                "รายงานปัญหา"
              )}
            </div>
            <li className="fixed bottom-4 flex flex-col justify-center items-center text-center z-20">
              <p className="flex flex-row px-4 p-2 m-4 bg-white text-maincolor rounded-[24px] text-sm gap-4 cursor-default">
                <UserIcon className="size-4" />
                {accountData?.userData?.firstname
                  ? accountData.userData.firstname.charAt(0).toUpperCase() +
                    accountData.userData.firstname.slice(1).toLowerCase()
                  : ""}
              </p>
              <button
                className="flex flex-row items-center justify-center gap-2"
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
                  <p
                    className="text-sm text-center"
                    style={{ color: "#E54A5F" }}
                  >
                    Logout
                  </p>
                </div>
              </button>
              <p
                className="text-xs my-4 cursor-default"
                style={{ color: "#D0A095" }}
              >
                @SD Eng
              </p>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}

export default Navbar;
