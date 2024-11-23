import React, { useEffect, useState } from "react";
import PageContainer from "../../common/components/container/PageContainer";
import RoomCard from "./components/RoomCard";
import { GetAllRooms } from "../../common/apis/room/queries";
import { Room } from "../../types/room";
import { RoomServiceDTO } from "../../types/room_service";
import { GetAllRoomServices } from "../../common/apis/room_service/queries";

const BookPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomServices, setRoomServices] = useState<RoomServiceDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomResponse = await GetAllRooms();
        if (Array.isArray(roomResponse.result)) {
          setRooms(roomResponse.result);
        }
        const roomServiceResponse = await GetAllRoomServices();
        if (Array.isArray(roomServiceResponse.result)) {
          setRoomServices(roomServiceResponse.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  console.log("Rooms:", rooms);
  console.log("Room Services:", roomServices);

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="flex flex-row gap-2 items-center mb-4">
        <img src="/imgs/bookmark.svg" alt="Bookmark" className="h-6 w-6" />
        <h1 className="text-maincolor text-xl font-semibold">จองห้อง</h1>
      </div>

      {/* Description */}
      <p className="text-sm font-light my-4 text-gray-600">
        หมายเหตุ/รายละเอียด
      </p>

      {/* Loading or Room Cards */}
      {loading ? (
        <div className="text-center text-gray-500 mt-10">Loading...</div>
      ) : rooms.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">ไม่มีห้องว่าง</div>
      ) : (
        <div className="flex flex-col gap-6">
          {rooms.map((room) => {
            // Filter room services based on the room ID
            const services = roomServices
              .filter((service) => service.room_id === room.id)
              .map((service) => service.facility)
              .flat();

            console.log("Services:", services);

            return (
              <RoomCard
                key={room.id}
                name={room.name}
                type={room.type}
                location={room.location}
                capacity={room.capacity}
                services={services}
                description={room.description || "No description provided."}
                requiresConfirmation={room.requires_confirmation}
                isActive={room.activation}
              />
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};

export default BookPage;
