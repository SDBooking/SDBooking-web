import React, { useState } from "react";
import "./RoomCard.css";
import {
  BuildingOfficeIcon,
  LockClosedIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import RoomDetailModal from "./RoomDetailModal";
import { Room } from "../../../types/room";

interface RoomCardProps extends Room {
  services: string[];
}

const RoomCard: React.FC<RoomCardProps> = ({
  id,
  name,
  type,
  location,
  capacity,
  description,
  requires_confirmation,
  activation,
  services,
  open_time,
  close_time,
  bookingIntervalMinutes,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  return (
    <div className={`room-card ${activation ? "" : "inactive"}`}>
      <img className="room-image" src="/imgs/Mockroom.png" alt="Room" />
      <div className="room-details px-4">
        <h2>{name}</h2>
        <div className="flex flex-row p-1 px-4 bg-[#FAFAFA] rounded-[24px] gap-2">
          <BuildingOfficeIcon className="w-6 h-6 text-maincolor bg-[#FFE7D0] rounded-full p-0.5" />
          ประเภท <div className="text-maincolor">{type}</div>
        </div>
        <div className="flex flex-row p-1 px-4 bg-[#FAFAFA] rounded-[24px] gap-2">
          <MapPinIcon className="w-6 h-6 text-maincolor bg-[#FFE7D0] rounded-full p-0.5" />
          สถานที่ <div className="text-maincolor">{location}</div>
        </div>
        <div className="flex flex-row p-1 px-4 bg-[#FAFAFA] rounded-[24px] gap-2">
          <UserIcon className="w-6 h-6 text-maincolor bg-[#FFE7D0] rounded-full p-0.5" />
          ความจุ <div className="text-maincolor">{capacity} ที่นั่ง</div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <button
            className="my-2 bg-white border-[#FFEFE0] border-2 text-maincolor hover:bg-gradient-to-r from-transparent to-[#ffc121] hover:border-[#FD7427]"
            onClick={handleModalOpen}
            disabled={!activation}
          >
            ดูรายละเอียด
          </button>
          {requires_confirmation && (
            <div className="flex flex-row confirmation-required bg-[#E54A5F] text-xs gap-2 text-white p-1 px-2 rounded-xl">
              <LockClosedIcon className="size-4" />
              <span>ต้องขออนุมัติก่อนใช้งาน</span>
            </div>
          )}
        </div>
      </div>
      <RoomDetailModal
        id={id}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        name={name}
        type={type || "ไม่ระบุ"}
        location={location || "ไม่ระบุ"}
        capacity={capacity}
        description={description || "ไม่ระบุ"}
        services={services}
        requires_confirmation={requires_confirmation}
        activation={activation}
        open_time={open_time || "00:00"}
        close_time={close_time || "23:59"}
        bookingIntervalMinutes={bookingIntervalMinutes || 60}
      />
    </div>
  );
};

export default RoomCard;
