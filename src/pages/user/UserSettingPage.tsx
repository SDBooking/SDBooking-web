import React from "react";

import BackPageContainer from "../../common/components/container/BackPageContainer";
import Box from "../../common/components/container/Box";
import AccountBox from "./components/AccountBox";

const UserSettingPage: React.FC = () => {
  return (
    <BackPageContainer
      title={"ตั้งค่าระบบ"}
      description="เลือกการแสดงผลรายละเอียดสำหรับเลือก ในการสร้างหรือแก้ไขห้องต่างๆ"
    >
      <Box>
        <div className="flex flex-col">
          <AccountBox />
        </div>
      </Box>
    </BackPageContainer>
  );
};

export default UserSettingPage;
