import React, { useEffect, useState } from "react";
import {
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Cog6ToothIcon, TrashIcon } from "@heroicons/react/24/solid";
import { GetAllRoomTypes } from "../../../common/apis/room_type/queries";
import {
  CreateRoomType,
  DeleteRoomType,
  UpdateRoomType,
} from "../../../common/apis/room_type/manipulates";
import { RoomTypeDTO } from "../../../types/room_type";
import { RoomLocationDTO } from "../../../types/room_location";
import { GetAllRoomLocations } from "../../../common/apis/room_location/queries";
import {
  CreateRoomLocation,
  DeleteRoomLocation,
  UpdateRoomLocation,
} from "../../../common/apis/room_location/manipulates";
import { RoomFacilityDTO } from "../../../types/room_facility";
import { GetAllRoomFacilities } from "../../../common/apis/room_facility/queries";
import {
  CreateRoomFacility,
  DeleteRoomFacility,
  UpdateRoomFacility,
} from "../../../common/apis/room_facility/manipulates";
import { GetAllRooms } from "../../../common/apis/room/queries";
import { Room } from "../../../types/room";
import { GetAllRoomServices } from "../../../common/apis/room_service/queries";
import { RoomServiceDTO } from "../../../types/room_service";
import { usePopupContext } from "../../../common/contexts/PopupContext";
import RoomEditor from "./RoomEditor";
import { renameDTO } from "./RoomEditor";

