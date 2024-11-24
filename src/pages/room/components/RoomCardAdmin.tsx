import React, { useState } from "react";
import "./RoomCard.css";
import {
  BuildingOfficeIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import RoomDetailModal from "./RoomDetailModal";

interface RoomCardProps {
  name: string;
  type: string;
  location: string;
  capacity: number;
  description: string;
  requiresConfirmation: boolean;
  isActive: boolean;
  services: string[];
}

const RoomCardAdmin: React.FC<RoomCardProps> = ({
  name,
  type,
  location,
  capacity,
  description,
  requiresConfirmation,
  isActive,
  services,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  return (
    <div className={`room-card ${isActive ? "" : "inactive"}`}>
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
          >
            ดูรายละเอียด
          </button>
          {requiresConfirmation && (
            <div className="flex flex-row confirmation-required bg-[#E54A5F] text-xs gap-2 text-white p-1 px-2 rounded-xl">
              <LockClosedIcon className="size-4" />
              <span>ต้องขออนุมัติก่อนใช้งาน</span>
            </div>
          )}
        </div>
        <div className="absolute right-4 bottom-4">
          <Cog6ToothIcon className="w-6 h-6 text-gray-800 bg-gray-200 rounded-full p-0.5 cursor-pointer" />
        </div>
      </div>
      <RoomDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        name={name}
        type={type}
        location={location}
        capacity={capacity}
        description={description}
        services={services}
        requiresConfirmation={requiresConfirmation}
      />
    </div>
  );
};

export default RoomCardAdmin;
