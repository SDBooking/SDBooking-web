import React, { useEffect, useState } from "react";

import BackPageContainer from "../../common/components/container/BackPageContainer";
import Box from "../../common/components/container/Box";
import { GetAllRooms } from "../../common/apis/room/queries";
import { GetAllRoomServices } from "../../common/apis/room_service/queries";
import { Room } from "../../types/room";
import { RoomServiceDTO } from "../../types/room_service";
import RoomCardAdmin from "./components/RoomCardAdmin";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const RoomManagementPage: React.FC = () => {
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
    <BackPageContainer
      title={"จัดการห้อง"}
      description="เลือกการแสดงผลรายละเอียดสำหรับเลือก ในการสร้างหรือแก้ไขห้องต่างๆ"
    >
      <Box>
        <div className="flex flex-col">
          <div className="flex items-center justify-between flex-grow-0 mb-4">
            <p className="p-2">ตั้งค่าข้อมูลทั่วไปในระบบ</p>
            <div>
              <span className="flex flex-row gap-2 p-2 rounded-2xl text-maincolor bg-gray-50 cursor-pointer">
                <PlusCircleIcon className="size-6" />
                เพิ่มห้อง
              </span>
            </div>
          </div>

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
                  <RoomCardAdmin
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
        </div>
      </Box>
    </BackPageContainer>
  );
};

export default RoomManagementPage;
