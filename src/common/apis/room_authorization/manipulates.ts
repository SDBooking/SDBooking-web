import { coreApi } from "../../../core/connections";
import { TResponse } from "../../../types";
import {
  RoomAuthorizationCreateModel,
  RoomAuthorizationModel,
} from "../../../types/room_authorization";
import { ApiRouteKey } from "../../constants/keys";

export function CreateRoomAuthorization(
  roomAuthorization: RoomAuthorizationCreateModel
): Promise<TResponse<RoomAuthorizationModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(`${ApiRouteKey.RoomAuthorization}/`, roomAuthorization)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function UpdateRoomAuthorization(
  roomAuthorization: RoomAuthorizationModel
): Promise<TResponse<RoomAuthorizationModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(
        `${ApiRouteKey.RoomAuthorization}/${roomAuthorization.id}`,
        roomAuthorization
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function SaveRoomAuthorization(
  roomAuthorization: RoomAuthorizationModel
): Promise<TResponse<RoomAuthorizationModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(
        `${ApiRouteKey.RoomAuthorization}/room/${roomAuthorization.room_id}`,
        roomAuthorization
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DeleteRoomAuthorization(
  id: number
): Promise<TResponse<RoomAuthorizationModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .delete(`${ApiRouteKey.RoomAuthorization}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
