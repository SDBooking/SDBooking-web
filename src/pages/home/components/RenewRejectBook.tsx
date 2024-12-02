import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  BookingUpdateModel,
  Booking,
  BookingUpdateDTOModel,
  BookingStatusList,
} from "../../../types/booking";
import { GetBookByRoomId } from "../../../common/apis/booking/queries";
import TimeCalendar from "../../book/components/TimeCalendar";
import toast from "react-hot-toast";
import { UpdateBook } from "../../../common/apis/booking/manipulates";

interface ResubmitBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  BookingFormData: BookingUpdateModel;
  booking_interval_minutes: number;
  open_time: string;
  close_time: string;
}

const ResubmitBookingModal: React.FC<ResubmitBookingModalProps> = ({
  isOpen,
  onClose,
  BookingFormData,
  booking_interval_minutes,
  open_time,
  close_time,
}) => {
  const [books, setBooks] = useState<Booking[]>([]);
  const [timeError, setTimeError] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<BookingUpdateModel>(BookingFormData);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const bookResponse = await GetBookByRoomId(formData.room_id);
        if (Array.isArray(bookResponse.result)) {
          const filteredBooks = bookResponse.result.filter(
            (book) => book.status !== BookingStatusList[3]
          );
          setBooks(filteredBooks);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBooks();
  }, [formData.room_id]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title) newErrors.title = "กรุณาระบุหัวข้อการจอง";
    if (!formData.tel || !/^\d{9,10}$/.test(formData.tel))
      newErrors.tel = "กรุณาระบุเบอร์โทรที่ถูกต้อง (9-10 หลัก)";
    if (!formData.reason) newErrors.reason = "กรุณาระบุเหตุผลการจองห้อง";
    if (dayjs(formData.end_time).isBefore(dayjs(formData.start_time)))
      newErrors.end_time = "เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น";

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
        const bookStatus = book.status !== BookingStatusList[2];
        return sameDay && bookStatus;
      })
      .map((book) => {
        const bookStartTime = dayjs(book.start_time).utc();
        const bookEndTime = dayjs(book.end_time).utc();
        const newStart = dayjs(newStartTime).utc();
        const newEnd = dayjs(newEndTime).utc();

        const isOverlap =
          newStart.isBetween(bookStartTime, bookEndTime, null, "[)") ||
          newEnd.isBetween(bookStartTime, bookEndTime, null, "(]") ||
          (newStart.isBefore(bookStartTime) && newEnd.isAfter(bookEndTime));

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
      const updatedTime = value.utc();

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
      const newDate = date.utc();
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

  const handleResubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0 || timeError) {
      setErrors(validationErrors);
      return;
    }

    // Format the dates correctly before sending them in the POST request
    const formattedFormData: BookingUpdateDTOModel = {
      ...formData,
      confirmed_by: null,
      status: "PENDING",
      start_time: dayjs(formData.start_time).second(1).utc().format(),
      end_time: dayjs(formData.end_time).utc().format(),
      date: dayjs(formData.date).utc().format(),
    };

    console.log("formattedFormData", formattedFormData);

    try {
      const response = await UpdateBook(formattedFormData);
      console.log("CreateBookPending", response);
      toast.success("Booking Resubmitted Successfully");
    } catch (error) {
      toast.error("Error Resubmit booking");
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Resubmit Booking</DialogTitle>
      <DialogContent>
        <div className="flex flex-row m-10">
          <div className="flex w-3/5 justify-center items-center">
            <TimeCalendar bookings={books} />
          </div>
          <div className="flex w-2/5 justify-center items-baseline">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col gap-4 w-3/4 justify-end">
                <DatePicker
                  className="w-full"
                  value={dayjs(formData.date).utc()}
                  onChange={handleDateChange}
                />
                <div className="flex flex-row gap-2">
                  <TimePicker
                    label="เวลาที่เริ่มใช้ห้อง"
                    timeSteps={{
                      minutes: booking_interval_minutes,
                    }}
                    value={dayjs(formData.start_time).utc()}
                    onChange={(time) => handleTimeChange("start_time", time)}
                    onError={() => errors.start_time}
                    ampm={false}
                    minTime={dayjs(
                      `${dayjs().format("YYYY-MM-DD")}T${open_time}`
                    ).tz("Asia/Bangkok")}
                    maxTime={dayjs(
                      `${dayjs().format("YYYY-MM-DD")}T${close_time}`
                    ).tz("Asia/Bangkok")}
                  />
                  <TimePicker
                    label="เวลาที่สิ้นสุด"
                    timeSteps={{
                      minutes: booking_interval_minutes,
                    }}
                    value={dayjs(formData.end_time).utc()}
                    onChange={(time) => handleTimeChange("end_time", time)}
                    onError={() => errors.end_time}
                    ampm={false}
                    minTime={dayjs(
                      `${dayjs().format("YYYY-MM-DD")}T${open_time}`
                    ).tz("Asia/Bangkok")}
                    maxTime={dayjs(
                      `${dayjs().format("YYYY-MM-DD")}T${close_time}`
                    ).tz("Asia/Bangkok")}
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
      </DialogContent>
      <DialogActions>
        {timeError && (
          <Typography color="error" variant="body2">
            {timeError}
          </Typography>
        )}
        <Button onClick={onClose} color="error" variant="contained">
          ปิด
        </Button>
        <Button
          onClick={handleResubmit}
          color="success"
          variant="contained"
          disabled={!!timeError}
        >
          Resubmit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResubmitBookingModal;
