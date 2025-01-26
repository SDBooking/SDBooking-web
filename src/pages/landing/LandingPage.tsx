import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "./LandingPage.css"; // Make sure to import the CSS file
import useIntersectionObserver from "./useIntersectionObserver";
import { ClientRouteKey } from "../../common/constants/keys"; // Ensure this path is correct and ClientRouteKey is properly exported
import { PhoneIcon, TicketIcon } from "@heroicons/react/24/solid";

const Header: React.FC = () => (
  <div className="absolute bg-white shadow-md py-4 w-full rounded-b-3xl z-10">
    <div className="mx-auto flex justify-center items-center">
      <img src="/imgs/icon.svg" alt="SD Booking Logo" className="h-12" />
    </div>
  </div>
);

const Footer: React.FC = () => (
  <footer className="bg-[#33302E] py-16 rounded-t-3xl text-white">
    <div className="container mx-auto flex flex-wrap justify-between">
      <div className="flex flex-row items-center  gap-8">
        <img src="imgs/landing/icon.svg" />
        <div className="flex flex-col gap-4">
          <p className="">งานพัฒนาคุณภาพนักศึกษา คณะวิศวกรรมศาสตร์</p>
          <p className="font-thin">Student Development</p>
          <p className="font-thin text-xs">@SD Eng 2024</p>
        </div>
      </div>
      <div className="flex flex-col mb-4 gap-2">
        <p className="font-bold text-[#FD7427]">ADDRESS</p>
        <p>
          มหาวิทยาลัยเชียงใหม่ 239 ถนนห้วยแก้ว ตำบลสุเทพ อำเภอเมือง
          จังหวัดเชียงใหม่ 50200
        </p>
        <div className="flex flex-row justify-between mt-4">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-[#FD7427]">EMAIL</p>
            <p className="flex flex-row items-center gap-2">
              <TicketIcon className="size-4 text-[#FD7427]" />
              studentaffairs@eng.cmu.ac.th
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-[#FD7427]">PHONE</p>

            <p className="flex flex-row items-center gap-2">
              <PhoneIcon className="size-4 text-[#FD7427]" />
              053-944179 ต่อ 110-112
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate(); // Use useNavigate hook from react-router-dom

  const handleIntersection: IntersectionObserverCallback = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        } else {
          entry.target.classList.remove("animate");
        }
      });
    },
    []
  );

  const handleLogin = useCallback(() => {
    navigate(ClientRouteKey.Login); // Use navigate to navigate to the login page
  }, [navigate]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      navigate(ClientRouteKey.Login);
    }
  }, [navigate]);

  const leftCardRef = useIntersectionObserver(handleIntersection);
  const leftCardMidRef = useIntersectionObserver(handleIntersection);
  const leftCardBotRef = useIntersectionObserver(handleIntersection);
  const rightCardRef = useIntersectionObserver(handleIntersection);
  const rightCardMidRef = useIntersectionObserver(handleIntersection);
  const rightCardBotRef = useIntersectionObserver(handleIntersection);

  return (
    <div className="flex md:flex-col w-screen h-screen bg-white relative overflow-x-hidden">
      <Header />

      <div className="bg-white">
        <section className="py-16 bg-white h-screen">
          <div className="text-center h-full flex flex-col justify-center items-center">
            <h1
              className="text-5xl font-bold mb-4 text-transparent"
              style={{
                background:
                  "linear-gradient(180deg, #FFC163 0%, #FD7427 42.5%, #E54A5F 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              ระบบจองห้อง
            </h1>
            <p className="mb-6">
              งานพัฒนาคุณภาพนักศึกษา คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเชียงใหม่
            </p>
            <button
              className="text-white px-10 py-4 rounded-full font-semibold shadow-md w-fit mt-4"
              style={{
                background:
                  "linear-gradient(0deg, #FD7427, #FD7427), linear-gradient(90deg, #FFC163 0%, #FD7427 42.5%, #E54A5F 100%)",
              }}
              onClick={handleLogin} // Ensure handleLogin is invoked correctly
            >
              เข้าสู่ระบบ
            </button>
          </div>

          <img
            src="/imgs/landing/l_wallpaper.svg"
            alt="Left Wallpaper"
            className="absolute left-0 top-0 z-0 "
          />
          <img
            src="/imgs/landing/r_wallpaper.svg"
            alt="Right Wallpaper"
            className="absolute right-0 top-0 z-0"
          />

          <div className="hidden xl:block">
            <img
              src="/imgs/landing/l_card.svg"
              className="absolute left-10 top-40 z-0 slide-in-left"
              ref={leftCardRef}
            />
            <img
              src="/imgs/landing/l_card_mid.svg"
              className="absolute left-36 top-96 z-0 slide-in-left"
              ref={leftCardMidRef}
            />
            <img
              src="/imgs/landing/l_card_bot.svg"
              className="absolute left-8 bottom-64 z-0 slide-in-left"
              ref={leftCardBotRef}
            />
          </div>

          <div className="hidden xl:block">
            <img
              src="/imgs/landing/r_card.svg"
              className="absolute right-10 top-40 z-0 slide-in-right"
              ref={rightCardRef}
            />
            <img
              src="/imgs/landing/r_card_mid.svg"
              className="absolute right-36 top-96 z-0 slide-in-right"
              ref={rightCardMidRef}
            />
            <img
              src="/imgs/landing/r_card_bot.svg"
              className="absolute right-8 bottom-64 z-0 slide-in-right"
              ref={rightCardBotRef}
            />
          </div>
        </section>

        <section className="py-16 bg-[#FBFBFB] rounded-[40px] shadow-inner shadow-[#ECD6CA80]">
          <div className=" flex flex-col">
            <img src="/imgs/landing/title.svg" className="p-40"></img>
          </div>
        </section>

        <section className="py-16">
          <img
            src="imgs/landing/user.svg"
            alt="Booking Calendar"
            className="border rounded-lg shadow-md w-full"
          />
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
