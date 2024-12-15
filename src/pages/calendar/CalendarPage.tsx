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
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import useAccountContext from "../../common/contexts/AccountContext";
import { Room } from "../../types/room";
import { GetAllRooms } from "../../common/apis/room/queries";
import BookingDetailsDialog from "./components/BookingDetailDialog";
import ListViewCalendar from "./components/ListViewCalendar";
import {
  ApproveBook,
  DeleteBook,
  DiscardBook,
  RejectBook,
} from "../../common/apis/booking/manipulates";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { getStatusInThai } from "../home/scripts/StatusMapping";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

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

        fetchData();
        setModalOpen(false);
      } catch (error) {
        console.error("Error approving booking:", error);
      }
    }
  };

  const handleOnDiscarded = async () => {
    if (selectedBooking) {
      try {
        await DiscardBook(selectedBooking.id);

        fetchData();
        setModalOpen(false);
      } catch (error) {
        console.error("Error Discarding booking:", error);
      }
    }
  };

  const handleOnDeleted = async () => {
    if (selectedBooking) {
      try {
        await DeleteBook(selectedBooking.id);

        fetchData();
        setModalOpen(false);
      } catch (error) {
        console.error("Error deleting booking:", error);
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

  const handleEventClick = (info: any) => {
    setSelectedBooking(info.event.extendedProps.booking);
    setModalOpen(true);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
        title: book.room_name + " - " + book.account_name + " - " + book.title,
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
        eventClick: handleEventClick,
        eventTimeFormat: {
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
        },
        eventMouseEnter: (info) => {
          tippy(info.el, {
            content: info.event.title,
            placement: "top",
            theme: "light",
          });
        },
        eventMouseLeave: (info) => {
          const tip = (info.el as HTMLElement & { _tippy?: any })._tippy;
          if (tip) {
            tip.destroy();
          }
        },
      });
      calendar.render();
    }
  }, [books, isMyBooking, selectedRoom, selectedStatuses]);

  useEffect(() => {
    if (calendarRef.current) {
      const resizeEvent = new Event("resize");
      window.dispatchEvent(resizeEvent);
    }
  }, [isCollapsed]);

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
      <div className="flex flex-col p-4 overflow-y-auto bg-white rounded-2xl">
        <div className="flex flex-row gap-2 mb-4">
          <img src="/imgs/calendar.svg" alt="Calendar" />
          <h1 className="text-maincolor text-xl">ปฎิทินการจองห้อง</h1>
        </div>

        <Typography variant="body1" color="textSecondary" mb={4}>
          ปฎิทินการจองห้องที่แสดงข้อมูลการจองของระบบทั้งหมด
        </Typography>
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-6 rounded-2xl">
          <p className="text-base font-normal my-4 w-fit inline whitespace-nowrap px-2">
            เลือกแสดง
          </p>
          <FormControl variant="outlined" className="w-full md:w-1/3">
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
            className="w-full md:w-1/2 items-center justify-center"
          >
            <FormLabel component="legend" className="text-center">
              สถานะการจอง
            </FormLabel>
            <FormGroup row>
              {BookingStatusList.filter((status) => status !== "REJECTED").map(
                (status, index) => (
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
                    label={getStatusInThai(status)}
                  />
                )
              )}
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
        {accountData?.isAdmin ? (
          <div className="flex flex-col md:flex-row h-screen bg-white rounded-2xl p-4 md:p-10">
            <div
              ref={calendarRef}
              style={{
                width: isCollapsed ? "100%" : "60%",
              }}
              className="rounded-b-2xl"
            />
            <IconButton
              onClick={toggleCollapse}
              color="info"
              className="absolute right-5 top-1/2 transform -translate-y-1/2 size-10 z-10"
              style={{
                borderRadius: "50%",
                backgroundColor: "#fff",
                boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              {isCollapsed ? "<" : ">"}
            </IconButton>
            <div
              className={`flex flex-col ${
                isCollapsed ? "hidden" : "w-full md:w-2/5"
              }`}
            >
              <Collapse in={!isCollapsed} className="flex-grow">
                <ListViewCalendar
                  bookings={books}
                  onEventClick={handleEventClick}
                />
              </Collapse>
            </div>
          </div>
        ) : (
          <div
            ref={calendarRef}
            className="rounded-b-2xl p-4 md:p-10 bg-white h-screen"
          />
        )}
      </div>

      {selectedBooking && isModalOpen && (
        <BookingDetailsDialog
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedBooking={selectedBooking}
          onApprove={handleOnApproved}
          onReject={handleOnRejected}
          onDiscard={handleOnDiscarded}
          onDeleted={handleOnDeleted}
        />
      )}
    </PageContainer>
  );
};

export default CalendarPage;
