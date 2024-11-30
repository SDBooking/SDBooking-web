import { coreApi } from "../../../core/connections";
import { TResponse } from "../../../types";
import { Room, RoomModelUpdate } from "../../../types/room";
import { ApiRouteKey } from "../../constants/keys";

export function GetAllRooms(): Promise<TResponse<Room>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.Room}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetRoomById(id: number): Promise<TResponse<Room>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.Room}/byID/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetRoomsModel(): Promise<TResponse<RoomModelUpdate>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.Room}/model`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetRoomsModelById(
  id: number
): Promise<TResponse<RoomModelUpdate>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.Room}/model/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
