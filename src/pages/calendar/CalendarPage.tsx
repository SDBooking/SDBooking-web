import React, { useEffect, useState, useRef } from "react";
import PageContainer from "../../common/components/container/PageContainer";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Calendar } from "@fullcalendar/core";
import { Booking } from "../../types/booking";
import { GetAllBooks } from "../../common/apis/booking/queries";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  SelectChangeEvent,
} from "@mui/material";
import useAccountContext from "../../common/contexts/AccountContext";
import { Room } from "../../types/room";
import { GetAllRooms } from "../../common/apis/room/queries";

dayjs.extend(utc);

const CalendarPage: React.FC = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [books, setBooks] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isMyBooking, setIsMyBooking] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<string | "">("");
  const { accountData } = useAccountContext();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const bookResponse = await GetAllBooks();
        if (Array.isArray(bookResponse.result)) {
          setBooks(bookResponse.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRooms = async () => {
      try {
        const roomResponse = await GetAllRooms();
        if (Array.isArray(roomResponse.result)) {
          setRooms(roomResponse.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRooms();
    fetchBooks();
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      const filteredBooks = books.filter((book) => {
        if (
          isMyBooking &&
          book.account_id !== accountData?.userData.cmuitaccount
        ) {
          return false;
        }
        if (selectedRoom && book.room_id.toString() !== selectedRoom) {
          return false;
        }
        return true;
      });

      const events = filteredBooks.map((book) => ({
        title: book.room_name + " - " + book.title,
        start: dayjs(book.start_time).utc().format(),
        end: dayjs(book.end_time).utc().format(),
        extendedProps: { booking: book },
      }));

      const calendar = new Calendar(calendarRef.current, {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        themeSystem: "standard",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        timeZone: "Thailand/Bangkok",
        locale: "th",
        navLinks: true, // can click day/week names to navigate views
        editable: false,
        dayMaxEvents: true, // allow "more" link when too many events
        events,
        eventClick: (info) => {
          setSelectedBooking(info.event.extendedProps.booking);
          setModalOpen(true);
        },
      });
      calendar.render();
    }
  }, [books, isMyBooking, selectedRoom]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value as string);
  };

  const handleMyBookingChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsMyBooking(event.target.checked);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <div className="w-[1000px] overflow-y-auto">
        <div className="flex flex-row gap-2">
          <img src="/imgs/calendar.svg" />
          <h1 className="text-maincolor text-xl">ปฎิทินการจองห้อง</h1>
        </div>

        <p className="text-sm font-light my-4">หมายเหตุ/รายละเอียด</p>
        <div className="flex flex-row items-center gap-4 my-2">
          <p className="text-base font-normal my-4">เลือกแสดง</p>
          <FormControl variant="outlined" className="w-1/3">
            <InputLabel id="room-select-label">ห้องประชุม</InputLabel>
            <Select
              labelId="room-select-label"
              value={selectedRoom}
              onChange={handleRoomChange}
              label="ห้องประชุม"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id.toString()}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={isMyBooking}
                onChange={handleMyBookingChange}
                color="primary"
              />
            }
            label="การจองของฉัน"
          />
        </div>
        <div ref={calendarRef} id="calendar" />
      </div>

      {selectedBooking && isModalOpen && (
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Booking Details</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">
              <strong>Book ID:</strong> {selectedBooking.id}
            </Typography>
            <Typography variant="body1">
              <strong>Room Name:</strong> {selectedBooking.room_name}
            </Typography>
            <Typography variant="body1">
              <strong>Title:</strong> {selectedBooking.title}
            </Typography>
            <Typography variant="body1">
              <strong>Reason:</strong> {selectedBooking.reason}
            </Typography>
            <Typography variant="body1">
              <strong>Contact:</strong> {selectedBooking.tel}
            </Typography>
            <Typography variant="body1">
              <strong>Date:</strong>{" "}
              {dayjs(selectedBooking.date).utc().format("YYYY-MM-DD")}
            </Typography>
            <Typography variant="body1">
              <strong>Start Time:</strong>{" "}
              {dayjs(selectedBooking.start_time).utc().format("HH:mm:ss")}
            </Typography>
            <Typography variant="body1">
              <strong>End Time:</strong>{" "}
              {dayjs(selectedBooking.end_time).utc().format("HH:mm:ss")}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {selectedBooking.status}
            </Typography>
            {selectedBooking.reject_historys &&
              selectedBooking.reject_historys.length > 0 && (
                <Typography variant="body1">
                  <strong>Reject Reasons:</strong>
                  <ul>
                    {selectedBooking.reject_historys.map((reject, index) => (
                      <li key={index}>
                        {reject.reason || "No reason provided"}
                      </li>
                    ))}
                  </ul>
                </Typography>
              )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </PageContainer>
  );
};

export default CalendarPage;
