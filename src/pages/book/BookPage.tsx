import React, { useEffect, useState } from "react";
import { Grid, Typography, CircularProgress, Box } from "@mui/material";
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

    fetchRooms();
  }, []);

  return (
    <PageContainer>
      <div className="p-4">
        {/* Page Header */}
        <Box display="flex" alignItems="center" mb={2}>
          <img src="/imgs/bookmark.svg" alt="Bookmark" className="h-6 w-6" />
          <div className="m-2">
            <h1 className="text-maincolor text-xl">จองห้อง</h1>
          </div>
        </Box>

        {/* Description */}
        <Typography variant="body1" color="textSecondary" mb={4}>
          ค้นหาห้องที่คุณต้องการจอง และดูรายละเอียดของห้องเพื่อดำเนินการจอง
        </Typography>

        {/* Loading or Room Cards */}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
        ) : rooms.length === 0 ? (
          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            mt={10}
          >
            ไม่มีห้องว่าง
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {rooms.map((room) => {
              // Filter room services based on the room ID
              const services = roomServices
                .filter((service) => service.room_id === room.id)
                .map((service) => service.facility)
                .flat();

              return (
                <Grid item xs={12} key={room.id}>
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
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </div>
    </PageContainer>
  );
};

export default BookPage;
