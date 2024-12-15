import React from "react";
import BackPageContainer from "../../common/components/container/BackPageContainer";
import AccountBox from "./components/AccountBox";

const UserSettingPage: React.FC = () => {
  return (
    <BackPageContainer
      title={"จัดการผู้ใช้"}
      description="เลือกการแสดงผลรายละเอียดสำหรับเลือก ในการสร้างหรือแก้ไขห้องต่างๆ"
    >
      <div className="max-w-[1240px]">
        <AccountBox />
      </div>
    </BackPageContainer>
  );
};

export default UserSettingPage;
