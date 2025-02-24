import React, { useEffect, useState } from "react";
import {
  BuildingOfficeIcon,
  LockClosedIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import RoomDetailModal from "./RoomDetailModal";
import { Room } from "../../../types/room";
import useAccountContext from "../../../common/contexts/AccountContext";
import "./RoomCard.css";

interface RoomCardProps extends Room {
  services: string[];
  images: string[];
  authorized?: boolean;
  requires_confirmation?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({
  id,
  name,
  type,
  location,
  capacity,
  description,
  activation,
  services,
  open_time,
  close_time,
  booking_interval_minutes,
  requires_confirmation,
  images,
  authorized,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { accountData } = useAccountContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isChangingImage, setIsChangingImage] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const cycleImages = () => {
      if (!isMounted || images.length <= 1) return;

      setIsChangingImage(true);

      timeout = setTimeout(() => {
        if (!isMounted) return;

        setNextImageIndex((prev) => (prev + 1) % images.length);
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsChangingImage(false);
      }, 2000);
    };

    if (images.length > 1) {
      interval = setInterval(cycleImages, 4000);
    }

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [images]);

  useEffect(() => {
    // Preload images
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, [images]);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  return (
    <div
      className={`w-full max-w-3xl h-auto md:h-64 shadow-lg bg-white rounded-3xl relative flex flex-col md:flex-row p-4 gap-4 ${
        authorized || accountData?.isAdmin ? "" : "opacity-50"
      }`}
    >
      <div className="w-full md:w-1/3 h-56 md:h-56 bg-gray-300 rounded-xl overflow-hidden relative">
        <img
          className={`absolute w-full h-full bg-cover bg-center transition-transform duration-500 ease-in-out transform ${
            isChangingImage ? "slide-out" : ""
          }`}
          src={images[currentImageIndex]}
          style={{ objectFit: "cover" }}
          alt="Room"
        />
        <img
          className={`absolute w-full h-full bg-cover bg-center transition-transform duration-500 ease-in-out transform ${
            isChangingImage ? "slide-in" : "hidden"
          }`}
          src={images[nextImageIndex]}
          style={{ objectFit: "cover" }}
          alt="Room"
        />
      </div>
      <div className="flex flex-col items-start gap-2 w-full md:w-2/3 px-4">
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
          <button
            className="my-2 bg-white border-orange-100 border-2 text-maincolor hover:bg-gradient-to-r from-transparent to-yellow-400 hover:border-orange-500"
            onClick={handleModalOpen}
          >
            ดูรายละเอียด
          </button>
          {requires_confirmation && (
            <div className="flex flex-row bg-red-500 text-xs gap-2 text-white p-1 px-2 rounded-xl">
              <LockClosedIcon className="w-4 h-4" />
              <div>ต้องขออนุมัติก่อนใช้งาน</div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
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
          activation={activation}
          open_time={open_time || "00:00"}
          close_time={close_time || "23:59"}
          booking_interval_minutes={booking_interval_minutes}
          requires_confirmation={requires_confirmation}
          images={images}
          isActive={authorized || accountData?.isAdmin}
        />
      )}
    </div>
  );
};

export default RoomCard;
