import React from "react";

import BackPageContainer from "../../common/components/container/BackPageContainer";

import RoomFilter from "./components/RoomSetting";

const SettingPage: React.FC = () => {
  return (
    <BackPageContainer
      title={"ตั้งค่าระบบ"}
      description="เลือกการแสดงผลรายละเอียดสำหรับเลือก ในการสร้างหรือแก้ไขห้องต่างๆ"
    >
      <div className="w-3/4">
        <div className="flex flex-col">
          <RoomFilter />
        </div>
      </div>
    </BackPageContainer>
  );
};

export default SettingPage;
