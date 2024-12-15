import React from "react";

import BackPageContainer from "../../common/components/container/BackPageContainer";

import RoomFilter from "./components/RoomSetting";

const SettingPage: React.FC = () => {
  return (
    <BackPageContainer
      title={"ตั้งค่าระบบ"}
      description="เลือกการแสดงผลรายละเอียดสำหรับเลือก ในการสร้างหรือแก้ไขห้องต่างๆ"
    >
      <RoomFilter />
    </BackPageContainer>
  );
};

export default SettingPage;
