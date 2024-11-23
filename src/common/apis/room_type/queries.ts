import { coreApi } from "../../../core/connections";
import { TResponse } from "../../../types";
import { RoomTypeDTO } from "../../../types/room_type";
import { ApiRouteKey } from "../../constants/keys";

export function GetAllRoomTypes(): Promise<TResponse<RoomTypeDTO[]>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomType}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetRoomTypeById(id: number): Promise<TResponse<RoomTypeDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomType}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
