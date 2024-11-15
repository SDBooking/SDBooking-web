import React from "react";
import PageContainer from "../../common/components/container/PageContainer";

const HistoryPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="flex flex-row gap-2 mb-4">
        <img src="/imgs/history.svg" />
        <h1 className="text-maincolor text-xl">ประวัติการจองห้อง</h1>
      </div>

      <img src="/imgs/mock_history.svg" />
    </PageContainer>
  );
};

export default HistoryPage;
