import React, { useEffect, useState } from "react";
import BackPageContainer from "../../common/components/container/BackPageContainer";
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from "@mui/material";

import { RoomFacilityDTO } from "../../types/room_facility";
import { RoomLocationDTO } from "../../types/room_location";
import { RoomTypeDTO } from "../../types/room_type";
import { GetAllRoomFacilities } from "../../common/apis/room_facility/queries";
import { GetAllRoomLocations } from "../../common/apis/room_location/queries";
import { GetAllRoomTypes } from "../../common/apis/room_type/queries";
import { GetAllSystemRoles } from "../../common/apis/system/system_role/queries";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { CreateRoom } from "../../common/apis/room/manipulates";
import { RoomModel } from "../../types/room";
import toast from "react-hot-toast";
import { RoomServiceCreateModel } from "../../types/room_service";
import { CreateRoomService } from "../../common/apis/room_service/manipulates";
import { RoomAuthorizationCreateModel } from "../../types/room_authorization";
import { CreateRoomAuthorization } from "../../common/apis/room_authorization/manipulates";
import { SystemRole } from "../../types/sys_role";
import { CreateRoomAttachment } from "../../common/apis/room_attachment/manipulates";
import { ImagePreview } from "./RoomEdit";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDoubleUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const RoomManipulatePage: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const [roomTypes, setRoomTypes] = useState<RoomTypeDTO[]>([]);
  const [roomLocations, setRoomLocations] = useState<RoomLocationDTO[]>([]);
  const [roomFacilities, setRoomFacilities] = useState<RoomFacilityDTO[]>([]);
  const [formData, setFormData] = useState<RoomModel>({
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
  const [roomImagePreviews, setRoomImagePreviews] = useState<ImagePreview[]>(
    []
  );

  const [formFacilities, setFormFacilities] = useState<
    RoomServiceCreateModel[]
  >([]);
  const [formAuthorizations, setFormAuthorizations] = useState<
    RoomAuthorizationCreateModel[]
  >([]);
  const [formAttachments, setFormAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [Loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          roomTypesResponse,
          roomLocationsResponse,
          roomFacilitiesResponse,
          systemRolesResponse,
        ] = await Promise.all([
          GetAllRoomTypes(),
          GetAllRoomLocations(),
          GetAllRoomFacilities(),
          GetAllSystemRoles(),
        ]);

        if (
          !roomTypesResponse.result ||
          !roomLocationsResponse.result ||
          !roomFacilitiesResponse.result ||
          !systemRolesResponse.result
        ) {
          throw new Error("Failed to fetch data");
        }

        setRoomTypes(roomTypesResponse.result);
        setRoomLocations(roomLocationsResponse.result);
        setRoomFacilities(roomFacilitiesResponse.result);
        setSystemRoles(
          Array.isArray(systemRolesResponse.result)
            ? systemRolesResponse.result
            : []
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      setLoading(true);
      const createdRoom = await CreateRoom({
        ...formData,
        booking_interval_minutes: Number(formData.booking_interval_minutes),
      }); // Call API to create room
      if (createdRoom.result) {
        const roomId = createdRoom.result.id; // Get the newly created room's ID

        // Use roomId to link facilities with the room
        for (const facility of formFacilities) {
          await CreateRoomService({
            facility_id: facility.facility_id,
            room_id: roomId,
          });
        }

        // Use roomId to link authorizations with the room
        for (const authorization of formAuthorizations) {
          if (authorization.requires_confirmation !== undefined) {
            await CreateRoomAuthorization({
              ...authorization,
              room_id: roomId,
            });
          }
        }

        for (let idx = 0; idx < formAttachments.length; idx++) {
          await CreateRoomAttachment({
            file: formAttachments[idx],
            room_id: roomId,
            position: idx,
          });
        }

        toast.success("Room created successfully");
        setLoading(false);
      } else {
        throw new Error("Failed to create room: result is undefined");
      }
    } catch (error) {
      toast.error("Failed to create");
      console.error("Failed to create room:", error);
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
    setFormData((prev) => ({ ...prev, [name as string]: value as string }));
    setErrors((prev) => ({ ...prev, [name as string]: "" }));
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const { value } = event.target;
    setFormFacilities((prev) => {
      if (checked) {
        return [...prev, { facility_id: Number(value), room_id: 0 }];
      } else {
        return prev.filter(
          (facility) => facility.facility_id !== Number(value)
        );
      }
    });
  };

  const handleCreateAuthorizationChange = (
    role_id: number,
    checked: boolean
  ) => {
    setFormAuthorizations((prev) => {
      if (checked) {
        return [
          ...prev,
          {
            room_id: 0,
            role_id,
            requires_confirmation: false,
          },
        ];
      } else {
        return prev.filter((auth) => auth.role_id !== role_id);
      }
    });
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

  const handleAddRoomAttachment = () => {
    // Open a file input dialog to upload room attachments
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg,.png";
    input.multiple = true;
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        try {
          const newPreviews: ImagePreview[] = [];
          const newAttachments: File[] = [];
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const previewUrl = URL.createObjectURL(file);
            newPreviews.push({ src: previewUrl, title: file.name });
            newAttachments.push(file);
          }
          setRoomImagePreviews((prev) => [...prev, ...newPreviews]);
          setFormAttachments((prev) => [...prev, ...newAttachments]);
        } catch (error) {
          console.error("Failed to upload attachments:", error);
        }
      }
    };
    input.click();
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(roomImagePreviews);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRoomImagePreviews(items);
  };

  const handleRemoveRoomAttachment = (index: number) => {
    setRoomImagePreviews((prev) => prev.filter((_, idx) => idx !== index));
    setFormAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <BackPageContainer
      title={"สร้างห้องใหม่"}
      description="เลือกและกรอกรายละเอียดที่ต้องการแสดงให้ครบถ้วน"
    >
      <div className="p-4 sm:p-8 bg-white rounded-xl shadow-md w-full sm:w-4/5">
        {open && (
          <Alert severity="info" onClose={handleClose}>
            โปรดกรอกรายละเอียดของห้องที่ต้องการสร้างให้ครบถ้วนก่อนที่จะกดยืนยันการสร้าง
          </Alert>
        )}
        <div className="flex flex-col items-center mb-4 w-full p-4">
          <div className="flex flex-col items-center my-8 gap-6 w-full">
            <TextField
              label="ชื่อห้อง"
              variant="outlined"
              size="small"
              className="w-full sm:w-1/2"
              name="name"
              onChange={handleChange}
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
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="roomImagePreviews">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {roomImagePreviews.map((src, idx) => (
                        <Draggable
                          key={idx}
                          draggableId={`item-${idx}`}
                          index={idx}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`relative flex flex-col 2xl:flex-row items-center justify-between gap-2 my-2 border bg-white border-gray-300 rounded-lg p-4 ${
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
                              <div className="grid grid-cols-3 gap-2">
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    if (idx > 0) {
                                      const newPreviews = [
                                        ...roomImagePreviews,
                                      ];
                                      [newPreviews[idx - 1], newPreviews[idx]] =
                                        [
                                          newPreviews[idx],
                                          newPreviews[idx - 1],
                                        ];
                                      setRoomImagePreviews(newPreviews);
                                      const newAttachments = [
                                        ...formAttachments,
                                      ];
                                      if (
                                        newAttachments[idx - 1] &&
                                        newAttachments[idx]
                                      ) {
                                        [
                                          newAttachments[idx - 1],
                                          newAttachments[idx],
                                        ] = [
                                          newAttachments[idx],
                                          newAttachments[idx - 1],
                                        ];
                                      }
                                      setFormAttachments(newAttachments);
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
                                      const newPreviews = [
                                        ...roomImagePreviews,
                                      ];
                                      [newPreviews[idx + 1], newPreviews[idx]] =
                                        [
                                          newPreviews[idx],
                                          newPreviews[idx + 1],
                                        ];
                                      setRoomImagePreviews(newPreviews);
                                      const newAttachments = [
                                        ...formAttachments,
                                      ];
                                      if (
                                        newAttachments[idx + 1] &&
                                        newAttachments[idx]
                                      ) {
                                        [
                                          newAttachments[idx + 1],
                                          newAttachments[idx],
                                        ] = [
                                          newAttachments[idx],
                                          newAttachments[idx + 1],
                                        ];
                                      }
                                      setFormAttachments(newAttachments);
                                    }
                                  }}
                                  disabled={
                                    idx === roomImagePreviews.length - 1
                                  }
                                  size="small"
                                >
                                  <ArrowDownIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    const newPreviews = [...roomImagePreviews];
                                    const [movedPreview] = newPreviews.splice(
                                      idx,
                                      1
                                    );
                                    newPreviews.unshift(movedPreview);
                                    setRoomImagePreviews(newPreviews);
                                    const newAttachments = [...formAttachments];
                                    if (newAttachments[idx]) {
                                      const [movedAttachment] =
                                        newAttachments.splice(idx, 1);
                                      newAttachments.unshift(movedAttachment);
                                    }
                                    setFormAttachments(newAttachments);
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
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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
                <InputLabel id="select-label">สถานที่</InputLabel>
                <Select
                  labelId="select-label"
                  id="select-demo"
                  label="สถานที่"
                  name="location_id"
                  onChange={handleSelectChange}
                  value={formData.location_id}
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
              <FormControl>
                <FormLabel>
                  <div className="text-sm">การอนุญาต (Authorizations)</div>
                </FormLabel>
                <FormGroup>
                  {systemRoles.map((role) => {
                    const isChecked =
                      formAuthorizations.find(
                        (auth) => auth.role_id === role.id
                      ) !== undefined;
                    return (
                      <div key={role.id} className="flex items-center gap-2">
                        <FormControlLabel
                          control={
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
                          }
                          label={role.role}
                        />
                        <Switch
                          checked={
                            formAuthorizations.find(
                              (auth) => auth.role_id === role.id
                            )?.requires_confirmation === true
                          }
                          onChange={(e) =>
                            role.id !== undefined &&
                            handleAuthorizationChange(role.id, e.target.checked)
                          }
                          color="primary"
                          disabled={!isChecked}
                        />
                      </div>
                    );
                  })}
                </FormGroup>
              </FormControl>
            </div>
          </div>
          <button
            className="mt-16 rounded-full p-2 px-12 bg-gradient-to-r from-[#FFC163] via-[#FD7427] to-[#E54A5F] text-white"
            onClick={handleCreateRoom}
          >
            ยืนยันการสร้าง
          </button>
        </div>
      </div>
      {Loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
            <div className="flex flex-col justify-center items-center h-full gap-8">
              <CircularProgress size={60} thickness={5} />
              <p> กำลังอัพโหลดข้อมูลกรุณารอสักครู่ </p>
            </div>
          </div>
        </div>
      )}
    </BackPageContainer>
  );
};

export default RoomManipulatePage;
