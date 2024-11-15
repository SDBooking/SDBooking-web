import React from "react";
import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import PageContainer from "../../common/components/container/PageContainer";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Calendar } from "@fullcalendar/core";

const CalendarPage: React.FC = () => {
  const calendarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (calendarRef.current) {
      const calendar = new Calendar(calendarRef.current, {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        themeSystem: "standard",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        locale: "th",
        initialDate: "2018-01-12",
        navLinks: true, // can click day/week names to navigate views
        editable: false,
        dayMaxEvents: true, // allow "more" link when too many events
        events: [
          {
            title: "All Day Event",
            start: "2018-01-01",
          },
          {
            title: "Long Event",
            start: "2018-01-07",
            end: "2018-01-10",
          },
          {
            groupId: "999",
            title: "Repeating Event",
            start: "2018-01-09T16:00:00",
          },
          {
            groupId: "999",
            title: "Repeating Event",
            start: "2018-01-16T16:00:00",
          },
          {
            title: "Conference",
            start: "2018-01-11",
            end: "2018-01-13",
          },
          {
            title: "Meeting",
            start: "2018-01-12T10:30:00",
            end: "2018-01-12T12:30:00",
          },
          {
            title: "Lunch",
            start: "2018-01-12T12:00:00",
          },
          {
            title: "Meeting",
            start: "2018-01-12T14:30:00",
          },
          {
            title: "Happy Hour",
            start: "2018-01-12T17:30:00",
          },
          {
            title: "Dinner",
            start: "2018-01-12T20:00:00",
          },
          {
            title: "Birthday Party",
            start: "2018-01-13T07:00:00",
          },
          {
            title: "Click for Google",
            url: "http://google.com/",
            start: "2018-01-28",
          },
        ],
      });
      calendar.render();
    }
  }, []);

  return (
    <>
      <PageContainer>
        <div className="w-[1000px] overflow-y-auto">
          <div className="flex flex-row gap-2">
            <img src="/imgs/calendar.svg" />
            <h1 className="text-maincolor text-xl">ปฎิทินการจองห้อง</h1>
          </div>

          <p className="text-sm font-light my-4">หมายเหตุ/รายละเอียด</p>
          <div className="flex flex-row items-center gap-4 my-2">
            <p className="text-base font-normal my-4">เลือกแสดง</p>
            <div
              className="flex flex-row text-start justify-center items-center px-4 p-1 w-max border-2 rounded-[24px] bg-white gap-4"
              style={{ borderColor: "#FFEFE0" }}
            >
              <p>ห้องประชุมสโมสรนักศึกษา</p>
              <ChevronDownIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-row text-start justify-center items-center px-4 p-1 w-max rounded-[24px] bg-white gap-4 ml-auto">
              <CheckCircleIcon className="w-4 h-4 text-maincolor" />
              <p className="text-maincolor-g">การจองของฉัน</p>
            </div>
          </div>
          <div ref={calendarRef} id="calendar" />
        </div>
      </PageContainer>
    </>
  );
};

export default CalendarPage;
