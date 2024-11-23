import { coreApi } from "../../../core/connections";
import { TResponse } from "../../../types";
import { RoomLocationDTO } from "../../../types/room_location";
import { ApiRouteKey } from "../../constants/keys";

export function GetAllRoomLocations(): Promise<TResponse<RoomLocationDTO[]>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomLocation}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetRoomLocationById(
  id: number
): Promise<TResponse<RoomLocationDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomLocation}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