const RoomFilter: React.FC = () => {
  const { setChildren, setVisible } = usePopupContext();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeDTO[]>([]);
  const [roomLocations, setRoomLocations] = useState<RoomLocationDTO[]>([]);
  const [roomFacilities, setRoomFacilities] = useState<RoomFacilityDTO[]>([]);
  const [roomServices, setRoomServices] = useState<RoomServiceDTO[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    index: number;
    type: "roomType" | "roomLocation" | "roomFacility";
  } | null>(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await GetAllRoomTypes();
        if (!response.result) throw new Error("Failed to fetch room types");
        setRoomTypes(response.result);
      } catch (error) {
        console.error("Failed to fetch room types:", error);
      }
    };

    const fetchRoomLocations = async () => {
      try {
        const response = await GetAllRoomLocations();
        if (!response.result) throw new Error("Failed to fetch room locations");
        setRoomLocations(response.result);
      } catch (error) {
        console.error("Failed to fetch room locations:", error);
      }
    };

    const fetchRoomFacilities = async () => {
      try {
        const response = await GetAllRoomFacilities();
        if (!response.result)
          throw new Error("Failed to fetch room facilities");
        setRoomFacilities(response.result);
      } catch (error) {
        console.error("Failed to fetch room facilities:", error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await GetAllRooms();
        if (!response.result) throw new Error("Failed to fetch rooms");
        setRooms(Array.isArray(response.result) ? response.result : []);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    const fetchRoomServices = async () => {
      try {
        const response = await GetAllRoomServices();
        if (!response.result) throw new Error("Failed to fetch room services");
        setRoomServices(Array.isArray(response.result) ? response.result : []);
      } catch (error) {
        console.error("Failed to fetch room services:", error);
      }
    };

    fetchRoomTypes();
    fetchRoomLocations();
    fetchRoomFacilities();
    fetchRooms();
    fetchRoomServices();
  }, []);

  const handleDelete = async () => {
    if (deleteTarget) {
      const { index, type } = deleteTarget;
      try {
        if (type === "roomType") {
          await DeleteRoomType(roomTypes[index].id);
          setRoomTypes((prev) => prev.filter((_, i) => i !== index));
        } else if (type === "roomLocation") {
          await DeleteRoomLocation(roomLocations[index].id);
          setRoomLocations((prev) => prev.filter((_, i) => i !== index));
        } else if (type === "roomFacility") {
          await DeleteRoomFacility(roomFacilities[index].id);
          setRoomFacilities((prev) => prev.filter((_, i) => i !== index));
        }
      } catch (error) {
        console.error("Failed to delete item:", error);
      } finally {
        setDeleteModalOpen(false);
        setDeleteTarget(null);
      }
    }
  };

  const handleAddRoomType = async (
    newItem: string,
    list: RoomTypeDTO[],
    setList: React.Dispatch<React.SetStateAction<RoomTypeDTO[]>>
  ) => {
    if (newItem.trim()) {
      try {
        const response = await CreateRoomType({ name: newItem });
        if (!response.result) {
          throw new Error("Failed to add room type");
        }
        const newRoomType = response.result;
        setList([...list, newRoomType]);
      } catch (error) {
        console.error("Failed to add room type:", error);
      }
    }
  };

  const handleAddRoomLocation = async (
    newItem: string,
    list: RoomLocationDTO[],
    setList: React.Dispatch<React.SetStateAction<RoomLocationDTO[]>>
  ) => {
    if (newItem.trim()) {
      try {
        const response = await CreateRoomLocation({ name: newItem });
        if (!response.result) {
          throw new Error("Failed to add room type");
        }
        const newRoomType = response.result;
        setList([...list, newRoomType]);
      } catch (error) {
        console.error("Failed to add room type:", error);
      }
    }
  };

  const handleAddRoomFacility = async (
    newItem: string,
    list: RoomFacilityDTO[],
    setList: React.Dispatch<React.SetStateAction<RoomFacilityDTO[]>>
  ) => {
    if (newItem.trim()) {
      try {
        const response = await CreateRoomFacility({ name: newItem });
        if (!response.result) {
          throw new Error("Failed to add room facility");
        }
        const newRoomFacility = response.result;
        setList([...list, newRoomFacility]);
      } catch (error) {
        console.error("Failed to add room facility:", error);
      }
    }
  };

  const handleEditRoomType = (rowData: renameDTO) => {
    setVisible(true);
    setChildren(
      <RoomEditor
        target={rowData}
        handle={async (data: renameDTO) => {
          await UpdateRoomType(data); // Update the backend
          setRoomTypes((prev) =>
            prev.map((item) =>
              item.id === data.id ? { ...item, name: data.name } : item
            )
          ); // Update the state locally
          setVisible(false);
          setChildren(null);
        }}
        cancel={() => {
          setVisible(false);
          setChildren(null);
        }}
      />
    );
  };

  const handleEditRoomLocation = (rowData: renameDTO) => {
    setVisible(true);
    setChildren(
      <RoomEditor
        target={rowData}
        handle={async (data: renameDTO) => {
          await UpdateRoomLocation(data); // Update the backend
          setRoomLocations((prev) =>
            prev.map((item) =>
              item.id === data.id ? { ...item, name: data.name } : item
            )
          ); // Update the state locally
          setVisible(false);
          setChildren(null);
        }}
        cancel={() => {
          setVisible(false);
          setChildren(null);
        }}
      />
    );
  };

  const handleEditRoomFacility = (rowData: renameDTO) => {
    setVisible(true);
    setChildren(
      <RoomEditor
        target={rowData}
        handle={async (data: renameDTO) => {
          await UpdateRoomFacility(data); // Update the backend
          setRoomFacilities((prev) =>
            prev.map((item) =>
              item.id === data.id ? { ...item, name: data.name } : item
            )
          ); // Update the state locally
          setVisible(false);
          setChildren(null);
        }}
        cancel={() => {
          setVisible(false);
          setChildren(null);
        }}
      />
    );
  };

  return (
    <Box p={4}>
      {/* Info Box */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom className="text-center">
          ข้อมูลห้องในระบบ
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box mb={2}>
          <Typography variant="h6" gutterBottom className="text-center">
            ประเภทห้อง
          </Typography>
          <div className="grid grid-cols-3">
            {roomTypes.map((type) => (
              <ListItem key={type.id}>
                <ListItemText
                  primary={type.name}
                  className="bg-gray-100 text-center rounded-2xl"
                />
              </ListItem>
            ))}
          </div>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom className="text-center">
            สถานที่
          </Typography>
          <div className="grid grid-cols-3">
            {roomLocations.map((location) => (
              <ListItem key={location.id}>
                <ListItemText
                  primary={location.name}
                  className="bg-gray-100 text-center rounded-2xl"
                />
              </ListItem>
            ))}
          </div>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom className="text-center">
            สิ่งอำนวยความสะดวก
          </Typography>
          <div className="grid grid-cols-4">
            {roomFacilities.map((facility) => (
              <ListItem key={facility.id}>
                <ListItemText
                  primary={facility.name}
                  className="bg-gray-100 text-center rounded-2xl"
                />
              </ListItem>
            ))}
          </div>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom className="text-center">
          <div className="my-4">ห้องทั้งหมด</div>
        </Typography>
        <Grid container spacing={2}>
          {rooms.map((room) => {
            const facilities = roomServices
              .filter((service) => service.room_id === room.id)
              .map((service) => service.facility)
              .flat();
            return (
              <Grid item xs={12} sm={6} md={4} key={room.id}>
                <Card className="h-full">
                  <CardContent>
                    <Typography variant="h6">{room.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      ประเภท: {room.type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      สถานที่: {room.location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      สิ่งอำนวยความสะดวก: {facilities.join(", ")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Room Types */}
      <Box mb={4}>
        <Typography variant="h6" color="primary" gutterBottom>
          ประเภทห้อง
        </Typography>
        {roomTypes.map((type, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              mb: 1,
            }}
          >
            <Typography>{type.name}</Typography>
            <Box>
              <IconButton
                onClick={() =>
                  handleEditRoomType({
                    id: type.id,
                    name: type.name,
                  })
                }
              >
                <Cog6ToothIcon className="h-4 w-4" />
              </IconButton>
              <IconButton
                onClick={() => {
                  setDeleteTarget({ index, type: "roomType" });
                  setDeleteModalOpen(true);
                }}
              >
                <TrashIcon className="h-4 w-4" />
              </IconButton>
            </Box>
          </Paper>
        ))}
        <TextField
          placeholder="เพิ่มประเภทห้อง"
          size="small"
          fullWidth
          margin="normal"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddRoomType(
                (e.target as HTMLInputElement).value,
                roomTypes,
                setRoomTypes
              );
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
      </Box>

      {/* Room Locations */}
      <Box mb={4}>
        <Typography variant="h6" color="primary" gutterBottom>
          สถานที่
        </Typography>
        {roomLocations.map((type, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              mb: 1,
            }}
          >
            <Typography>{type.name}</Typography>
            <Box>
              <IconButton
                onClick={() =>
                  handleEditRoomLocation({
                    id: type.id,
                    name: type.name,
                  })
                }
              >
                <Cog6ToothIcon className="h-4 w-4" />
              </IconButton>
              <IconButton
                onClick={() => {
                  setDeleteTarget({ index, type: "roomLocation" });
                  setDeleteModalOpen(true);
                }}
              >
                <TrashIcon className="h-4 w-4" />
              </IconButton>
            </Box>
          </Paper>
        ))}
        <TextField
          placeholder="เพิ่มสถานที่"
          size="small"
          fullWidth
          margin="normal"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddRoomLocation(
                (e.target as HTMLInputElement).value,
                roomLocations,
                setRoomLocations
              );
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
      </Box>

      {/* Room Facilities */}
      <Box mb={4}>
        <Typography variant="h6" color="primary" gutterBottom>
          สิ่งอำนวยความสะดวก (Room Services)
        </Typography>
        {roomFacilities.map((type, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              mb: 1,
            }}
          >
            <Typography>{type.name}</Typography>
            <Box>
              <IconButton
                onClick={() =>
                  handleEditRoomFacility({
                    id: type.id,
                    name: type.name,
                  })
                }
              >
                <Cog6ToothIcon className="h-4 w-4" />
              </IconButton>
              <IconButton
                onClick={() => {
                  setDeleteTarget({ index, type: "roomFacility" });
                  setDeleteModalOpen(true);
                }}
              >
                <TrashIcon className="h-4 w-4" />
              </IconButton>
            </Box>
          </Paper>
        ))}
        <TextField
          placeholder="เพิ่มสิ่งอำนวยความสะดวก"
          size="small"
          fullWidth
          margin="normal"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddRoomFacility(
                (e.target as HTMLInputElement).value,
                roomFacilities,
                setRoomFacilities
              );
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
      </Box>

      {/* Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomFilter;
