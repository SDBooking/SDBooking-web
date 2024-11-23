import { coreApi } from "../../../core/connections";
import { TResponse } from "../../../types";
import { Room } from "../../../types/room";
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
      .get(`${ApiRouteKey.Room}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
