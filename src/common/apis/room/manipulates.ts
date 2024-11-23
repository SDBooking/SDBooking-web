import { coreApi } from "../../../core/connections";
import { TResponse } from "../../../types";
import { Room } from "../../../types/room";
import { ApiRouteKey } from "../../constants/keys";

export function CreateRoom(room: Room): Promise<TResponse<Room>> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(`${ApiRouteKey.Room}/`, room)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function UpdateRoom(room: Room): Promise<TResponse<Room>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(`${ApiRouteKey.Room}/${room.id}`, room)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DeleteRoom(id: number): Promise<TResponse<Room>> {
  return new Promise((resolve, reject) => {
    coreApi
      .delete(`${ApiRouteKey.Room}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
