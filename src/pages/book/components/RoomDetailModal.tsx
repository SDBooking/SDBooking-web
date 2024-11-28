import React, { useEffect, useState } from "react";
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
  FormHelperText,
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
import { Booking, BookingCreateModel } from "../../../types/booking";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";
import useAccountContext from "../../../common/contexts/AccountContext";
import toast from "react-hot-toast";
import {
  CreateBook,
  CreateBookPending,
} from "../../../common/apis/booking/manipulates";
import { GetBookByRoomId } from "../../../common/apis/booking/queries";
import TimeCalendar from "./TimeCalendar";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

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
  booking_interval_minutes,
}) => {
  const { accountData } = useAccountContext();

  if (!accountData) {
    return null;
  }

  const [formData, setFormData] = useState<BookingCreateModel>({
    room_id: id,
    account_id: accountData?.userData.cmuitaccount,
    start_time: dayjs().tz("Asia/Bangkok").minute(0).toDate(),
    end_time: dayjs()
      .tz("Asia/Bangkok")
      .minute(0)
      .add(booking_interval_minutes || 10, "minute")
      .toDate(),
    date: dayjs().tz("Asia/Bangkok").toDate(),
    title: "",
    tel: "",
    reason: "",
    status: "APPROVED",
    confirmed_by: "",
  });

  const [books, setBooks] = useState<Booking[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [timeError, setTimeError] = useState<string>("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const roomResponse = await GetBookByRoomId(id);
        if (Array.isArray(roomResponse.result)) {
          setBooks(roomResponse.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTimeChange = (
    field: "start_time" | "end_time",
    value: dayjs.Dayjs | null
  ) => {
    if (value) {
      const updatedTime = value.tz("Asia/Bangkok");

      if (
        field === "start_time" &&
        updatedTime.isAfter(dayjs(formData.end_time))
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          start_time: "Start time cannot be greater than end time",
        }));
        return;
      }

      if (
        field === "end_time" &&
        updatedTime.isBefore(dayjs(formData.start_time))
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          end_time: "End time cannot be smaller than start time",
        }));
        return;
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));

      setFormData((prev) => ({
        ...prev,
        [field]: updatedTime.toDate(),
      }));
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const newDate = date.tz("Asia/Bangkok");
      setFormData((prevFormData) => ({
        ...prevFormData,
        date: newDate.toDate(),
        start_time: newDate
          .hour(dayjs(prevFormData.start_time).hour())
          .minute(dayjs(prevFormData.start_time).minute())
          .second(0)
          .toDate(),
        end_time: newDate
          .hour(dayjs(prevFormData.end_time).hour())
          .minute(dayjs(prevFormData.end_time).minute())
          .second(0)
          .toDate(),
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title) newErrors.title = "กรุณาระบุหัวข้อการจอง";
    if (!formData.tel || !/^\d{9,10}$/.test(formData.tel))
      newErrors.tel = "กรุณาระบุเบอร์โทรที่ถูกต้อง (9-10 หลัก)";
    if (!formData.reason) newErrors.reason = "กรุณาระบุเหตุผลการจองห้อง";
    if (dayjs(formData.end_time).isBefore(dayjs(formData.start_time)))
      newErrors.end_time = "เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น";

    setErrors(newErrors);
    return newErrors;
  };

  const isTimeAvailable = (
    newStartTime: Date,
    newEndTime: Date,
    newDate: Date
  ): boolean[] => {
    return books
      .filter((book) => {
        const sameDay = dayjs(book.date).isSame(newDate, "day");
        return sameDay;
      })
      .map((book) => {
        const bookStartTime = dayjs(book.start_time).utc();
        const bookEndTime = dayjs(book.end_time).utc();
        const newStart = dayjs(newStartTime).utc(true);
        const newEnd = dayjs(newEndTime).utc(true);

        const isOverlap =
          newStart.isBetween(bookStartTime, bookEndTime, null, "[)") ||
          newEnd.isBetween(bookStartTime, bookEndTime, null, "(]") ||
          (newStart.isBefore(bookStartTime) && newEnd.isAfter(bookEndTime));

        // console.log(
        //   `Booking ${book.id}:`,
        //   "Booking Start:",
        //   bookStartTime.format(),
        //   "Booking End:",
        //   bookEndTime.format(),
        //   "New Start:",
        //   newStart.format(),
        //   "New End:",
        //   newEnd.format(),
        //   "Overlap:",
        //   isOverlap
        // );

        return !isOverlap;
      });
  };

  const validateTimeAvailability = () => {
    if (formData.start_time && formData.end_time && formData.date) {
      const available = isTimeAvailable(
        formData.start_time,
        formData.end_time,
        formData.date
      );

      if (!available.every((val) => val)) {
        setTimeError("The selected time slot is not available.");
      } else {
        setTimeError("");
      }
    }
  };

  useEffect(() => {
    validateTimeAvailability();
  }, [formData.date, formData.start_time, formData.end_time, books]);

  const handleCreateBookSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0 || timeError) {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  // console.log("RoomDetailModal : ", formData);
  // console.log("TimeError : ", timeError);
  // console.log(
  //   isTimeAvailable(formData.start_time, formData.end_time, formData.date)
  // );
  // console.log("Formdata : ", formData.start_time, formData.end_time);

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
          <div className="flex flex-row m-10">
            <div className="flex w-3/5 justify-center items-center">
              <TimeCalendar bookings={books} />
            </div>
            <div className="flex w-2/5 justify-center items-baseline">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex flex-col gap-4 w-3/4 justify-end">
                  <DatePicker
                    className="w-full"
                    value={dayjs(formData.date).tz("Asia/Bangkok")}
                    onChange={handleDateChange}
                  />
                  <div className="flex flex-row gap-2">
                    <TimePicker
                      label="เวลาที่เริ่มใช้ห้อง"
                      timeSteps={{
                        minutes: booking_interval_minutes,
                      }}
                      value={dayjs(formData.start_time).tz("Asia/Bangkok")}
                      onChange={(time) => handleTimeChange("start_time", time)}
                      onError={() => errors.start_time}
                      ampm={false}
                    />
                    <TimePicker
                      label="เวลาที่สิ้นสุด"
                      timeSteps={{
                        minutes: booking_interval_minutes,
                      }}
                      value={dayjs(formData.end_time).tz("Asia/Bangkok")}
                      onChange={(time) => handleTimeChange("end_time", time)}
                      onError={() => errors.end_time}
                      ampm={false}
                    />
                    <FormHelperText
                      className="flex w-fit whitespace-nowrap items-center justify-center"
                      error={!!errors.end_time || !!errors.start_time}
                    >
                      ขั้นต่ำ {booking_interval_minutes} นาที
                    </FormHelperText>
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
                    rows={4}
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
        <Button onClick={onClose} color="error" variant="contained">
          ปิด
        </Button>
        <Button
          onClick={handleCreateBookSubmit}
          color="success"
          variant="contained"
          disabled={!!timeError} // Disable if there's a time error
        >
          ยืนยันการจอง
        </Button>
        {timeError && (
          <Typography color="error" variant="body2">
            {timeError}
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RoomDetailModal;
