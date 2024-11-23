import { coreApi } from "../../../core/connections";
import { TResponseOK } from "../../../types";
import {
  RoomLocationCreateModel,
  RoomLocationDTO,
} from "../../../types/room_location";
import { ApiRouteKey } from "../../constants/keys";

export function CreateRoomLocation(
  RoomLocation: RoomLocationCreateModel
): Promise<TResponseOK<RoomLocationDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(`${ApiRouteKey.RoomLocation}/`, RoomLocation)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function UpdateRoomLocation(
  RoomLocation: RoomLocationDTO
): Promise<TResponseOK<RoomLocationDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.RoomLocation}/${RoomLocation.id}`, RoomLocation)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DeleteRoomLocation(
  id: number
): Promise<TResponseOK<RoomLocationDTO>> {
  return new Promise((resolve, reject) => {
    coreApi
      .delete(`${ApiRouteKey.RoomLocation}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
