import styled from "styled-components";
import { config } from "../../core/config";
import { useEffect } from "react";
import { ClientRouteKey } from "../../common/constants/keys";
import useAccountContext from "../../common/contexts/AccountContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { accountData } = useAccountContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (accountData) {
      navigate(ClientRouteKey.Home, { replace: true });
    }
  }, [accountData, navigate]);

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen">
      <div
        className="flex flex-1 items-center justify-center mt-12 md:mt-0 rounded-t-[36px] md:rounded-none"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255, 193, 99, 0.3) 0%, rgba(253, 116, 39, 0.3) 42.5%, rgba(229, 74, 95, 0.3) 100%), url('/imgs/loginbg.svg')`,
          backgroundSize: "cover",
        }}
      >
        <div
          className="absolute h-[100px] w-screen rounded-t-[36px] bottom-0 md:hidden"
          style={{ background: "#33302E" }}
        ></div>
        <div className="flex flex-col w-[90%] md:w-[512px] h-auto md:h-[535px] bg-white rounded-[24px] mb-10 items-center shadow-lg p-4 md:p-0">
          <img
            src="imgs/icon.svg"
            className="w-[150px] md:w-[252px] mt-12 p-4"
          />
          <p
            className="text-2xl md:text-3xl font-semibold p-4"
            style={{
              background: `linear-gradient(0deg, #FD7427, #FD7427),
linear-gradient(180deg, #FFC163 0%, #FD7427 42.5%, #E54A5F 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ระบบจองห้อง
          </p>
          <p className="p-2 text-base md:text-lg" style={{ color: "#5D141E" }}>
            งานพัฒนาคุณภาพนักศึกษา คณะวิศวกรรมศาสตร์
          </p>
          <p
            className="p-2 text-base md:text-lg mb-6 md:mb-14"
            style={{ color: "#6A69AA" }}
          >
            มหาวิทยาลัยเชียงใหม่
          </p>
          <p className="text-sm p-2">ลงชื่อเข้าสู่ระบบ</p>
          <LoginBtn href={config.cmuOAuthUrl} target="_self">
            <p className="font-normal text-lg md:text-2xl text-white">
              CMU Account
            </p>
          </LoginBtn>
        </div>
      </div>
      <div className="hidden md:block">
        <img
          src="/imgs/loginlogo.svg"
          alt="Login Logo"
          className="absolute bottom-0 right-0 w-[200px] md:w-[315px]"
        />
        <img
          src="/imgs/ENGlogo1.svg"
          alt="Login Logo"
          className="absolute bottom-16 right-20 md:right-40"
        />
        <img
          src="/imgs/ENGlogo2.svg"
          alt="Login Logo"
          className="absolute bottom-20 right-8 md:right-16"
        />
      </div>
    </div>
  );
};

export default LoginPage;

const LoginBtn = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 auto;
  margin-top: 0.5em;
  padding: 0.25em 0;

  max-width: 15em;
  height: 3.4em;
  width: 14em;

  font-size: 1.3em;

  border-radius: 16px;
  background: linear-gradient(90deg, #b1b1e7 0.83%, #6974d6 76.08%),
    var(--purple-5-purple, #6974d6);
`;
