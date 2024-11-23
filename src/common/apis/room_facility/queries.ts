import { coreApi } from "../../../core/connections";
import { TResponse } from "../../../types";
import { RoomFacilityDTO } from "../../../types/room_facility";
import { ApiRouteKey } from "../../constants/keys";

export function GetAllRoomFacilities(): Promise<TResponse<RoomFacilityDTO[]>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomFacility}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetRoomFacilityById(
  id: number
): Promise<TResponse<RoomFacilityDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomFacility}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
