import { coreApi } from "../../../core/connections";
import { TResponse } from "../../../types";
import { RoomAuthorizationModel } from "../../../types/room_authorization";
import {
  RoomAuthorizationAccount,
  RoomAuthorizationAccountCreateModel,
} from "../../../types/room_authorization_account";
import { ApiRouteKey } from "../../constants/keys";

export function CreateRoomAuthorizationAccount(
  roomAuthorizationAccount: RoomAuthorizationAccountCreateModel
): Promise<TResponse<RoomAuthorizationModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .post(
        `${ApiRouteKey.RoomAuthorizationAccount}/`,
        roomAuthorizationAccount
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function UpdateRoomAuthorizationAccount(
  roomAuthorizationAccount: RoomAuthorizationAccount
): Promise<TResponse<RoomAuthorizationAccount>> {
  return new Promise((resolve, reject) => {
    coreApi
      .put(
        `${ApiRouteKey.RoomAuthorizationAccount}/${roomAuthorizationAccount.id}`,
        roomAuthorizationAccount
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

export function DeleteRoomAuthorizationAccount(
  id: number
): Promise<TResponse<RoomAuthorizationModel>> {
  return new Promise((resolve, reject) => {
    coreApi
      .delete(`${ApiRouteKey.RoomAuthorizationAccount}/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}
