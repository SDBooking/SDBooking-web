import React, { useEffect, useRef } from "react";
import { Calendar } from "@fullcalendar/core";
import listPlugin from "@fullcalendar/list";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Booking, BookingStatusList } from "../../../types/booking";
import { colors } from "@mui/material";

dayjs.extend(utc);

interface ListViewCalendarProps {
  bookings: Booking[];
  onEventClick: (info: any) => void;
}

const ListViewCalendar: React.FC<ListViewCalendarProps> = ({
  bookings,
  onEventClick,
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);

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
            : book.status === BookingStatusList[2]
            ? colors.red[500]
            : book.status === BookingStatusList[3]
            ? colors.grey[500]
            : colors.yellow[800],
      }));

      const calendar = new Calendar(calendarRef.current, {
        plugins: [listPlugin],
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "listWeek",
        },
        initialView: "listWeek",
        timeZone: "Thailand/Bangkok",
        locale: "th",
        navLinks: true,
        editable: false,
        dayMaxEvents: 5,
        events,
        eventClick: onEventClick,
      });
      calendar.render();
    }
  }, [bookings, onEventClick]);

  return <div ref={calendarRef} id="list-view-calendar" className="text-sm" />;
};

export default ListViewCalendar;
