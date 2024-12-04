import React, { useEffect, useState } from "react";
import BackPageContainer from "../../common/components/container/BackPageContainer";
import {
  Alert,
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
  TextField,
} from "@mui/material";

import AttachImage from "./components/AttachImage";
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
import { CreateRoom } from "../../common/apis/room/manipulates";
import { RoomModel } from "../../types/room";
import toast from "react-hot-toast";
import { RoomServiceCreateModel } from "../../types/room_service";
import { CreateRoomService } from "../../common/apis/room_service/manipulates";
import { RoomAuthorizationCreateModel } from "../../types/room_authorization";
import { CreateRoomAuthorization } from "../../common/apis/room_authorization/manipulates";
import { Role } from "../../types";

const RoomManipulatePage: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const [requireConfirmation, setRequireConfirmation] = React.useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomTypeDTO[]>([]);
  const [roomLocations, setRoomLocations] = useState<RoomLocationDTO[]>([]);
  const [roomFacilities, setRoomFacilities] = useState<RoomFacilityDTO[]>([]);
  const [formData, setFormData] = useState<RoomModel>({
    name: "",
    type_id: 1,
    location_id: 1,
    capacity: 0,
    description: "",
    requires_confirmation: false,
    activation: true,
    booking_interval_minutes: 0,
    open_time: dayjs().set("hour", 0).set("minute", 0).format("HH:mm"),
    close_time: dayjs().set("hour", 0).set("minute", 0).format("HH:mm"),
  });

  const [formFacilities, setFormFacilities] = useState<
    RoomServiceCreateModel[]
  >([]);
  const [formAuthorizations, setFormAuthorizations] = useState<
    RoomAuthorizationCreateModel[]
  >([
    { room_id: 0, role: "STUDENT", is_allowed: false },
    { room_id: 0, role: "EMPLOYEE", is_allowed: false },
    { room_id: 0, role: "ADMIN", is_allowed: false },
  ]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          roomTypesResponse,
          roomLocationsResponse,
          roomFacilitiesResponse,
        ] = await Promise.all([
          GetAllRoomTypes(),
          GetAllRoomLocations(),
          GetAllRoomFacilities(),
        ]);

        if (
          !roomTypesResponse.result ||
          !roomLocationsResponse.result ||
          !roomFacilitiesResponse.result
        ) {
          throw new Error("Failed to fetch data");
        }

        setRoomTypes(roomTypesResponse.result);
        setRoomLocations(roomLocationsResponse.result);
        setRoomFacilities(roomFacilitiesResponse.result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
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
      const createdRoom = await CreateRoom({
        ...formData,
        booking_interval_minutes: Number(formData.booking_interval_minutes),
      }); // Call API to create room
      if (createdRoom.result) {
        const roomId = createdRoom.result.id; // Get the newly created room's ID
        console.log("Room created successfully with ID:", roomId);
        console.log("New Room:", createdRoom.result);
        // Use roomId to link facilities with the room
        for (const facility of formFacilities) {
          await CreateRoomService({
            facility_id: facility.facility_id,
            room_id: roomId,
          });
        }

        // Use roomId to link authorizations with the room
        for (const authorization of formAuthorizations) {
          await CreateRoomAuthorization({
            ...authorization,
            room_id: roomId,
          });
        }

        toast.success("Room created successfully");
        console.log("Room created successfully with ID:", roomId);
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

  const handleAuthorizationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    role: Role
  ) => {
    const { checked } = event.target;
    setFormAuthorizations((prev) => {
      const existingAuth = prev.find((auth) => auth.role === role);
      if (existingAuth) {
        return prev.map((auth) =>
          auth.role === role ? { ...auth, is_allowed: checked } : auth
        );
      } else {
        return [
          ...prev,
          {
            room_id: 0,
            role,
            is_allowed: checked,
          },
        ];
      }
    });
  };

  console.log("Form Data:", formData);
  console.log("Form Facilities:", formFacilities);
  console.log("Form Authorizations:", formAuthorizations);

  return (
    <BackPageContainer
      title={"สร้างห้องใหม่"}
      description="เลือกและกรอกรายละเอียดที่ต้องการแสดงให้ครบถ้วน"
    >
      <div className="p-8 bg-white rounded-xl shadow-md w-4/5">
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
              className="w-1/2"
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
              className="w-2/3"
              name="description"
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </div>
          <div className="flex items-start justify-center gap-10 w-full h-full">
            <div className="flex flex-col p-8 bg-white rounded-xl shadow-lg w-3/5 h-full">
              <span>อัพโหลดภาพห้องที่ต้องการแสดง</span>

              <AttachImage
                placeholder={false}
                handleAttachImage={() => {}}
                image={"/imgs/icon.svg"}
              />
              <label className="my-2 text-sm font-light text-gray-500">
                Only support .jpg, .png and .svg and zip files
              </label>
            </div>
            <div className="flex flex-col flex-grow-0 w-2/5 gap-6">
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
                <div className="flex flex-row gap-4">
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
                <div className="flex flex-row items-center gap-4">
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
                  <div className="w-1/6">นาที</div>
                </div>
              </LocalizationProvider>
              <FormControlLabel
                className="gap-2 text-red-500 bg-gray-50 rounded-full p-2"
                control={
                  <Switch
                    checked={requireConfirmation}
                    onChange={(e) => {
                      setRequireConfirmation(e.target.checked);
                      setFormData((prev) => ({
                        ...prev,
                        requires_confirmation: e.target.checked,
                      }));
                    }}
                    color="error"
                    size="small"
                  />
                }
                label="ต้องขออนุมัติก่อนใช้งานห้อง"
              />
              <FormControl>
                <FormLabel>
                  <div className="text-sm">การอนุญาต (Authorizations)</div>
                </FormLabel>
                <FormGroup>
                  {(["STUDENT", "EMPLOYEE", "ADMIN"] as Role[]).map((role) => (
                    <FormControlLabel
                      key={role}
                      control={
                        <Checkbox
                          onChange={(e) => handleAuthorizationChange(e, role)}
                        />
                      }
                      label={role}
                    />
                  ))}
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
    </BackPageContainer>
  );
};

export default RoomManipulatePage;
