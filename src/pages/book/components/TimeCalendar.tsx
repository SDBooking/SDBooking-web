import React, { useEffect, useRef, useState } from "react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Calendar } from "@fullcalendar/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Booking } from "../../../types/booking";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import "./TimeCalendar.css";

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
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Booking Details</DialogTitle>
          <DialogContent dividers>
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
    </>
  );
};

export default TimeCalendar;
