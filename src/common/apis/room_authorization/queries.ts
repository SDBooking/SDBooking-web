import { coreApi } from "../../../core/connections";
import { TResponseOK } from "../../../types";
import { RoomAuthorizationModel } from "../../../types/room_authorization";
import { ApiRouteKey } from "../../constants/keys";

export function GetAllRoomAuthorizations(): Promise<
  TResponseOK<RoomAuthorizationModel>
> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomAuthorization}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetRoomAuthorizationByRoomID(
  roomID: string
): Promise<TResponseOK<RoomAuthorizationModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomAuthorization}/room/${roomID}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function GetRoomAuthorizationByID(
  id: string
): Promise<TResponseOK<RoomAuthorizationModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .get(`${ApiRouteKey.RoomAuthorization}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
