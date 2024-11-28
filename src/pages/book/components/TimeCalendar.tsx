import React, { useEffect, useRef, useState } from "react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Calendar } from "@fullcalendar/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Booking, BookingStatusList } from "../../../types/booking";
import { colors } from "@mui/material";
import "./TimeCalendar.css";
import BookingDetailsViewDialog from "../../calendar/components/BookingDetailViewDialog";

dayjs.extend(utc);

interface TimeCalendarProps {
  bookings: Booking[];
}

const TimeCalendar: React.FC<TimeCalendarProps> = ({ bookings }) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (calendarRef.current) {
      const events = bookings.map((book) => ({
        title: book.room_name + " - " + book.title,
        start: dayjs(book.start_time).utc().format(),
        end: dayjs(book.end_time).utc().format(),
        extendedProps: { booking: book },
        color:
          book.status === BookingStatusList[1]
            ? colors.green[500]
            : colors.red[500],
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
        dayMaxEvents: true, // allow "more" link when too many events
        events,
        eventClick: (info) => {
          setSelectedBooking(info.event.extendedProps.booking);
          setModalOpen(true);
        },
      });
      calendar.render();
    }
  }, [bookings]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <>
      <div ref={calendarRef} id="time-calendar" className="text-sm" />
      {selectedBooking && (
        <BookingDetailsViewDialog
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedBooking={selectedBooking}
        />
      )}
    </>
  );
};

export default TimeCalendar;
