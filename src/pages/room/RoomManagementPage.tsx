import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { GetAllRooms } from "../../common/apis/room/queries";
import { GetAllRoomServices } from "../../common/apis/room_service/queries";
import { Room } from "../../types/room";
import { RoomServiceDTO } from "../../types/room_service";
import { Cog8ToothIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ClientRouteKey } from "../../common/constants/keys";

import BackPageContainer from "../../common/components/container/BackPageContainer";
import RoomCardEdit from "./components/RoomCardEdit";
import { RoomAttachmentModel } from "../../types/room_attactment";
import { GetAllRoomAttachments } from "../../common/apis/room_attachment/queries";

const RoomManagementPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomServices, setRoomServices] = useState<RoomServiceDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [roomAttachments, setRoomAttachments] = useState<RoomAttachmentModel[]>(
    []
  );

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
        const roomAttachmentResponse = await GetAllRoomAttachments();
        if (Array.isArray(roomAttachmentResponse.result)) {
          setRoomAttachments(roomAttachmentResponse.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // console.log("Rooms:", rooms);
  // console.log("Room Services:", roomServices);

  const filterRoomAttachments = (room_id: number) => {
    return roomAttachments.filter(
      (attachment) => attachment.room_id === room_id
    );
  };

  return (
    <BackPageContainer
      title={"จัดการห้อง"}
      description="เลือกการแสดงผลรายละเอียดสำหรับเลือก ในการสร้างหรือแก้ไขห้องต่างๆ"
    >
      <Box className="flex justify-end md:justify-between items-center mb-4">
        <div className="text-base md:text-lg font-bold hidden md:inline-flex">
          อัพเดทข้อมูลห้อง
        </div>
        <Box className="flex gap-2">
          <Button
            component={Link}
            to={ClientRouteKey.RoomManipulate}
            variant="contained"
            color="primary"
            className="hidden md:inline-flex"
          >
            <PlusCircleIcon className="w-5 h-5 items-center justify-center md:mr-2" />

            <div className="hidden md:inline-flex">เพิ่มห้อง</div>
          </Button>
          <Button
            component={Link}
            to={ClientRouteKey.Setting}
            variant="contained"
            color="inherit"
          >
            <Cog8ToothIcon className="w-5 h-5 items-center justify-center md:mr-2" />

            <div className="hidden md:inline-flex">
              ตั้งค่าการกรอกรายละเอียด
            </div>
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box mt={4} />
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
        <div className="flex flex-col gap-4">
          {rooms.map((room) => {
            // Filter room services based on the room ID
            const services = roomServices
              .filter((service) => service.room_id === room.id)
              .map((service) => service.facility)
              .flat();

            return (
              <div key={room.id}>
                <RoomCardEdit
                  id={room.id}
                  name={room.name}
                  type={room.type}
                  location={room.location}
                  capacity={room.capacity}
                  services={services}
                  description={room.description || "No description provided."}
                  booking_interval_minutes={room.booking_interval_minutes}
                  open_time={room.open_time}
                  close_time={room.close_time}
                  activation={room.activation}
                  images={filterRoomAttachments(room.id).map(
                    (path) => `${API_ENDPOINT_URL}${path.path}`
                  )}
                />
              </div>
            );
          })}
        </div>
      )}
    </BackPageContainer>
  );
};

export default RoomManagementPage;
