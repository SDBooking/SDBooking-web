import { coreApi } from "../../../core/connections";
import { TResponseOK } from "../../../types";
import {
  RoomServiceCreateModel,
  RoomServiceModel,
} from "../../../types/room_service";
import { ApiRouteKey } from "../../constants/keys";

export function CreateRoomService(
  RoomService: RoomServiceCreateModel
): Promise<TResponseOK<RoomServiceModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(`${ApiRouteKey.RoomService}/`, RoomService)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function UpdateRoomService(
  RoomService: RoomServiceModel
): Promise<TResponseOK<RoomServiceModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.RoomService}/${RoomService.room_id}`, RoomService)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function SaveRoomService(
  RoomService: RoomServiceModel
): Promise<TResponseOK<RoomServiceModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.RoomService}/${RoomService.room_id}`, RoomService)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DeleteRoomService(
  id: number
): Promise<TResponseOK<RoomServiceModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .delete(`${ApiRouteKey.RoomService}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
