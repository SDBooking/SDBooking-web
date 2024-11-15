import React from "react";
import PageContainer from "../../common/components/container/PageContainer";
import RoomCard from "./components/RoomCard";

const BookPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="flex flex-row gap-2">
        <img src="/imgs/bookmark.svg" />
        <h1 className="text-maincolor text-xl">จองห้อง</h1>
      </div>

      <p className="text-sm font-light my-4">หมายเหตุ/รายละเอียด</p>
      {/* <img src="/imgs/mock_book.svg" /> */}
      <div className="flex flex-col gap-6">
        <RoomCard
          name="อาคารฤทธา"
          type="Meeting"
          location="Building A"
          capacity={500}
          amenities={["Projector", "Whiteboard"]}
          description="A spacious conference room with all necessary amenities."
          requiresConfirmation={true}
          isActive={true}
          onBook={() => console.log("Room booked")}
        />
        <RoomCard
          name="อาคารฤทธา"
          type="Meeting"
          location="Building A"
          capacity={500}
          amenities={["Projector", "Whiteboard"]}
          description="A spacious conference room with all necessary amenities."
          requiresConfirmation={true}
          isActive={true}
          onBook={() => console.log("Room booked")}
        />
        <RoomCard
          name="อาคารฤทธา"
          type="Meeting"
          location="Building A"
          capacity={500}
          amenities={["Projector", "Whiteboard"]}
          description="A spacious conference room with all necessary amenities."
          requiresConfirmation={false}
          isActive={true}
          onBook={() => console.log("Room booked")}
        />
      </div>
    </PageContainer>
  );
};

export default BookPage;
