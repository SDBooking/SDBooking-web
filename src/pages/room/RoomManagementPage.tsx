import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { GetAllRooms } from "../../common/apis/room/queries";
import { GetAllRoomServices } from "../../common/apis/room_service/queries";
import { Room } from "../../types/room";
import { RoomServiceDTO } from "../../types/room_service";
import { Cog8ToothIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ClientRouteKey } from "../../common/constants/keys";

import BackPageContainer from "../../common/components/container/BackPageContainer";
import RoomCard from "../book/components/RoomCard";
import { RoomAuthorizationModel } from "../../types/room_authorization";
import { GetAllRoomAuthorizations } from "../../common/apis/room_authorization/queries";

const RoomManagementPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomServices, setRoomServices] = useState<RoomServiceDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [roomAuthorities, setRoomAuthorities] = useState<
    RoomAuthorizationModel[]
  >([]);
  const images = [
    "/imgs/Mockroom.png",
    "/imgs/Mockroom.png",
    "/imgs/Mockroom.png",
    "/imgs/Mockroom.png",
    "/imgs/Mockroom.png",
    "/imgs/Mockroom.png",
  ];

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
    const fetchRoomAuthorities = async () => {
      try {
        const response = await GetAllRoomAuthorizations();
        if (Array.isArray(response.result)) {
          setRoomAuthorities(response.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRoomAuthorities();
    fetchRooms();
  }, []);

  // console.log("Rooms:", rooms);
  // console.log("Room Services:", roomServices);

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
          <Box display="flex" gap={2}>
            <Button
              component={Link}
              to={ClientRouteKey.RoomManipulate}
              variant="contained"
              color="primary"
              startIcon={<PlusCircleIcon className="h-5 w-5" />}
            >
              เพิ่มห้อง
            </Button>
            <Button
              component={Link}
              to={ClientRouteKey.RoomUpdate}
              variant="contained"
              color="inherit"
              startIcon={<Cog8ToothIcon className="h-5 w-5" />}
            >
              แก้ไขข้อมูลห้อง
            </Button>
          </Box>
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
                  <RoomCard
                    name={room.name}
                    type={room.type}
                    location={room.location}
                    capacity={room.capacity}
                    services={services}
                    description={room.description || "No description provided."}
                    requires_confirmation={room.requires_confirmation}
                    booking_interval_minutes={room.booking_interval_minutes}
                    open_time={room.open_time}
                    close_time={room.close_time}
                    activation={room.activation}
                    id={room.id}
                    images={images}
                    role={roomAuthorities
                      .filter(
                        (auth) => auth.room_id === room.id && auth.is_allowed
                      )
                      .map((auth) => auth.role)}
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
