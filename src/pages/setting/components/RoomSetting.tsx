import React, { useEffect, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import { Cog6ToothIcon, TrashIcon } from "@heroicons/react/24/solid";
import { GetAllRoomTypes } from "../../../common/apis/room_type/queries";
import {
  CreateRoomType,
  DeleteRoomType,
  UpdateRoomType,
} from "../../../common/apis/room_type/manipulates";
import { RoomTypeDTO } from "../../../types/room_type";
import { RoomLocationDTO } from "../../../types/room_location";
import { GetAllRoomLocations } from "../../../common/apis/room_location/queries";
import {
  CreateRoomLocation,
  DeleteRoomLocation,
  UpdateRoomLocation,
} from "../../../common/apis/room_location/manipulates";
import { RoomFacilityDTO } from "../../../types/room_facility";
import { GetAllRoomFacilities } from "../../../common/apis/room_facility/queries";
import {
  CreateRoomFacility,
  DeleteRoomFacility,
  UpdateRoomFacility,
} from "../../../common/apis/room_facility/manipulates";
import { usePopupContext } from "../../../common/contexts/PopupContext";
import RoomEditor from "./RoomEditor";
import { renameDTO } from "./RoomEditor";

const RoomFilter: React.FC = () => {
  const { setChildren, setVisible } = usePopupContext();

  const [roomTypes, setRoomTypes] = useState<RoomTypeDTO[]>([]);
  const [roomLocations, setRoomLocations] = useState<RoomLocationDTO[]>([]);
  const [roomFacilities, setRoomFacilities] = useState<RoomFacilityDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          roomTypesResponse,
          roomLocationsResponse,
          roomFacilitiesResponse,
        ] = await Promise.all([
          GetAllRoomTypes(),
          GetAllRoomLocations(),
          GetAllRoomFacilities(),
        ]);

        if (
          !roomTypesResponse.result ||
          !roomLocationsResponse.result ||
          !roomFacilitiesResponse.result
        ) {
          throw new Error("Failed to fetch data");
        }

        setRoomTypes(roomTypesResponse.result);
        setRoomLocations(roomLocationsResponse.result);
        setRoomFacilities(roomFacilitiesResponse.result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteRoomType = async <T,>(
    index: number,
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    try {
      const itemToDelete = list[index];
      // Assuming itemToDelete has an id property
      await DeleteRoomType((itemToDelete as any).id);
      const updatedList = [...list];
      updatedList.splice(index, 1);
      setList(updatedList);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleDeleteRoomLocation = async <T,>(
    index: number,
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    try {
      const itemToDelete = list[index];
      // Assuming itemToDelete has an id property
      await DeleteRoomLocation((itemToDelete as any).id);
      const updatedList = [...list];
      updatedList.splice(index, 1);
      setList(updatedList);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleDeleteRoomFacility = async <T,>(
    index: number,
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    try {
      const itemToDelete = list[index];
      // Assuming itemToDelete has an id property
      await DeleteRoomFacility((itemToDelete as any).id);
      const updatedList = [...list];
      updatedList.splice(index, 1);
      setList(updatedList);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleAddRoomType = async (
    newItem: string,
    list: RoomTypeDTO[],
    setList: React.Dispatch<React.SetStateAction<RoomTypeDTO[]>>
  ) => {
    if (newItem.trim()) {
      try {
        const response = await CreateRoomType({ name: newItem });
        if (!response.result) {
          throw new Error("Failed to add room type");
        }
        const newRoomType = response.result;
        setList([...list, newRoomType]);
      } catch (error) {
        console.error("Failed to add room type:", error);
      }
    }
  };

  const handleAddRoomLocation = async (
    newItem: string,
    list: RoomLocationDTO[],
    setList: React.Dispatch<React.SetStateAction<RoomLocationDTO[]>>
  ) => {
    if (newItem.trim()) {
      try {
        const response = await CreateRoomLocation({ name: newItem });
        if (!response.result) {
          throw new Error("Failed to add room type");
        }
        const newRoomType = response.result;
        setList([...list, newRoomType]);
      } catch (error) {
        console.error("Failed to add room type:", error);
      }
    }
  };

  const handleAddRoomFacility = async (
    newItem: string,
    list: RoomFacilityDTO[],
    setList: React.Dispatch<React.SetStateAction<RoomFacilityDTO[]>>
  ) => {
    if (newItem.trim()) {
      try {
        const response = await CreateRoomFacility({ name: newItem });
        if (!response.result) {
          throw new Error("Failed to add room facility");
        }
        const newRoomFacility = response.result;
        setList([...list, newRoomFacility]);
      } catch (error) {
        console.error("Failed to add room facility:", error);
      }
    }
  };

  const handleEditRoomType = (rowData: renameDTO) => {
    setVisible(true);
    setChildren(
      <RoomEditor
        target={rowData}
        handle={async (data: renameDTO) => {
          await UpdateRoomType(data); // Update the backend
          setRoomTypes((prev) =>
            prev.map((item) =>
              item.id === data.id ? { ...item, name: data.name } : item
            )
          ); // Update the state locally
          setVisible(false);
          setChildren(null);
        }}
        cancel={() => {
          setVisible(false);
          setChildren(null);
        }}
      />
    );
  };

  const handleEditRoomLocation = (rowData: renameDTO) => {
    setVisible(true);
    setChildren(
      <RoomEditor
        target={rowData}
        handle={async (data: renameDTO) => {
          await UpdateRoomLocation(data); // Update the backend
          setRoomLocations((prev) =>
            prev.map((item) =>
              item.id === data.id ? { ...item, name: data.name } : item
            )
          ); // Update the state locally
          setVisible(false);
          setChildren(null);
        }}
        cancel={() => {
          setVisible(false);
          setChildren(null);
        }}
      />
    );
  };

  const handleEditRoomFacility = (rowData: renameDTO) => {
    setVisible(true);
    setChildren(
      <RoomEditor
        target={rowData}
        handle={async (data: renameDTO) => {
          await UpdateRoomFacility(data); // Update the backend
          setRoomFacilities((prev) =>
            prev.map((item) =>
              item.id === data.id ? { ...item, name: data.name } : item
            )
          ); // Update the state locally
          setVisible(false);
          setChildren(null);
        }}
        cancel={() => {
          setVisible(false);
          setChildren(null);
        }}
      />
    );
  };

  return (
    <div className="p-4">
      {/* Room Types */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-maincolor">
          ประเภทห้อง
        </h3>
        {roomTypes &&
          roomTypes.map((type, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b py-2"
            >
              <div className="flex items-center">
                <span>{type.name}</span>
              </div>
              <div className="flex items-center">
                <IconButton
                  onClick={() =>
                    handleEditRoomType({
                      id: type.id,
                      name: type.name,
                    })
                  }
                >
                  <Cog6ToothIcon className="h-4 w-4" />
                </IconButton>
                <IconButton
                  onClick={() =>
                    handleDeleteRoomType(index, roomTypes, setRoomTypes)
                  }
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
          ))}
        <TextField
          placeholder="เพิ่มประเภทห้อง"
          size="small"
          className="w-full mt-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddRoomType(
                (e.target as HTMLInputElement).value,
                roomTypes,
                setRoomTypes
              );
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <div className="my-8" />
        <h3 className="text-lg font-semibold mb-2 text-maincolor">สถานที่</h3>
        {roomLocations &&
          roomLocations.map((type, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b py-2"
            >
              <div className="flex items-center">
                <span>{type.name}</span>
              </div>
              <div className="flex items-center">
                <IconButton
                  onClick={() => {
                    handleEditRoomLocation({
                      id: type.id,
                      name: type.name,
                    });
                  }}
                >
                  <Cog6ToothIcon className="size-4" />
                </IconButton>
                <IconButton
                  onClick={() =>
                    handleDeleteRoomLocation(
                      index,
                      roomLocations,
                      setRoomLocations
                    )
                  }
                >
                  <TrashIcon className="size-4" />
                </IconButton>
              </div>
            </div>
          ))}
        <TextField
          placeholder="เพิ่มสถานที่"
          size="small"
          className="w-full mt-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddRoomLocation(
                (e.target as HTMLInputElement).value,
                roomLocations,
                setRoomLocations
              );
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <div className="my-8" />
        <h3 className="text-lg font-semibold mb-2 text-maincolor">
          สิ่งอำนวยความสะดวก (Room Services)
        </h3>
        {roomFacilities &&
          roomFacilities.map((type, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b py-2"
            >
              <div className="flex items-center">
                <span>{type.name}</span>
              </div>
              <div className="flex items-center">
                <IconButton
                  onClick={() => {
                    handleEditRoomFacility({
                      id: type.id,
                      name: type.name,
                    });
                  }}
                >
                  <Cog6ToothIcon className="size-4" />
                </IconButton>
                <IconButton
                  onClick={() =>
                    handleDeleteRoomFacility(
                      index,
                      roomFacilities,
                      setRoomFacilities
                    )
                  }
                >
                  <TrashIcon className="size-4" />
                </IconButton>
              </div>
            </div>
          ))}
        <TextField
          placeholder="เพิ่มสถานที่"
          size="small"
          className="w-full mt-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddRoomFacility(
                (e.target as HTMLInputElement).value,
                roomFacilities,
                setRoomFacilities
              );
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
      </div>
    </div>
  );
};

export default RoomFilter;
