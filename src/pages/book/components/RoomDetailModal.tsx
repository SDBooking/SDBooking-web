import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  ImageList,
  ImageListItem,
  Box,
  Container,
} from "@mui/material";
import { Room } from "../../../types/room";
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  LockClosedIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BookingCreateModel } from "../../../types/booking";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useAccountContext from "../../../common/contexts/AccountContext";
import toast from "react-hot-toast";
import {
  CreateBook,
  CreateBookPending,
} from "../../../common/apis/booking/manipulates";

dayjs.extend(utc);
dayjs.extend(timezone);

interface RoomDetailModalProps extends Room {
  isOpen: boolean;
  onClose: () => void;
  services?: string[];
  images?: string[];
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  id,
  isOpen,
  onClose,
  name,
  type,
  location,
  capacity,
  description,
  services,
  requires_confirmation,
  images,
}) => {
  const { accountData } = useAccountContext();

  if (!accountData) {
    return null;
  }

  const [formData, setFormData] = useState<BookingCreateModel>({
    room_id: id,
    account_id: accountData?.userData.cmuitaccount,
    start_time: dayjs().tz("Asia/Bangkok").toDate(),
    end_time: dayjs().tz("Asia/Bangkok").toDate(),
    date: dayjs().tz("Asia/Bangkok").toDate(),
    title: "",
    tel: "",
    reason: "",
    status: "APPROVED",
    confirmed_by: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.tel) newErrors.tel = "Contact number is required";
    if (!formData.reason) newErrors.reason = "Reason is required";
    return newErrors;
  };

  const handleCreateBookSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Format the dates correctly before sending them in the POST request
    const formattedFormData = {
      ...formData,
      start_time: dayjs(formData.start_time).format(),
      end_time: dayjs(formData.end_time).format(),
      date: dayjs(formData.date).format(),
    };

    try {
      if (requires_confirmation) {
        const createBookPendingResponse = await CreateBookPending(
          formattedFormData
        );
        console.log("CreateBookPending", createBookPendingResponse);
        toast.success("Booking created successfully (Pending)");
      } else {
        const createBookApprovedResponse = await CreateBook(formattedFormData);
        console.log("CreateBookApproved", createBookApprovedResponse);
        toast.success("Booking created successfully (Approved)");
      }
    } catch (error) {
      console.error("Error creating booking", error);
      toast.error("Error creating booking");
    }

    onClose();
  };

  console.log("RoomDetailModal", formData);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle className="text-center">{name}</DialogTitle>
      <DialogContent dividers>
        <Box className="text-start my-4">
          <Container
            className="flex justify-start p-4 bg-gray-100 rounded-xl shadow-md"
            maxWidth="sm"
            style={{
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            <Typography variant="body1" color="textPrimary">
              {description}
            </Typography>
          </Container>
        </Box>
        <div className="flex flex-col gap-2 px-4">
          <div className="flex flex-row p-16 gap-8 ">
            <div className="w-2/3 text-center items-center justify-center">
              {images && images.length > 0 ? (
                <ImageList variant="quilted" cols={3} gap={4}>
                  {images.map((image, index) => (
                    <ImageListItem key={index}>
                      <img
                        srcSet={`${image} `}
                        src={`${image}`}
                        alt={`Room image ${index + 1}`}
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <div className="bg-white text-center items-center justify-center p-4 rounded-lg">
                  No Images Available
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <Typography component="div" variant="body1" color="textSecondary">
                <div className="bg-[#FAFAFA] flex flex-row w-full items-center gap-4 p-2 rounded-2xl">
                  <BuildingOfficeIcon className="w-6 h-6 text-maincolor bg-[#FFE7D0] rounded-full p-0.5" />
                  <div className="flex flex-col">
                    <div className="text-black">ประเภท</div>
                    <div className="text-maincolor">{type}</div>
                  </div>
                </div>
              </Typography>
              <Typography component="div" variant="body2" color="textSecondary">
                <div className="bg-[#FAFAFA] flex flex-row w-full items-center gap-4 p-2 rounded-2xl">
                  <MapPinIcon className="w-6 h-6 text-maincolor bg-[#FFE7D0] rounded-full p-0.5" />
                  <div className="flex flex-col">
                    <div className="text-black">สถานที่</div>
                    <div className="text-maincolor">{location}</div>
                  </div>
                </div>
              </Typography>
              <Typography component="div" variant="body2" color="textSecondary">
                <div className="bg-[#FAFAFA] flex flex-row w-full items-center gap-4 p-2 rounded-2xl">
                  <UserIcon className="w-6 h-6 text-maincolor bg-[#FFE7D0] rounded-full p-0.5" />
                  <div className="flex flex-col">
                    <div className="text-black">ความจุ</div>
                    <div className="text-maincolor">
                      จำนวน {capacity} ที่นั่ง
                    </div>
                  </div>
                </div>
              </Typography>

              {services && (
                <div className="bg-[#FAFAFA] flex flex-col w-full items-center p-2 rounded-2xl">
                  <Typography component="div" variant="subtitle2">
                    <div className="flex flex-row gap-4 px-2">
                      <CheckCircleIcon className="w-6 h-6 text-maincolor bg-[#FFE7D0] rounded-full p-0.5" />
                      สิ่งอำนวยความสะดวก (Room Service)
                    </div>
                  </Typography>
                  <ul style={{ paddingLeft: 16 }}>
                    {services.map((service, index) => (
                      <li key={index}>
                        <Typography
                          component="div"
                          variant="body2"
                          className="text-maincolor"
                        >
                          {service}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {requires_confirmation && (
                <Typography
                  component="div"
                  variant="caption"
                  color="error"
                  className="absolute top-0 right-4"
                >
                  <div className="flex flex-row confirmation-required bg-[#E54A5F] text-xs gap-2 text-white p-1 px-2 rounded-xl w-fit my-4">
                    <LockClosedIcon className="size-4" />
                    <span>ต้องขออนุมัติก่อนใช้งาน</span>
                  </div>
                </Typography>
              )}
            </div>
          </div>
          <div className="my-2 text-center flex flex-row items-center justify-center gap-4">
            <div className="border w-2/5 border-[#FD7427]" />
            <div className="text-maincolor">กรอกข้อมูลการจอง</div>
            <div className="border w-2/5 border-[#FD7427]" />
          </div>
          <div className="flex flex-row gap-6 items-center justify-center">
            <div className="w-1/2 text-center">Time Calendar</div>
            <div className="w-1/2 text-center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex flex-col gap-4 w-3/4">
                  <DatePicker
                    className="w-full"
                    value={dayjs(formData.date).tz("Asia/Bangkok")}
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        date: date?.tz("Asia/Bangkok").toDate() || new Date(),
                      })
                    }
                  />
                  <div className="flex flex-row gap-2">
                    <TimePicker
                      label="เวลาที่เริ่มใช้ห้อง"
                      value={dayjs(formData.start_time).tz("Asia/Bangkok")}
                      onChange={(time) =>
                        setFormData({
                          ...formData,
                          start_time:
                            time?.tz("Asia/Bangkok").toDate() || new Date(),
                        })
                      }
                    />
                    <TimePicker
                      label="เวลาที่สิ้นสุด"
                      value={dayjs(formData.end_time).tz("Asia/Bangkok")}
                      onChange={(time) =>
                        setFormData({
                          ...formData,
                          end_time:
                            time?.tz("Asia/Bangkok").toDate() || new Date(),
                        })
                      }
                    />
                  </div>
                  <TextField
                    label="หัวที่ใช้จะใช้ห้อง"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    helperText={errors.title}
                  />
                  <TextField
                    label="เบอร์ติดต่อ"
                    name="tel"
                    type="tel"
                    inputMode="tel"
                    value={formData.tel}
                    onChange={handleChange}
                    error={!!errors.tel}
                    helperText={errors.tel || "ระบุเบอร์ติดต่อเพื่อติดต่อกลับ"}
                  />
                  <TextField
                    id="outlined-multiline-static"
                    label="เหตุผล"
                    multiline
                    rows={3}
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    error={!!errors.reason}
                    helperText={errors.reason || "ระบุเหตุผลที่ต้องการจองห้อง"}
                  />
                </div>
              </LocalizationProvider>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          ปิด
        </Button>
        <Button
          onClick={handleCreateBookSubmit}
          color="primary"
          variant="contained"
        >
          ยืนยันการจอง
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomDetailModal;
