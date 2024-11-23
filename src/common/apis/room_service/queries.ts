import { coreApi } from "../../../core/connections";
import { TResponse } from "../../../types";
import { RoomServiceDTO } from "../../../types/room_service";
import { ApiRouteKey } from "../../constants/keys";

export function GetAllRoomServices(): Promise<TResponse<RoomServiceDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomService}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetRoomServiceById(
  id: number
): Promise<TResponse<RoomServiceDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomService}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
