import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    mobilecheck: () => boolean;
  }
}
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
import {
  getColorForRoom,
  getContrastColorForRoom,
  getPureContrastColorForRoom,
} from "../../calendar/scripts/RandomColor";
import { Room } from "../../../types/room";
import { getRoomOrder } from "../../calendar/scripts/GetRoomOrder";

dayjs.extend(utc);

window.mobilecheck = function () {
  var check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor);
  return check;
};

interface TimeCalendarProps {
  bookings: Booking[];
  rooms: Room[];
}

const TimeCalendar: React.FC<TimeCalendarProps> = ({ bookings, rooms }) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (calendarRef.current) {
      const eventsMain = bookings.map((book) => ({
        title: book.account_name + " - " + book.title,
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
        classNames: [
          getColorForRoom(getRoomOrder(book.room_id, rooms) ?? 0),
          getContrastColorForRoom(getRoomOrder(book.room_id, rooms) ?? 0),
        ],
      }));

      const eventsWithoutColor = bookings.map((book) => ({
        title: book.account_name + " - " + book.title,
        start: dayjs(book.start_time).utc().format(),
        end: dayjs(book.end_time).utc().format(),
        extendedProps: { booking: book },
        classNames: [
          getColorForRoom(getRoomOrder(book.room_id, rooms) ?? 0),
          "border-2",
        ],
        textColor: getPureContrastColorForRoom(
          getRoomOrder(book.room_id, rooms) ?? 0
        ), // Add this line to change text color
        borderColor:
          book.status === BookingStatusList[1]
            ? colors.green[500]
            : book.status === BookingStatusList[2]
            ? colors.red[500]
            : book.status === BookingStatusList[3]
            ? colors.grey[500]
            : colors.yellow[800], // Add this line to change border color
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
        events: eventsMain,
        eventClick: (info) => {
          setSelectedBooking(info.event.extendedProps.booking);
          setModalOpen(true);
        },
        datesSet: (dateInfo) => {
          const currentView = dateInfo.view.type;
          calendar.setOption(
            "events",
            currentView === "dayGridMonth" || currentView === "listWeek"
              ? eventsMain
              : eventsWithoutColor
          );
        },
        eventTimeFormat: {
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
        },
        windowResize: () => {
          calendar.updateSize();
        },
        initialView: window.mobilecheck() ? "timeGridDay" : "timeGridWeek",
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
      <div ref={calendarRef} id="time-calendar" />
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
