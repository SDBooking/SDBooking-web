import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Room } from "../../../types/room";

interface RoomDetailModalProps extends Room {
  isOpen: boolean;
  onClose: () => void;
  services: string[];
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  isOpen,
  onClose,
  name,
  type,
  location,
  capacity,
  description,
  services,
  requires_confirmation,
  open_time,
  close_time,
  bookingIntervalMinutes,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {name}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">ประเภท: {type}</p>
                  <p className="text-sm text-gray-500">สถานที่: {location}</p>
                  <p className="text-sm text-gray-500">
                    ช่วงเวลาที่ห้องเปิดให้สามารถจองได้: {open_time} -{" "}
                    {close_time}
                  </p>
                  <p className="text-sm text-gray-500">
                    เวลาการจองชั้นต่ำ (นาที): {bookingIntervalMinutes}
                  </p>
                  <p className="text-sm text-gray-500">
                    ความจุ: {capacity} ที่นั่ง
                  </p>
                  <p className="text-sm text-gray-500">
                    รายละเอียด: {description}
                  </p>
                  {services && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold">
                        สิ่งอำนวยความสะดวก:
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-500">
                        {services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {requires_confirmation && (
                    <p className="mt-2 text-xs text-red-500">
                      * ต้องขออนุมัติก่อนใช้งาน
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-maincolor px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80"
                    onClick={onClose}
                  >
                    ปิด
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RoomDetailModal;
