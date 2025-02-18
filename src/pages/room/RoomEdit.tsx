import React, { useEffect, useState } from "react";
import BackPageContainer from "../../common/components/container/BackPageContainer";
import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import { RoomFacilityDTO } from "../../types/room_facility";
import { RoomLocationDTO } from "../../types/room_location";
import { RoomTypeDTO } from "../../types/room_type";
import { GetAllRoomFacilities } from "../../common/apis/room_facility/queries";
import { GetAllRoomLocations } from "../../common/apis/room_location/queries";
import { GetAllRoomTypes } from "../../common/apis/room_type/queries";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { UpdateRoom } from "../../common/apis/room/manipulates";
import { RoomModelUpdate } from "../../types/room";
import toast from "react-hot-toast";
import {
  RoomServiceCreateModel,
  RoomServiceModel,
} from "../../types/room_service";
import {
  CreateRoomService,
  DeleteRoomService,
} from "../../common/apis/room_service/manipulates";
import { GetRoomsModel } from "../../common/apis/room/queries";
import { GetRoomServicesModel } from "../../common/apis/room_service/queries";
import { RoomAuthorizationModel } from "../../types/room_authorization";
import {
  DeleteRoomAuthorization,
  SaveRoomAuthorization,
} from "../../common/apis/room_authorization/manipulates";
import { GetAllRoomAuthorizations } from "../../common/apis/room_authorization/queries";

import { SystemRole } from "../../types/sys_role";
import { GetAllSystemRoles } from "../../common/apis/system/system_role/queries";
import { roleNameMappingToTH } from "./scripts/roleNameMappingToTH";
import { useParams } from "react-router-dom";
import { GetAllRoomAttachments } from "../../common/apis/room_attachment/queries";

import { RoomAttachmentModel } from "../../types/room_attactment";
import {
  CreateRoomAttachment,
  DeleteRoomAttachment,
  UpdateRoomAttachmentPosition,
} from "../../common/apis/room_attachment/manipulates";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDoubleUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export interface ImagePreview {
  id?: number;
  src: string;
  title?: string;
}

