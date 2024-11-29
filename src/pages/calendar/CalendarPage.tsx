import React, { useEffect, useState, useRef } from "react";
import PageContainer from "../../common/components/container/PageContainer";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Calendar } from "@fullcalendar/core";
import {
  Booking,
  BookingRejectTransactionCreateModel,
  BookingStatusList,
} from "../../types/booking";
import { GetAllBooks } from "../../common/apis/booking/queries";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  SelectChangeEvent,
  colors,
} from "@mui/material";
import useAccountContext from "../../common/contexts/AccountContext";
import { Room } from "../../types/room";
import { GetAllRooms } from "../../common/apis/room/queries";
import BookingDetailsDialog from "./components/BookingDetailDialog";
import { ApproveBook, RejectBook } from "../../common/apis/booking/manipulates";

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
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const { accountData } = useAccountContext();

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnApproved = async () => {
    if (selectedBooking) {
      try {
        if (accountData?.userData.cmuitaccount) {
          await ApproveBook(
            selectedBooking.id,
            accountData.userData.cmuitaccount
          );
        } else {
          console.error("User account is undefined");
        }
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === selectedBooking.id
              ? { ...book, status: "APPROVED" }
              : book
          )
        );
        fetchData();
        setModalOpen(false);
      } catch (error) {
        console.error("Error approving booking:", error);
      }
    }
  };

  const handleOnRejected = async (reason: string) => {
    if (selectedBooking) {
      try {
        const rejectTransaction: BookingRejectTransactionCreateModel = {
          booking_id: selectedBooking.id,
          reason,
        };
        await RejectBook(rejectTransaction);
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === selectedBooking.id
              ? { ...book, status: "REJECTED" }
              : book
          )
        );
        fetchData();
        setModalOpen(false);
      } catch (error) {
        console.error("Error rejecting booking:", error);
      }
    }
  };

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
        if (
          selectedStatuses.length > 0 &&
          !selectedStatuses.includes(book.status)
        ) {
          return false;
        }
        return true;
      });

      const events = filteredBooks.map((book) => ({
        title: book.room_name + " - " + book.title,
        start: dayjs(book.start_time).utc().format(),
        end: dayjs(book.end_time).utc().format(),
        extendedProps: { booking: book },
        color:
          book.status === BookingStatusList[1]
            ? colors.green[500]
            : book.status === BookingStatusList[2]
            ? colors.red[500]
            : book.status === BookingStatusList[3]
            ? colors.grey[500]
            : colors.yellow[800],
      }));

      const calendar = new Calendar(calendarRef.current, {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        timeZone: "Thailand/Bangkok",
        locale: "th",
        navLinks: true, // can click day/week names to navigate views
        editable: false,
        dayMaxEvents: 5, // allow "more" link when too many events
        events,
        eventClick: (info) => {
          setSelectedBooking(info.event.extendedProps.booking);
          setModalOpen(true);
        },
      });
      calendar.render();
    }
  }, [books, isMyBooking, selectedRoom, selectedStatuses]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value as string);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedStatuses((prev) =>
      prev.includes(value)
        ? prev.filter((status) => status !== value)
        : [...prev, value]
    );
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
      <div className="flex flex-col p-4 overflow-y-auto">
        <div className="flex flex-row gap-2">
          <img src="/imgs/calendar.svg" />
          <h1 className="text-maincolor text-xl">ปฎิทินการจองห้อง</h1>
        </div>

        <p className="text-base my-4">
          ปฎิทินการจองห้องที่แสดงข้อมูลการจองของระบบทั้งหมด
        </p>
        <div className="flex flex-row items-center gap-4  bg-white p-6 rounded-2xl">
          <p className="text-base font-normal my-4 w-fit inline whitespace-nowrap px-2">
            เลือกแสดง
          </p>
          <FormControl variant="outlined" className="w-1/3">
            <InputLabel id="room-select-label">ห้องประชุม</InputLabel>
            <Select
              labelId="room-select-label"
              value={selectedRoom}
              onChange={handleRoomChange}
              label="ห้องประชุม"
            >
              <MenuItem value="">
                <em>ทุกห้อง</em>
              </MenuItem>
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id.toString()}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            component="fieldset"
            variant="outlined"
            className="w-1/2 items-center justify-center"
          >
            <FormLabel component="legend" className="text-center">
              สถานะการจอง
            </FormLabel>
            <FormGroup row>
              {BookingStatusList.map((status, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={selectedStatuses.includes(status)}
                      onChange={handleStatusChange}
                      value={status}
                      color="primary"
                    />
                  }
                  label={status}
                />
              ))}
            </FormGroup>
          </FormControl>
          <FormControlLabel
            className="right-0 text-base font-normal my-4 w-fit inline whitespace-nowrap px-2 items-center justify-center"
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
        <div
          ref={calendarRef}
          id="calendar"
          className="bg-white p-10 rounded-b-2xl"
        />
      </div>

      {selectedBooking && isModalOpen && (
        <BookingDetailsDialog
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedBooking={selectedBooking}
          onApprove={handleOnApproved}
          onReject={handleOnRejected}
        />
      )}
    </PageContainer>
  );
};

export default CalendarPage;
