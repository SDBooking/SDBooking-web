import React from "react";
import "./RoomCard.css";
import { BuildingOfficeIcon } from "@heroicons/react/24/solid";

interface RoomCardProps {
  name: string;
  type: string;
  location: string;
  capacity: number;
  description: string;
  requiresConfirmation: boolean;
  isActive: boolean;
  amenities: string[];
  onBook: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  name,
  type,
  location,
  capacity,
  description,
  requiresConfirmation,
  isActive,
  amenities,
  onBook,
}) => {
  return (
    <div className={`room-card ${isActive ? "" : "inactive"}`}>
      <img className="room-image" src="/imgs/Mockroom.png"></img>
      <div className="room-details px-4">
        <h2>{name}</h2>
        <p className="flex flex-row p-1 px-4 bg-[#FAFAFA] rounded-[24px] gap-2">
          <BuildingOfficeIcon className="w-6 h-6 text-maincolor bg-[#FFE7D0] rounded-full p-0.5" />
          ประเภท <p className="text-maincolor">{type}</p>
        </p>
        <p className="flex flex-row p-1 px-4 bg-[#FAFAFA] rounded-[24px] gap-2">
          <BuildingOfficeIcon className="w-6 h-6 text-maincolor bg-[#FFE7D0] rounded-full p-0.5" />
          สถานที่ <p className="text-maincolor">{location}</p>
        </p>
        <p className="flex flex-row p-1 px-4 bg-[#FAFAFA] rounded-[24px] gap-2">
          <BuildingOfficeIcon className="w-6 h-6 text-maincolor bg-[#FFE7D0] rounded-full p-0.5" />
          ความจุ <p className="text-maincolor">{capacity} ที่นั่ง</p>
        </p>
        <div className="flex flex-row items-center gap-4">
          <button
            className="my-2 bg-white border-[#FFEFE0] border-2 text-maincolor hover:bg-gradient-to-r from-transparent to-[#ffc121] hover:border-[#FD7427]"
            onClick={onBook}
            disabled={!isActive}
          >
            ดูรายละเอียด
          </button>
          {requiresConfirmation && (
            <div className="confirmation-required text-red-500 text-xs">
              * ต้องขออนุมัติก่อนใช้งาน
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
