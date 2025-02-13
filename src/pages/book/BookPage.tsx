import React, { useEffect, useState } from "react";
import { Grid, Typography, CircularProgress, Box } from "@mui/material";
import PageContainer from "../../common/components/container/PageContainer";
import RoomCard from "./components/RoomCard";
import { GetAllRooms } from "../../common/apis/room/queries";
import { Room } from "../../types/room";
import { RoomServiceDTO } from "../../types/room_service";
import { GetAllRoomServices } from "../../common/apis/room_service/queries";
import { RoomAuthorizationModel } from "../../types/room_authorization";
import { GetAllRoomAuthorizations } from "../../common/apis/room_authorization/queries";
import { SystemAccountRole } from "../../types/sys_account_role";
import { GetSystemAccountRoleByAccountID } from "../../common/apis/system/system_account_role/queries";
import useAccountContext from "../../common/contexts/AccountContext";
import { GetAllRoomAttachments } from "../../common/apis/room_attachment/queries";
import { RoomAttachmentModel } from "../../types/room_attactment";

const BookPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomServices, setRoomServices] = useState<RoomServiceDTO[]>([]);
  const [roomAuthorities, setRoomAuthorities] = useState<
    RoomAuthorizationModel[]
  >([]);
  const [roomAttachments, setRoomAttachments] = useState<RoomAttachmentModel[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [systemAccountRole, setSystemAccountRole] =
    useState<SystemAccountRole[]>();
  const { accountData } = useAccountContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          roomResponse,
          roomServiceResponse,
          roomAuthoritiesResponse,
          systemAccountRoleResponse,
          roomAttachmentResponse,
        ] = await Promise.all([
          GetAllRooms(),
          GetAllRoomServices(),
          GetAllRoomAuthorizations(),
          accountData?.userData.cmuitaccount
            ? GetSystemAccountRoleByAccountID(accountData.userData.cmuitaccount)
            : Promise.resolve({ result: [] }),
          GetAllRoomAttachments(),
        ]);

        if (Array.isArray(roomResponse.result)) {
          setRooms(roomResponse.result);
        }
        if (Array.isArray(roomServiceResponse.result)) {
          setRoomServices(roomServiceResponse.result);
        }
        if (Array.isArray(roomAuthoritiesResponse.result)) {
          setRoomAuthorities(roomAuthoritiesResponse.result);
        }
        if (Array.isArray(systemAccountRoleResponse.result)) {
          setSystemAccountRole(systemAccountRoleResponse.result);
        }
        if (Array.isArray(roomAttachmentResponse.result)) {
          setRoomAttachments(roomAttachmentResponse.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterRoomAttachments = (room_id: number) => {
    return roomAttachments.filter(
      (attachment) => attachment.room_id === room_id
    );
  };

  console.log("Rooms:", rooms);
  console.log("Room Authorities:", roomAuthorities);
  console.log("System Account Role:", systemAccountRole);
  console.log("Room Attachments:", roomAttachments);

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

              // Filter room authorizations based on the room ID and requires_confirmation
              const roomAuth = roomAuthorities.filter(
                (auth) => auth.room_id === room.id
              );

              // Check if the user is authorized for the room
              const isAuthorized = roomAuth.some((auth) =>
                systemAccountRole?.some((role) => role.role_id === auth.role_id)
              );

              console.log("Room ID :", room.id);
              console.log("Room Auth :", roomAuth);
              console.log("isAuthorized :", isAuthorized);

              // Check if the room requires confirmation
              const requires_confirmation = roomAuth.some((auth) =>
                systemAccountRole?.some(
                  (role) =>
                    role.role_id === auth.role_id && auth.requires_confirmation
                )
              );

              console.log("Requires Confirmation :", requires_confirmation);

              return (
                <Grid item xs={12} key={room.id}>
                  <RoomCard
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
                    id={room.id}
                    images={filterRoomAttachments(room.id).map(
                      (path) => `${API_ENDPOINT_URL}${path.path}`
                    )}
                    authorized={!!isAuthorized}
                    requires_confirmation={requires_confirmation}
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