const RoomEdit: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [open, setOpen] = React.useState(true);
  const [rooms, setRooms] = useState<RoomModelUpdate[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeDTO[]>([]);
  const [roomLocations, setRoomLocations] = useState<RoomLocationDTO[]>([]);
  const [roomFacilities, setRoomFacilities] = useState<RoomFacilityDTO[]>([]);
  const [roomServices, setRoomServices] = useState<RoomServiceModel[]>([]);
  const [roomAuthorities, setRoomAuthorities] = useState<
    RoomAuthorizationModel[]
  >([]);
  const [filteredRoomServices, setFilteredRoomServices] = useState<
    RoomServiceModel[]
  >([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [formData, setFormData] = useState<RoomModelUpdate>({
    id: 0,
    name: "",
    type_id: 1,
    location_id: 1,
    capacity: 0,
    description: "",
    activation: true,
    booking_interval_minutes: 0,
    open_time: dayjs().set("hour", 0).set("minute", 0).format("HH:mm"),
    close_time: dayjs().set("hour", 0).set("minute", 0).format("HH:mm"),
  });

  const [systemRoles, setSystemRoles] = useState<SystemRole[]>([]);
  const [formFacilities, setFormFacilities] = useState<
    RoomServiceCreateModel[]
  >([]);
  const [formAuthorizations, setFormAuthorizations] = useState<
    RoomAuthorizationModel[]
  >([]);
  const [roomImagePreviews, setRoomImagePreviews] = useState<ImagePreview[]>(
    []
  );
  const [roomImagePreviewsMap, setRoomImagePreviewsMap] = useState<{
    [key: number]: ImagePreview[];
  }>({});
  const [NewformAttachmentFiles, setNewFormAttachmentFiles] = useState<File[]>(
    []
  );
  const [currentFormAttachmentData, setCurrentFormAttachmentData] = useState<
    RoomAttachmentModel[]
  >([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fetchData = async () => {
    try {
      const [
        roomsResponse,
        roomTypesResponse,
        roomLocationsResponse,
        roomFacilitiesResponse,
        roomServicesResponse,
        roomAuthoritiesResponse,
        systemRolesResponse,
        roomAttachmentsResponse,
      ] = await Promise.all([
        GetRoomsModel(),
        GetAllRoomTypes(),
        GetAllRoomLocations(),
        GetAllRoomFacilities(),
        GetRoomServicesModel(),
        GetAllRoomAuthorizations(),
        GetAllSystemRoles(),
        GetAllRoomAttachments(),
      ]);

      if (
        !roomTypesResponse.result ||
        !roomLocationsResponse.result ||
        !roomFacilitiesResponse.result ||
        !roomsResponse.result ||
        !roomServicesResponse.result ||
        !roomAuthoritiesResponse.result ||
        !systemRolesResponse.result ||
        !roomAttachmentsResponse.result
      ) {
        throw new Error("Failed to fetch data");
      }

      const roomsData = Array.isArray(roomsResponse.result)
        ? roomsResponse.result.sort((a, b) => a.id - b.id)
        : [];
      setRooms(roomsData);
      setRoomTypes(roomTypesResponse.result);
      setRoomLocations(roomLocationsResponse.result);
      setRoomFacilities(roomFacilitiesResponse.result);
      setRoomServices(
        Array.isArray(roomServicesResponse.result)
          ? roomServicesResponse.result
          : []
      );
      setSystemRoles(
        Array.isArray(systemRolesResponse.result)
          ? systemRolesResponse.result
          : []
      );

      setRoomAuthorities(
        Array.isArray(roomAuthoritiesResponse.result)
          ? roomAuthoritiesResponse.result
          : []
      );

      setRoomImagePreviewsMap(
        roomsData.reduce((acc, room) => {
          const attachments = Array.isArray(roomAttachmentsResponse.result)
            ? roomAttachmentsResponse.result
                .filter((attachment) => attachment.room_id === room.id)
                .sort((a, b) => a.position - b.position)
            : [];
          return {
            ...acc,
            [room.id]: attachments.map((attachment) => ({
              id: attachment.id,
              src: attachment.path,
            })),
          };
        }, {} as { [key: number]: ImagePreview[] })
      );

      if (roomsData.length > 0) {
        const currentRoomId = selectedRoomId || Number(roomId);
        const currentRoom =
          roomsData.find((room) => room.id === currentRoomId) || Number(roomId);

        setSelectedRoomId(currentRoom.id);
        setFormData({
          id: currentRoom.id,
          name: currentRoom.name,
          type_id: currentRoom.type_id,
          location_id: currentRoom.location_id,
          capacity: currentRoom.capacity,
          description: currentRoom.description,
          activation: currentRoom.activation,
          booking_interval_minutes: currentRoom.booking_interval_minutes,
          open_time: currentRoom.open_time,
          close_time: currentRoom.close_time,
        });

        const initialRoomServices = Array.isArray(roomServicesResponse.result)
          ? roomServicesResponse.result.filter(
              (service: RoomServiceModel) => service.room_id === currentRoom.id
            )
          : [];
        setFilteredRoomServices(initialRoomServices);
        setFormFacilities(
          initialRoomServices.map((service) => ({
            facility_id: service.facility_id,
            room_id: service.room_id,
          }))
        );
        const initialRoomAuthorities: RoomAuthorizationModel[] = Array.isArray(
          roomAuthoritiesResponse.result
        )
          ? roomAuthoritiesResponse.result.filter(
              (auth: RoomAuthorizationModel) => auth.room_id === currentRoom.id
            )
          : [];

        setFormAuthorizations(initialRoomAuthorities);

        setCurrentFormAttachmentData(
          Array.isArray(roomAttachmentsResponse.result)
            ? roomAttachmentsResponse.result
            : []
        );

        setRoomImagePreviewsMap(
          roomsData.reduce((acc, room) => {
            const attachments = Array.isArray(roomAttachmentsResponse.result)
              ? roomAttachmentsResponse.result
                  .filter((attachment) => attachment.room_id === room.id)
                  .sort((a, b) => a.position - b.position)
              : [];
            return {
              ...acc,
              [room.id]: attachments.map((attachment) => ({
                id: attachment.id,
                src: attachment.path,
              })),
            };
          }, {} as { [key: number]: ImagePreview[] })
        );

        setRoomImagePreviews(
          roomsData.reduce((acc, room) => {
            const attachments = Array.isArray(roomAttachmentsResponse.result)
              ? roomAttachmentsResponse.result
                  .filter((attachment) => attachment.room_id === room.id)
                  .sort((a, b) => a.position - b.position)
              : [];
            return {
              ...acc,
              [room.id]: attachments.map((attachment) => ({
                id: attachment.id,
                src: attachment.path,
                title: attachment.path.split("/").pop(),
              })),
            };
          }, {} as { [key: number]: ImagePreview[] })[currentRoomId] || []
        );
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roomId]);

  const handleClose = () => {
    setOpen(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (formData.capacity <= 0)
      newErrors.capacity = "Capacity must be greater than 0";
    if (!formData.description)
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRoom = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const createdRoom = await UpdateRoom({
        ...formData,
        booking_interval_minutes: Number(formData.booking_interval_minutes),
      }); // Call API to create room
      if (createdRoom.result) {
        const roomId = createdRoom.result.id; // Get the newly created room's ID

        // console.log("Updated Room is :", createdRoom.result);
        // Use roomId to link facilities with the room
        for (const facility of filteredRoomServices) {
          if (
            !formFacilities.some((f) => f.facility_id === facility.facility_id)
          ) {
            await DeleteRoomService(facility.id);
          }
        }
        for (const facility of formFacilities) {
          if (
            !filteredRoomServices.some(
              (f) => f.facility_id === facility.facility_id
            )
          ) {
            await CreateRoomService({
              facility_id: facility.facility_id,
              room_id: roomId,
            });
          }
        }

        // Use roomId to link authorizations with the room
        for (const authorization of formAuthorizations) {
          await SaveRoomAuthorization({
            ...authorization,
            room_id: roomId,
          });
        }
        let counter = 0;
        for (let idx = 0; idx < roomImagePreviews.length; idx++) {
          if (roomImagePreviews[idx].src.startsWith("blob:")) {
            if (NewformAttachmentFiles[counter]) {
              await CreateRoomAttachment({
                room_id: roomId,
                file: NewformAttachmentFiles[counter],
                position: idx + 1,
              });
              counter++;
            } else {
              console.error(
                "File not found for preview:",
                roomImagePreviews[idx]
              );
            }
          } else {
            const attachment = currentFormAttachmentData.find(
              (attachment) =>
                attachment.path === roomImagePreviews[idx].src &&
                attachment.id === roomImagePreviews[idx].id
            );
            if (attachment) {
              console.log(
                "Updating attachment id :",
                attachment.id,
                "position : ",
                idx + 1
              );
              await UpdateRoomAttachmentPosition({
                id: attachment.id!,
                position: (idx + 1).toString(),
              });
            }
          }
        }

        toast.success("Room Updated successfully");
        fetchData();
      } else {
        throw new Error("Failed to create room: result is undefined");
      }
    } catch (error) {
      toast.error("Failed to Update");
      console.error("Failed to Update room:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "capacity" || name === "booking_interval_minutes"
          ? Number(value)
          : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const { value } = event.target;
    setFormFacilities((prev) => {
      if (checked) {
        return [
          ...prev,
          { facility_id: Number(value), room_id: selectedRoomId! },
        ];
      } else {
        return prev.filter(
          (facility) => facility.facility_id !== Number(value)
        );
      }
    });
  };

  const handleCreateAuthorizationChange = async (
    role_id: number,
    checked: boolean
  ) => {
    if (checked) {
      setFormAuthorizations((prev) => [
        ...prev,
        {
          room_id: selectedRoomId!,
          role_id,
          requires_confirmation: false,
        },
      ]);
    } else {
      const authorizationToDelete = formAuthorizations.find(
        (auth) => auth.role_id === role_id
      );
      if (authorizationToDelete) {
        if (authorizationToDelete && authorizationToDelete.id !== undefined) {
          await DeleteRoomAuthorization(authorizationToDelete.id);
        }
        setFormAuthorizations((prev) =>
          prev.filter((auth) => auth.role_id !== role_id)
        );
      }
    }
  };

  const handleAuthorizationChange = (role_id: number, checked: boolean) => {
    setFormAuthorizations((prev) =>
      prev.map((auth) =>
        auth.role_id === role_id
          ? {
              ...auth,
              requires_confirmation: checked,
            }
          : auth
      )
    );
  };

  const handleRoomSelectChange = (event: SelectChangeEvent<number>) => {
    const roomId = event.target.value as number;
    setSelectedRoomId(roomId);
    const selectedRoom = rooms.find((room) => room.id === roomId);
    if (selectedRoom) {
      setFormData({
        id: selectedRoom.id,
        name: selectedRoom.name,
        type_id: selectedRoom.type_id,
        location_id: selectedRoom.location_id,
        capacity: selectedRoom.capacity,
        description: selectedRoom.description,
        activation: selectedRoom.activation,
        booking_interval_minutes: selectedRoom.booking_interval_minutes,
        open_time: selectedRoom.open_time,
        close_time: selectedRoom.close_time,
      });

      const selectedRoomServices = roomServices.filter(
        (service) => service.room_id === roomId
      );
      setFilteredRoomServices(selectedRoomServices);
      setFormFacilities(
        selectedRoomServices.map((service) => ({
          facility_id: service.facility_id,
          room_id: service.room_id,
        }))
      );
      const selectedRoomAuthorities = roomAuthorities.filter(
        (auth) => auth.room_id === roomId
      );
      setFormAuthorizations(selectedRoomAuthorities);
      setRoomImagePreviews(roomImagePreviewsMap[roomId] || []);
      setNewFormAttachmentFiles([]);
    }
  };

  const handleAddRoomAttachment = () => {
    // Open a file input dialog to upload room attachments
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg,.png,.jpeg";
    input.multiple = true;
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        try {
          const newPreviews: ImagePreview[] = [];
          const newFiles: File[] = [];
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const previewUrl = URL.createObjectURL(file);
            newPreviews.push({ src: previewUrl, title: file.name });
            newFiles.push(file);
          }
          setRoomImagePreviews((prev) => [...prev, ...newPreviews]);
          setNewFormAttachmentFiles((prev) => [...prev, ...newFiles]);
        } catch (error) {
          console.error("Failed to upload attachments:", error);
        }
      }
    };
    input.click();
  };

  const handleRemoveRoomAttachment = async (index: number) => {
    const previewToRemove = roomImagePreviews[index];
    if (previewToRemove.src.startsWith("blob:")) {
      setRoomImagePreviews((prev) => prev.filter((_, idx) => idx !== index));
      setNewFormAttachmentFiles((prev) =>
        prev.filter((_, idx) => idx !== index)
      );
    } else {
      const attachmentToRemove = currentFormAttachmentData.find(
        (attachment) => attachment.id === previewToRemove.id
      );
      if (attachmentToRemove && attachmentToRemove.id !== undefined) {
        await DeleteRoomAttachment(attachmentToRemove.id);
        setRoomImagePreviews((prev) => prev.filter((_, idx) => idx !== index));
        setCurrentFormAttachmentData((prev) =>
          prev.filter((attachment) => attachment.id !== attachmentToRemove.id)
        );
      }
    }
  };

  // console.log("Form Data:", formData);
  // console.log("Room Services:", filteredRoomServices);
  // console.log("Form Facilities:", formFacilities);
  // console.log("Form Authorizations:", formAuthorizations);
  // console.log(formAuthorizations);
  // console.log(roomAuthorities);

  console.log("Selected Room ID:", selectedRoomId);
  console.log("Room Image Previews:", roomImagePreviews);
  console.log("Room Image Previews Map:", roomImagePreviewsMap);
  console.log("Room Attachments:", NewformAttachmentFiles);
  console.log("Room Attachments Data:", currentFormAttachmentData);

  return (
    <BackPageContainer
      title={"แก้ไขห้อง"}
      description="เลือกห้องที่ต้องการแก้ไขและกรอกรายละเอียดที่ต้องการแสดงให้ครบถ้วน"
    >
      <div className="p-4 sm:p-8 bg-white rounded-xl shadow-md w-full sm:w-4/5">
        {open && (
          <Alert severity="info" onClose={handleClose}>
            โปรดกรอกรายละเอียดของห้องที่ต้องการแก้ไขให้ครบถ้วนก่อนที่จะกดยืนยันการแก้ไข
          </Alert>
        )}
        <div className="flex flex-col items-center mb-4 w-full p-4">
          <FormControl size="small" variant="filled" fullWidth>
            <InputLabel id="select-room-label">เลือกห้อง</InputLabel>
            <Select
              labelId="select-room-label"
              id="select-room"
              value={selectedRoomId || ""}
              onChange={handleRoomSelectChange}
              className="w-full"
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="flex flex-col items-center my-8 gap-6 w-full">
            <TextField
              label="ชื่อห้อง"
              variant="outlined"
              size="small"
              className="w-full sm:w-1/2"
              name="name"
              onChange={handleChange}
              value={formData.name}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              id="outlined-multiline-static"
              label="รายละเอียดห้อง"
              multiline
              rows={3}
              className="w-full sm:w-2/3"
              name="description"
              onChange={handleChange}
              value={formData.description}
              error={!!errors.description}
              helperText={errors.description}
            />
          </div>
          <div className="flex flex-col lg:flex-row items-start justify-center gap-10 w-full h-full">
            <div className="flex flex-col p-4 sm:p-8 bg-white rounded-xl shadow-lg w-full lg:w-3/5 h-full">
              <div className="flex flex-col gap-4">
                {" "}
                <span>อัพโหลดภาพห้องที่ต้องการแสดง</span>
                <Button
                  variant="contained"
                  onClick={handleAddRoomAttachment}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    textTransform: "none",
                  }}
                >
                  อัพโหลด
                </Button>
                <label className="my-2 text-sm font-light text-gray-500">
                  Only support .jpg, .jpeg ,.png
                </label>
              </div>

              {roomImagePreviews.map((src, idx) => (
                <div
                  key={idx}
                  className={`relative flex flex-col 2xl:flex-row items-center justify-between gap-2 my-2 border border-gray-300 rounded-lg p-4 ${
                    idx === 0 ? "bg-yellow-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={
                        src.src.startsWith("blob:")
                          ? src.src
                          : `${API_ENDPOINT_URL}${src.src}`
                      }
                      alt={`Preview-${idx}`}
                      className="hover:scale-105 transition-transform duration-300 cursor-pointer rounded-md"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                      }}
                      onClick={() =>
                        window.open(
                          src.src.startsWith("blob:")
                            ? src.src
                            : `${API_ENDPOINT_URL}${src.src}`,
                          "_blank"
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-3  gap-2">
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (idx > 0) {
                          const newPreviews = [...roomImagePreviews];
                          [newPreviews[idx - 1], newPreviews[idx]] = [
                            newPreviews[idx],
                            newPreviews[idx - 1],
                          ];
                          setRoomImagePreviews(newPreviews);
                          const newAttachments = [...NewformAttachmentFiles];
                          if (newAttachments[idx - 1] && newAttachments[idx]) {
                            [newAttachments[idx - 1], newAttachments[idx]] = [
                              newAttachments[idx],
                              newAttachments[idx - 1],
                            ];
                          }
                          setNewFormAttachmentFiles(newAttachments);
                        }
                      }}
                      disabled={idx === 0}
                      size="small"
                    >
                      <ArrowUpIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (idx < roomImagePreviews.length - 1) {
                          const newPreviews = [...roomImagePreviews];
                          [newPreviews[idx + 1], newPreviews[idx]] = [
                            newPreviews[idx],
                            newPreviews[idx + 1],
                          ];
                          setRoomImagePreviews(newPreviews);
                          const newAttachments = [...NewformAttachmentFiles];
                          if (newAttachments[idx + 1] && newAttachments[idx]) {
                            [newAttachments[idx + 1], newAttachments[idx]] = [
                              newAttachments[idx],
                              newAttachments[idx + 1],
                            ];
                          }
                          setNewFormAttachmentFiles(newAttachments);
                        }
                      }}
                      disabled={idx === roomImagePreviews.length - 1}
                      size="small"
                    >
                      <ArrowDownIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        const newPreviews = [...roomImagePreviews];
                        const [movedPreview] = newPreviews.splice(idx, 1);
                        newPreviews.unshift(movedPreview);
                        setRoomImagePreviews(newPreviews);
                        const newAttachments = [...NewformAttachmentFiles];
                        if (newAttachments[idx]) {
                          const [movedAttachment] = newAttachments.splice(
                            idx,
                            1
                          );
                          newAttachments.unshift(movedAttachment);
                        }
                        setNewFormAttachmentFiles(newAttachments);
                      }}
                      disabled={idx === 0}
                      size="small"
                    >
                      <ChevronDoubleUpIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <div
                    onClick={() => handleRemoveRoomAttachment(idx)}
                    className="absolute cursor-pointer border rounded-full w-fit p-1 top-2 right-2 hover:bg-gray-200"
                  >
                    <XMarkIcon className="size-4 text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col flex-grow-0 w-full lg:w-2/5 gap-6">
              <FormControl size="small" variant="standard" fullWidth>
                <InputLabel id="select-label" size="small">
                  ประเภทห้อง
                </InputLabel>
                <Select
                  labelId="select-label"
                  id="select-demo"
                  label="ประเภทห้อง"
                  name="type_id"
                  value={formData.type_id}
                  onChange={handleSelectChange}
                  className="w-full"
                >
                  {roomTypes.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" variant="standard" fullWidth>
                <InputLabel id="select-location-label" size="small">
                  สถานที่
                </InputLabel>
                <Select
                  labelId="select-location-label"
                  id="select-location"
                  label="สถานที่"
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleSelectChange}
                  className="w-full"
                >
                  {roomLocations.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="ความจุ (ที่นั่ง)"
                variant="standard"
                size="small"
                className="w-full"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                error={!!errors.capacity}
                helperText={errors.capacity}
              />
              <FormControl>
                <FormLabel>
                  <div className="text-sm">
                    สิ่งอำนวยความสะดวก (Room Service)
                  </div>
                </FormLabel>
                <FormGroup>
                  {roomFacilities.map((facility) => (
                    <FormControlLabel
                      key={facility.id}
                      control={
                        <Checkbox
                          value={facility.id}
                          onChange={handleCheckboxChange}
                          checked={formFacilities.some(
                            (f) => f.facility_id === facility.id
                          )}
                        />
                      }
                      label={facility.name}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormLabel>
                  <div className="text-sm">
                    ช่วงเวลาที่ห้องเปิดให้สามารถจองได้
                  </div>
                </FormLabel>
                <div className="flex flex-col sm:flex-row gap-4">
                  <DesktopTimePicker
                    defaultValue={dayjs().set("hour", 0).set("minute", 0)}
                    label="Start time"
                    ampm={false}
                    onChange={(newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        open_time: newValue?.format("HH:mm") || "",
                      }))
                    }
                    value={dayjs(formData.open_time, "HH:mm")}
                  />
                  <DesktopTimePicker
                    defaultValue={dayjs().set("hour", 0).set("minute", 0)}
                    label="End Time"
                    ampm={false}
                    onChange={(newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        close_time: newValue?.format("HH:mm") || "",
                      }))
                    }
                    value={dayjs(formData.close_time, "HH:mm")}
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <TextField
                    defaultValue={0}
                    label="เวลาขั้นต่ำในการจองห้อง"
                    className="w-full"
                    name="booking_interval_minutes"
                    onChange={handleChange}
                    value={formData.booking_interval_minutes}
                    error={!!errors.booking_interval_minutes}
                    helperText={errors.booking_interval_minutes}
                  />
                  <div className="w-full sm:w-1/6">นาที</div>
                </div>
              </LocalizationProvider>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>จองได้?</TableCell>
                    <TableCell>ต้องอนุมัติ?</TableCell>
                    <TableCell>ตำแหน่ง</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {systemRoles.map((role) => {
                    const isChecked =
                      formAuthorizations.find(
                        (auth) => auth.role_id === role.id
                      ) !== undefined;
                    return (
                      <TableRow key={role.id}>
                        <TableCell>
                          <Checkbox
                            checked={isChecked}
                            onChange={(e) =>
                              role.id !== undefined &&
                              handleCreateAuthorizationChange(
                                role.id,
                                e.target.checked
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={
                              formAuthorizations.find(
                                (auth) => auth.role_id === role.id
                              )?.requires_confirmation === true
                            }
                            onChange={(e) =>
                              role.id !== undefined &&
                              handleAuthorizationChange(
                                role.id,
                                e.target.checked
                              )
                            }
                            color="primary"
                            disabled={!isChecked}
                          />
                        </TableCell>
                        <TableCell>{roleNameMappingToTH(role.role)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
          <button
            className="mt-16 rounded-full p-2 px-12 bg-gradient-to-r from-[#FFC163] via-[#FD7427] to-[#E54A5F] text-white"
            onClick={handleCreateRoom}
          >
            ยืนยันการแก้ไข
          </button>
        </div>
      </div>
    </BackPageContainer>
  );
};

export default RoomEdit;
