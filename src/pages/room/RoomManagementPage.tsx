import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { GetAllRooms } from "../../common/apis/room/queries";
import { GetAllRoomServices } from "../../common/apis/room_service/queries";
import { Room } from "../../types/room";
import { RoomServiceDTO } from "../../types/room_service";
import RoomCardAdmin from "./components/RoomCardAdmin";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ClientRouteKey } from "../../common/constants/keys";

import BackPageContainer from "../../common/components/container/BackPageContainer";

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
      <div className="w-fit">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h6">อัพเดทข้อมูลห้อง</Typography>
          <Button
            component={Link}
            to={ClientRouteKey.RoomManipulate}
            variant="contained"
            color="primary"
            startIcon={<PlusCircleIcon className="h-5 w-5" />}
          >
            เพิ่มห้อง
          </Button>
        </Box>

        {/* Loading or Room Cards */}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
        ) : rooms.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center" mt={10}>
            ไม่มีห้องในระบบ
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={4}>
            {rooms.map((room) => {
              // Filter room services based on the room ID
              const services = roomServices
                .filter((service) => service.room_id === room.id)
                .map((service) => service.facility)
                .flat();

              return (
                <div key={room.id} className="w-fit ">
                  <RoomCardAdmin
                    name={room.name}
                    type={room.type}
                    location={room.location}
                    capacity={room.capacity}
                    services={services}
                    description={room.description || "No description provided."}
                    requiresConfirmation={room.requires_confirmation}
                    isActive={room.activation}
                  />
                </div>
              );
            })}
          </Box>
        )}
      </div>
    </BackPageContainer>
  );
};

export default RoomManagementPage;
