import React from "react";
import {
  BuildingOfficeIcon,
  LockClosedIcon,
  MapPinIcon,
  UserIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Room } from "../../../types/room";
import useAccountContext from "../../../common/contexts/AccountContext";
import { Button } from "@mui/material";
import { ClientRouteKey } from "../../../common/constants/keys";

interface RoomCardProps extends Room {
  services: string[];
  images: string[];
  authorized?: boolean;
  requires_confirmation?: boolean;
}

const RoomCardEdit: React.FC<RoomCardProps> = ({
  id,
  name,
  type,
  location,
  capacity,
  requires_confirmation,
  images,
  authorized,
}) => {
  const { accountData } = useAccountContext();

  // const deleteRoom = async (id: number) => {
  //   const confirmed = window.confirm(
  //     "Are you sure you want to delete this room?"
  //   );
  //   if (!confirmed) return;

  //   try {
  //     await DeleteRoom(id);
  //     alert("Room deleted successfully");
  //     window.location.reload(); // Reload the page after successful deletion
  //   } catch (error) {
  //     console.error("Failed to delete room:", error);
  //     alert("Failed to delete room. Please try again.");
  //   }
  // };

  return (
    <div
      className={`w-full max-w-3xl h-auto md:h-64 shadow-lg bg-white rounded-3xl relative flex flex-col md:flex-row p-4 gap-4 ${
        authorized || accountData?.isAdmin ? "" : "opacity-50"
      }`}
    >
      <img
        className="w-full md:w-1/3 h-56 md:h-56 bg-gray-300 rounded-xl bg-cover bg-center"
        src={images[0]}
        alt="Room"
      />
      <div className="flex flex-col items-start gap-2 w-full md:w-2/3 px-4 relative">
        <h2 className="font-kanit font-medium text-xl leading-7 text-black">
          {name}
        </h2>
        <div className="flex flex-row p-1 px-4 bg-gray-100 rounded-3xl gap-2">
          <BuildingOfficeIcon className="w-6 h-6 text-maincolor bg-orange-100 rounded-full p-0.5" />
          ประเภท <div className="text-maincolor">{type}</div>
        </div>
        <div className="flex flex-row p-1 px-4 bg-gray-100 rounded-3xl gap-2">
          <MapPinIcon className="w-6 h-6 text-maincolor bg-orange-100 rounded-full p-0.5" />
          สถานที่ <div className="text-maincolor">{location}</div>
        </div>
        <div className="flex flex-row p-1 px-4 bg-gray-100 rounded-3xl gap-2">
          <UserIcon className="w-6 h-6 text-maincolor bg-orange-100 rounded-full p-0.5" />
          ความจุ <div className="text-maincolor">{capacity} ที่นั่ง</div>
        </div>
        <div className="flex flex-row items-center gap-4">
          {requires_confirmation && (
            <div className="flex flex-row bg-red-500 text-xs gap-2 text-white p-1 px-2 rounded-xl">
              <LockClosedIcon className="w-4 h-4" />
              <div>ต้องขออนุมัติก่อนใช้งาน</div>
            </div>
          )}
        </div>
        <div className="flex flex-row gap-4">
          <Button
            className="absolute"
            component="a"
            color="primary"
            variant="outlined"
            href={`${ClientRouteKey.RoomUpdate}/${id}`}
          >
            <PencilIcon className="w-5 h-5" />
            <p className="px-2">แก้ไขข้อมูลห้อง</p>
          </Button>
          {/* <Button
            className="absolute"
            component="button"
            color="error"
            variant="outlined"
            onClick={() => deleteRoom(id)}
          >
            <TrashIcon className="w-5 h-5" />
            <p className="px-2">ลบห้อง</p>
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default RoomCardEdit;
